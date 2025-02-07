CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    start_time TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP WITHOUT TIME ZONE
);

CREATE TABLE IF NOT EXISTS page_visits (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    session_id TEXT REFERENCES sessions(id),
    page_url TEXT,
    visited_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    left_at TIMESTAMP WITHOUT TIME ZONE
);

CREATE TABLE IF NOT EXISTS mouse_movement (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    session_id TEXT REFERENCES sessions(id),
    x_coord INTEGER NOT NULL,
    y_coord INTEGER NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS time_spent (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    session_id TEXT REFERENCES sessions(id),
    elapsed_time INTEGER DEFAULT 0, -- in seconds
    last_modified TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (id, username, password) VALUES (1, 'admin', 'admin'); -- TODO hash passwords when implementing dashboard
