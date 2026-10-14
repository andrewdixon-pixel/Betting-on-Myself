import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { randomBytes } from 'node:crypto';
import { questions, questionsForPack } from './questions.mjs';

const PORT = Number(process.env.PORT || 3000);
const rooms = new Map();
const timers = new Map();
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8' };

const id = (n = 12) => randomBytes(n).toString('base64url');
const code = () => id(4).toUpperCase().slice(0, 6);
const money = n => Math.max(0, Math.round(n / 5) * 5);
const active = room => room.players.filter(p => !p.eliminated);
const current = room => room.players.find(p => p.id === room.turnPlayerId);

function createRoom(name) {
  let roomCode = code(); while (rooms.has(roomCode)) roomCode = code();
  const host = { id: id(), token: id(18), name: name || 'Host', stack: 100, committed: 0, entered: false, folded: false, estimate: null, eliminated: false, isHost: true };
  const room = { code: roomCode, hostId: host.id, players: [host], phase: 'lobby', pack: 'Mixed', votes: {}, questionIndex: 0, question: null, pot: 0, currentBet: 0, turnPlayerId: null, openerIndex: 0, log: ['Room created. Share the code to invite players.'], streams: new Map(), timerMinutes: 0, timerEndsAt: null, gameStartedAt: null };
  rooms.set(roomCode, room); return { room, player: host };
}
function roomForToken(token) { for (const room of rooms.values()) { const player = room.players.find(p => p.token === token); if (player) return { room, player }; } return {}; }
function publicState(room, viewer) {
  const reveal = ['showdown', 'complete'].includes(room.phase);
  return {
    code: room.code, phase: room.phase, pack: room.pack, pot: room.pot, currentBet: room.currentBet, turnPlayerId: room.turnPlayerId, timerEndsAt: room.timerEndsAt,
    question: room.question && { category: room.question.category, prompt: room.question.prompt, unit: room.question.unit, answer: reveal ? room.question.answer : null },
    players: room.players.map(p => ({ id: p.id, name: p.name, stack: p.stack, committed: p.committed, entered: p.entered, folded: p.folded, eliminated: p.eliminated, isHost: p.isHost, estimate: reveal ? p.estimate : undefined })),
    votes: room.votes, tiedIds: room.tiedIds || [], log: room.log.slice(-5), viewer: { id: viewer.id, name: viewer.name, stack: viewer.stack, isHost: viewer.isHost, estimate: viewer.estimate, committed: viewer.committed, entered: viewer.entered, folded: viewer.folded, canAct: room.turnPlayerId === viewer.id },
    playerCount: room.players.length
  };
}
function send(room) { for (const [token, res] of room.streams) { const p = room.players.find(x => x.token === token); if (p) res.write(`data: ${JSON.stringify(publicState(room, p))}\n\n`); } }
function log(room, message) { room.log.push(message); if (room.log.length > 30) room.log.shift(); }
function resetRoundPlayers(room) { room.players.forEach(p => { p.committed = 0; p.entered = false; p.folded = false; p.estimate = null; }); room.pot = 0; room.currentBet = 0; room.turnPlayerId = null; }
function startEntry(room) { resetRoundPlayers(room); const pack = questionsForPack(room.pack); room.question = pack[room.questionIndex++ % pack.length]; room.phase = 'entry'; log(room, `${room.question.category} question opened. Enter for $5 or fold for free.`); }
function endTimedGame(room) {
  if (room.phase === 'game_complete') return;
  room.phase = 'game_complete'; room.turnPlayerId = null;
  const high = Math.max(...room.players.map(p => p.stack));
  const winners = room.players.filter(p => p.stack === high);
  log(room, winners.length === 1 ? `Time is up. ${winners[0].name} wins with $${high}.` : `Time is up. ${winners.map(p => p.name).join(' and ')} are tied at $${high}.`);
  send(room);
}
function nextTurn(room, fromId) {
  const contenders = room.players.filter(p => p.entered && !p.folded && !p.eliminated);
  if (contenders.length <= 1) return finishByFold(room);
  let start = room.players.findIndex(p => p.id === fromId);
  for (let offset = 1; offset <= room.players.length; offset++) { const candidate = room.players[(start + offset) % room.players.length]; if (contenders.includes(candidate)) { room.turnPlayerId = candidate.id; return; } }
}
function bettingComplete(room) { return room.players.filter(p => p.entered && !p.folded).every(p => p.committed === room.currentBet || p.stack === 0); }
function finishByFold(room) { const winner = room.players.find(p => p.entered && !p.folded); if (winner) { winner.stack += room.pot; log(room, `${winner.name} wins $${room.pot}; everyone else folded.`); } finishRound(room); }
function finishRound(room) { room.phase = 'complete'; room.turnPlayerId = null; room.players.forEach(p => { p.eliminated = p.stack <= 0; }); send(room); }
function buildSidePots(room) {
  const levels = [...new Set(room.players.filter(p => p.committed > 0).map(p => p.committed))].sort((a, b) => a - b);
  let previous = 0;
  return levels.map(level => {
    const contributors = room.players.filter(p => p.committed >= level);
    const eligibleIds = contributors.filter(p => p.entered && !p.folded).map(p => p.id);
    const pot = { amount: (level - previous) * contributors.length, eligibleIds };
    previous = level;
    return pot;
  }).filter(p => p.amount > 0 && p.eligibleIds.length);
}
function nextQuestion(room) { const pack = questionsForPack(room.pack); return pack[room.questionIndex++ % pack.length]; }
function startTiebreaker(room) {
  const tie = room.tieQueue[0];
  room.tiedIds = tie.winnerIds;
  room.roundQuestion = room.roundQuestion || room.question;
  room.question = nextQuestion(room);
  room.players.forEach(p => { p.tiebreakEstimate = null; });
  room.phase = 'tiebreaker_entry';
  log(room, `Tiebreaker for $${tie.amount}: ${tie.winnerIds.map(id => room.players.find(p => p.id === id).name).join(' and ')} must enter a new estimate.`);
}
function settleTiebreaker(room) {
  const tie = room.tieQueue[0];
  const contenders = room.players.filter(p => tie.winnerIds.includes(p.id));
  const best = Math.min(...contenders.map(p => Math.abs(p.tiebreakEstimate - room.question.answer)));
  const winners = contenders.filter(p => Math.abs(p.tiebreakEstimate - room.question.answer) === best);
  if (winners.length > 1) {
    tie.winnerIds = winners.map(p => p.id);
    return startTiebreaker(room);
  }
  const winner = winners[0];
  winner.stack += tie.amount;
  log(room, `${winner.name} won the $${tie.amount} tiebreaker pot.`);
  room.tieQueue.shift();
  if (room.tieQueue.length) return startTiebreaker(room);
  room.question = room.roundQuestion;
  room.roundQuestion = null;
  room.phase = 'showdown';
  room.players.forEach(p => { p.eliminated = p.stack <= 0; });
}
function showdown(room) {
  const pots = buildSidePots(room);
  room.sidePots = pots;
  room.tieQueue = [];
  pots.forEach(pot => {
    const contenders = room.players.filter(p => pot.eligibleIds.includes(p.id));
    const best = Math.min(...contenders.map(p => Math.abs(p.estimate - room.question.answer)));
    const winners = contenders.filter(p => Math.abs(p.estimate - room.question.answer) === best);
    if (winners.length > 1) room.tieQueue.push({ ...pot, winnerIds: winners.map(p => p.id) });
    else { winners[0].stack += pot.amount; log(room, `${winners[0].name} wins a $${pot.amount} pot.`); }
  });
  if (room.tieQueue.length) return startTiebreaker(room);
  room.phase = 'showdown';
  room.players.forEach(p => { p.eliminated = p.stack <= 0; });
}
function startBetting(room) {
  const entered = room.players.filter(p => p.entered && !p.folded);
  if (entered.length <= 1) return finishByFold(room);
  room.phase = 'betting';
  const eligible = entered; const opener = eligible[room.openerIndex % eligible.length]; room.openerIndex = (room.openerIndex + 1) % eligible.length;
  room.turnPlayerId = opener.id; log(room, `${opener.name} opens the betting.`);
}
function applyAction(room, player, action, payload = {}) {
  if (action === 'vote' && room.phase === 'lobby') { room.votes[player.id] = payload.pack; log(room, `${player.name} voted for ${payload.pack}.`); return; }
  if (action === 'start' && player.isHost && room.phase === 'lobby' && room.players.length >= 3) {
    room.gameStartedAt = Date.now(); room.timerMinutes = Number(payload.timerMinutes) || 0;
    const counts = Object.values(room.votes).reduce((all, pack) => ({ ...all, [pack]: (all[pack] || 0) + 1 }), {});
    room.pack = Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0] || 'Mixed';
    if (room.timerMinutes > 0) { room.timerEndsAt = Date.now() + room.timerMinutes * 60000; timers.set(room.code, setTimeout(() => endTimedGame(room), room.timerMinutes * 60000)); }
    startEntry(room); return;
  }
  if (action === 'enter' && room.phase === 'entry' && !player.eliminated && !player.entered) {
    const estimate = Number(payload.estimate); if (!Number.isFinite(estimate) || estimate < 0 || player.stack < 5) throw Error('Enter a valid number and have at least $5.');
    player.estimate = estimate; player.entered = true; player.stack -= 5; player.committed = 5; room.pot += 5; log(room, `${player.name} entered the round.`); return;
  }
  if (action === 'sitout' && room.phase === 'entry' && !player.entered) { player.folded = true; log(room, `${player.name} sat this round out.`); return; }
  if (action === 'beginBetting' && player.isHost && room.phase === 'entry') { startBetting(room); return; }
  if (action === 'advance' && player.isHost && ['showdown', 'complete'].includes(room.phase)) { startEntry(room); return; }
  if (action === 'rebuy' && player.isHost) { const target = room.players.find(p => p.id === payload.playerId); const amount = Number(payload.amount); if (!target || ![25, 50, 100].includes(amount)) throw Error('Invalid rebuy.'); target.stack = amount === 100 ? 100 : target.stack + amount; target.eliminated = false; log(room, `Host gave ${target.name} ${amount === 100 ? 'a full $100 reset' : '$' + amount}.`); return; }
  if (action === 'tiebreakEnter' && room.phase === 'tiebreaker_entry') {
    if (!room.tiedIds.includes(player.id)) throw Error('Only tied players may answer this question.');
    const estimate = Number(payload.estimate); if (!Number.isFinite(estimate) || estimate < 0) throw Error('Enter a valid number.');
    player.tiebreakEstimate = estimate;
    const allIn = room.tiedIds.every(id => room.players.find(p => p.id === id).tiebreakEstimate !== null);
    if (allIn) settleTiebreaker(room); else log(room, `${player.name} locked a tiebreaker estimate.`);
    return;
  }
  if (room.phase !== 'betting' || room.turnPlayerId !== player.id) throw Error('It is not your turn.');
  if (action === 'fold') { player.folded = true; log(room, `${player.name} folded.`); nextTurn(room, player.id); return; }
  if (action === 'call') { const add = Math.min(player.stack, room.currentBet - player.committed); player.stack -= add; player.committed += add; room.pot += add; log(room, `${player.name} ${add ? 'called' : 'checked'}.`); if (bettingComplete(room)) return showdown(room); nextTurn(room, player.id); return; }
  if (action === 'raise') { const raiseBy = Number(payload.raiseBy); if (!Number.isInteger(raiseBy) || raiseBy < 5 || raiseBy % 5) throw Error('Raises must be in $5 increments.'); const target = room.currentBet + raiseBy; const add = target - player.committed; if (add > player.stack) throw Error('You do not have enough chips for that raise.'); player.stack -= add; player.committed = target; room.currentBet = target; room.pot += add; log(room, `${player.name} raised by $${raiseBy}.`); nextTurn(room, player.id); return; }
  if (action === 'allin') { const add = player.stack; player.stack = 0; player.committed += add; room.pot += add; if (player.committed > room.currentBet) room.currentBet = player.committed; log(room, `${player.name} is all-in.`); if (bettingComplete(room)) return showdown(room); nextTurn(room, player.id); return; }
  throw Error('Unknown action.');
}
function json(res, status, body) { res.writeHead(status, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(body)); }
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (req.method === 'GET' && url.pathname === '/api/stream') { const { room, player } = roomForToken(url.searchParams.get('token')); if (!room) return json(res, 401, { error: 'Invalid session.' }); res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' }); room.streams.set(player.token, res); res.write(`data: ${JSON.stringify(publicState(room, player))}\n\n`); req.on('close', () => room.streams.delete(player.token)); return; }
  if (req.method === 'POST' && url.pathname.startsWith('/api/')) { let body = ''; for await (const chunk of req) body += chunk; try { body = JSON.parse(body || '{}'); } catch { return json(res, 400, { error: 'Invalid JSON.' }); }
    try {
      if (url.pathname === '/api/create') { const { room, player } = createRoom(body.name); return json(res, 200, { code: room.code, token: player.token, playerId: player.id }); }
      if (url.pathname === '/api/join') { const room = rooms.get(String(body.code || '').toUpperCase()); if (!room) throw Error('Room not found.'); if (room.players.length >= 10) throw Error('This table is full.'); if (room.phase !== 'lobby') throw Error('This game has already started.'); const name = String(body.name || '').trim().slice(0, 20); if (!name) throw Error('Choose a display name.'); const player = { id: id(), token: id(18), name, stack: 100, committed: 0, entered: false, folded: false, estimate: null, eliminated: false, isHost: false }; room.players.push(player); log(room, `${name} joined the table.`); send(room); return json(res, 200, { code: room.code, token: player.token, playerId: player.id }); }
      const { room, player } = roomForToken(body.token); if (!room) throw Error('Session expired.'); applyAction(room, player, body.action, body); send(room); return json(res, 200, { ok: true });
    } catch (error) { return json(res, 400, { error: error.message }); }
  }
  const file = url.pathname === '/' ? '/index.html' : url.pathname; const safe = normalize(file).replace(/^\.\.(\/|\\|$)/, '');
  try { const bytes = await readFile(join(process.cwd(), 'public', safe)); res.writeHead(200, { 'Content-Type': mime[extname(safe)] || 'application/octet-stream' }); res.end(bytes); } catch { res.writeHead(404); res.end('Not found'); }
});
server.listen(PORT, () => console.log(`Betting on Myself is running at http://localhost:${PORT}`));
