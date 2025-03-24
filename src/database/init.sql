CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY, -- preferably use some random token to id users, avoid IDOR
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY NOT NULL,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    start_time TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP WITHOUT TIME ZONE
);

CREATE TABLE IF NOT EXISTS page_visits (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    session_id TEXT REFERENCES sessions(id) NOT NULL,
    page_url TEXT NOT NULL,
    visited_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    left_at TIMESTAMP WITHOUT TIME ZONE
);

CREATE TABLE IF NOT EXISTS mouse_movement (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    session_id TEXT REFERENCES sessions(id) NOT NULL,
    x_coord INTEGER NOT NULL,
    y_coord INTEGER NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS time_spent (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    session_id TEXT REFERENCES sessions(id) NOT NULL,
    elapsed_time INTEGER DEFAULT 0, -- in milliseconds
    last_modified TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_journey (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    session_id TEXT REFERENCES sessions(id) NOT NULL,
    page_url TEXT NOT NULL,
    time_spent INTEGER NOT NULL
);

INSERT INTO users (id, username, password) VALUES (1, 'admin', 'admin'); -- TODO hash passwords when implementing dashboard
