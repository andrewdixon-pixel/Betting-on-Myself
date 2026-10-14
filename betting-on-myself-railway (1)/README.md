# Betting on Myself

Multiplayer, poker-inspired numerical trivia game. One browser hosts the shared board; every player joins from their phone using the same room code.

## Current MVP

- Three to ten players per room
- Host and player roles, with private estimates
- $5 round entry, no-cost pre-round fold, and poker-style betting controls
- Shared chip/pot display, turn state, showdown, rebuys, all-ins, side pots, and no-bet tiebreakers
- Server-sent live updates; no third-party runtime dependencies

## Run locally

```bash
npm start
```

Then open `http://localhost:3000` in the host browser. Phone players use the same public URL once the service is deployed.

## Container deployment

```bash
docker build -t betting-on-myself .
docker run --rm -p 3000:3000 betting-on-myself
```

The service honors `PORT`. It keeps active rooms in memory, so deploy one replica for the first release and avoid restarts during a game. A production scale-out version should put room state in a shared store and route all clients in one room consistently.

## Before public launch

1. Replace the development seed with a fully sourced 50-question mixed pack.
2. Add a real QR-code generator for the public room URL.
3. Configure HTTPS and a stable public URL on the chosen host.
4. Add persistent room storage if games need to survive service restarts.
