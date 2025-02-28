# webvitals
Let users have full control over their analytics.

# Development instructions

Please install docker, docker-compose, npm and nodejs.

The Makefile contains the following shortcuts:
- `make up` - starts the event server
- `make down` - stops the event server
- `make logs` - view server logs

## Generating Prisma migration
Do the following and push every time there is a schema change:
```
cd ./backend/event_server
npm i # so prisma isn't installed instead as a dev dependency
make up
DB_URL="postgres://webvitals:password@localhost:5432/db" npx prisma migrate dev --name init
make down
```

# Test instructions

Install `http-server` globally using npm: `npm install -g http-server`

Pivot to `widget/` and run `http-server --cors -p 8000` to serve index.html.

Start the event server with `make up` and go to http://localhost:8000.
