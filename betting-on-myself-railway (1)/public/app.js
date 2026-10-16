const $ = s => document.querySelector(s);
const app = $('#game');
let session = JSON.parse(localStorage.getItem('bom-session') || 'null');
let state = null;
let soundEnabled = localStorage.getItem('bom-sound') !== 'off';
let audioContext = null;

function unlockSound() {
  const Audio = window.AudioContext || window.webkitAudioContext;
  if (!Audio) return;
  if (!audioContext) audioContext = new Audio();
  if (audioContext.state === 'suspended') audioContext.resume();
}
function tone(frequency, offset, duration, type = 'sine', volume = 0.035) {
  if (!soundEnabled || !audioContext || audioContext.state !== 'running') return;
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  const start = audioContext.currentTime + offset;
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  oscillator.connect(gain).connect(audioContext.destination);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.02);
}
function playSound(name) {
  unlockSound();
  if (name === 'round') { tone(392, 0, 0.12, 'triangle', 0.04); tone(523, 0.1, 0.16, 'triangle', 0.04); }
  if (name === 'turn') tone(440, 0, 0.09, 'sine', 0.025);
  if (name === 'chips') { tone(210, 0, 0.055, 'square', 0.018); tone(320, 0.035, 0.05, 'square', 0.014); }
  if (name === 'reveal') { tone(523, 0, 0.13, 'sine', 0.04); tone(659, 0.1, 0.13, 'sine', 0.04); tone(784, 0.2, 0.22, 'sine', 0.045); }
}
function playStateSound(previous, next) {
  if (!previous) return;
  const wasReveal = ['showdown', 'complete'].includes(previous.phase);
  const isReveal = ['showdown', 'complete'].includes(next.phase);
  if (!wasReveal && isReveal) return playSound('reveal');
  if (next.phase === 'entry' && previous.phase !== 'entry') return playSound('round');
  if (next.pot > previous.pot) return playSound('chips');
  if (next.phase === 'betting' && (previous.phase !== 'betting' || next.turnPlayerId !== previous.turnPlayerId)) playSound('turn');
}
const roomFromLink = new URLSearchParams(location.search).get('room')?.trim().toUpperCase();
if (roomFromLink) { $('#join-code').value = roomFromLink; $('#join-code').readOnly = true; }
async function post(path, data) { const r = await fetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); const j = await r.json(); if (!r.ok) throw Error(j.error); return j; }
function save(s) { session = s; localStorage.setItem('bom-session', JSON.stringify(s)); $('#landing').hidden = true; app.hidden = false; connect(); }
$('#host-form').onsubmit = async e => { e.preventDefault(); try { save(await post('/api/create', { name: $('#host-name').value })); } catch (x) { $('#landing-error').textContent = x.message; } };
$('#join-form').onsubmit = async e => { e.preventDefault(); try { save(await post('/api/join', { code: $('#join-code').value, name: $('#join-name').value })); } catch (x) { $('#landing-error').textContent = x.message; } };
function connect() { if (!session) return; const es = new EventSource(`/api/stream?token=${encodeURIComponent(session.token)}`); es.onmessage = e => { const next = JSON.parse(e.data); playStateSound(state, next); state = next; render(); }; es.onerror = () => setTimeout(() => { es.close(); connect(); }, 1500); }
async function action(action, data = {}) { unlockSound(); try { await post('/api/action', { token: session.token, action, ...data }); } catch (x) { alert(x.message); } }
function chips(n) { return `<div class="chips">${Array.from({ length: Math.min(5, Math.max(0, n / 5)) }, () => '<i class="chip"></i>').join('')}</div>`; }
function table() { const q = state.question; const reveal = ['showdown', 'complete'].includes(state.phase); return `<section class="table"><div class="question"><p class="eyebrow">${q ? q.category : 'Lobby'} · ${state.phase.replaceAll('_', ' ')}</p><h2>${q ? q.prompt : 'Invite 2–9 more players to your table'}</h2><p class="muted">${q ? (reveal ? `Accepted answer` : q.unit) : 'Share the room code or QR-style pattern below.'}</p>${reveal && q ? `<div class="answer">${q.answer.toLocaleString()}</div>` : ''}</div><div class="pot">Current pot<strong>$${state.pot}</strong></div>${reveal ? estimates() : ''}<div class="seats">${state.players.map(p => `<div class="seat ${p.id === state.turnPlayerId ? 'active' : ''} ${p.folded || p.eliminated ? 'folded' : ''}">${chips(p.committed)}<div class="avatar">${p.name[0].toUpperCase()}</div>${p.name}${p.id === state.turnPlayerId ? ' · to act' : ''}<br><span class="stack">$${p.stack}</span></div>`).join('')}</div><div class="log">${state.log.at(-1) || ''}</div></section>`; }
function estimates() { const q = state.question; const eligible = state.players.filter(p => p.entered && !p.folded); const best = Math.min(...eligible.map(p => Math.abs(p.estimate - q.answer))); return `<div class="estimates">${state.players.filter(p => p.entered).map(p => `<div class="estimate-card ${!p.folded && Math.abs(p.estimate - q.answer) === best ? 'win' : ''}">${p.name}${p.folded ? ' · folded' : ''}<br><b>${Number(p.estimate).toLocaleString()}</b><br>${Math.abs(p.estimate - q.answer).toLocaleString()} away</div>`).join('')}</div>`; }
function lobbyPanel() {
  const canStart = state.viewer.isHost && state.playerCount >= 3;
  const joinUrl = `${location.origin}/?room=${encodeURIComponent(state.code)}`;
  const hostControls = state.viewer.isHost ? `<label class="muted" style="display:block;margin-top:14px">Game length</label><select id="timer" style="width:100%;padding:10px;margin:6px 0;border-radius:9px"><option value="0">Knockout game</option><option value="15">15 minutes</option><option value="30">30 minutes</option><option value="45">45 minutes</option></select>${canStart ? '<button class="primary" onclick="startGame()">Start game</button>' : '<p class="muted">A full game needs 3 players. You can still test the complete flow now.</p><button class="secondary" onclick="startPractice()">Start practice round</button>'}` : '';
  return `<h2>Your room</h2><p>Scan the QR code to open this room on a phone, or enter the code manually.</p><div class="room-code">${state.code}</div><img class="qr" src="/api/qr?data=${encodeURIComponent(joinUrl)}" alt="Scan to join room ${state.code}"><p class="muted qr-note">This QR opens the game with room ${state.code} ready to join.</p><div class="player-list">${state.players.map(p => `<span class="player-pill">${p.name}${p.isHost ? ' · host' : ''}</span>`).join('')}</div><p><b>${state.playerCount}/10</b> players · minimum 3 for a full game</p><h3>Vote for the first pack</h3><div class="vote">${['Mixed', 'Science', 'History', 'Geography', 'Sports'].map(p => `<button class="${state.votes[state.viewer.id] === p ? 'selected' : ''}" onclick="vote('${p}')">${p}</button>`).join('')}</div>${hostControls}`;
}
function entryPanel() { if (state.viewer.entered) return `<h2>Estimate locked</h2><p>Your number is private. Wait for the host to open betting.</p><p class="muted">You entered for $5.</p>${state.viewer.isHost ? '<button class="primary" onclick="beginBetting()">Begin betting</button>' : ''}`; if (state.viewer.folded) return `<h2>Sitting this round out</h2><p>You paid nothing and can watch the betting.</p>${state.viewer.isHost ? '<button class="primary" onclick="beginBetting()">Begin betting</button>' : ''}`; return `<h2>Enter this round?</h2><p>Locking an estimate adds a $5 chip. Folding now costs nothing.</p><input class="estimate" id="estimate" inputmode="decimal" placeholder="Enter a number"><button class="primary" onclick="enterRound()">Lock estimate · enter for $5</button><button class="secondary danger" style="width:100%;margin-top:8px" onclick="sitOut()">Fold this round · no cost</button>`; }
function bettingPanel() { if (!state.viewer.canAct) return `<h2>Betting live</h2><p>${state.players.find(p => p.id === state.turnPlayerId)?.name || 'A player'} is deciding.</p><p class="muted">Your estimate remains private.</p>`; const call = Math.max(0, state.currentBet - state.viewer.committed); return `<h2>Your turn</h2><p>Current wager: <b>$${state.currentBet}</b><br>To call: <b>$${call}</b></p><div class="action-grid"><button class="secondary danger" onclick="act('fold')">Fold</button><button class="secondary" onclick="act('call')">${call ? `Call $${call}` : 'Check'}</button><button class="primary" onclick="toggleRaise()">Raise</button><button class="secondary" onclick="act('allin')">All-in $${state.viewer.stack}</button></div><div class="raise" id="raise"><p>Raise by (five-dollar increments)</p><div class="quick"><button onclick="setRaise(5)">+$5</button><button onclick="setRaise(10)">+$10</button><button onclick="setRaise(25)">+$25</button></div><input id="raiseBy" type="number" min="5" step="5" value="5"><button class="primary" onclick="submitRaise()">Confirm raise</button></div>`; }
function resultPanel() { const isHost = state.viewer.isHost; const eliminated = state.players.filter(p => p.eliminated); return `<h2>${state.phase === 'tiebreaker' ? 'Tiebreaker needed' : 'Round complete'}</h2><p>${state.phase === 'tiebreaker' ? 'The tied players will get a fresh no-bet question.' : 'The host can advance when ready.'}</p>${isHost ? `<button class="primary" onclick="advance()">Next question</button>${eliminated.length ? `<div class="host-controls"><h3>Host rebuys</h3>${eliminated.map(p => `<p>${p.name}: $0<br><button class="secondary" onclick="rebuy('${p.id}',25)">+$25</button> <button class="secondary" onclick="rebuy('${p.id}',50)">+$50</button> <button class="secondary" onclick="rebuy('${p.id}',100)">Reset $100</button></p>`).join('')}</div>` : ''}` : '<p class="muted">Waiting for the host.</p>'}`; }
function tiebreakPanel() { if (!state.tiedIds.includes(state.viewer.id)) return `<h2>Tiebreaker in progress</h2><p>The tied players are making fresh private estimates. No chips are added.</p>`; return `<h2>Break the tie</h2><p>This is a new private estimate. No entry chip or betting is required.</p><input class="estimate" id="tieEstimate" inputmode="decimal" placeholder="Enter a number"><button class="primary" onclick="enterTiebreak()">Lock tiebreaker estimate</button>`; }
function render() { if (!state) return; const panel = state.phase === 'lobby' ? lobbyPanel() : state.phase === 'entry' ? entryPanel() : state.phase === 'betting' ? bettingPanel() : state.phase === 'tiebreaker_entry' ? tiebreakPanel() : resultPanel(); app.innerHTML = `<div class="shell"><header class="topbar"><div class="brand">Betting on <em>Myself</em></div><div class="header-actions"><button class="audio-toggle" onclick="toggleSound()" aria-label="Toggle sound effects">SFX</button><div class="badge">Room ${state.code} · ${state.playerCount} players</div></div></header><div class="game-layout">${table()}<aside class="phone">${panel}</aside></div></div>`; }
window.toggleSound = () => { soundEnabled = !soundEnabled; localStorage.setItem('bom-sound', soundEnabled ? 'on' : 'off'); if (soundEnabled) { unlockSound(); tone(523, 0, 0.1, 'sine', 0.03); } render(); }; window.vote = p => action('vote', { pack: p }); window.startGame = () => action('start', { timerMinutes: Number($('#timer').value) }); window.startPractice = () => action('start', { timerMinutes: Number($('#timer').value), practice: true }); window.beginBetting = () => action('beginBetting'); window.enterRound = () => action('enter', { estimate: $('#estimate').value }); window.enterTiebreak = () => action('tiebreakEnter', { estimate: $('#tieEstimate').value }); window.sitOut = () => action('sitout'); window.act = a => action(a); window.toggleRaise = () => $('#raise').classList.toggle('open'); window.setRaise = n => $('#raiseBy').value = n; window.submitRaise = () => action('raise', { raiseBy: Number($('#raiseBy').value) }); window.advance = () => action('advance'); window.rebuy = (playerId, amount) => action('rebuy', { playerId, amount });
if (session) { $('#landing').hidden = true; app.hidden = false; connect(); }
