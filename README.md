# webvitals
Let users have full control over their analytics.

# Testing Instructions

Please install docker and docker-compose.

The Makefile contains the following shortcuts:
- `make up` - starts the event server
- `make down` - stops the event server
- `make logs` - view server logs

Install `http-server` globally using npm: `npm install -g http-server`

Pivot to `widget/` and run `http-server --cors -p 8000` to serve index.html.

Start the event server with `make up` and go to http://localhost:8000.
