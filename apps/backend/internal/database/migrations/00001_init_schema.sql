-- +goose Up

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,

    auth_user_id UUID NOT NULL UNIQUE,

    username TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,

    avatar_url TEXT,

    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE places (
    id BIGSERIAL PRIMARY KEY,

    name TEXT NOT NULL,

    description TEXT,

    address TEXT,

    city TEXT,
    state TEXT,
    country TEXT,

    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,

    cover_image_url TEXT,

    created_by BIGINT REFERENCES users(id),

    source_type TEXT NOT NULL DEFAULT 'system',

    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE visits (
    id BIGSERIAL PRIMARY KEY,

    user_id BIGINT NOT NULL REFERENCES users(id),
    place_id BIGINT NOT NULL REFERENCES places(id),

    rating SMALLINT CHECK (rating BETWEEN 1 AND 5),

    review TEXT,

    visited_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Helpful indexes

CREATE INDEX idx_users_auth_user_id
ON users(auth_user_id);

CREATE INDEX idx_users_username
ON users(username);

CREATE INDEX idx_places_city
ON places(city);

CREATE INDEX idx_places_state
ON places(state);

CREATE INDEX idx_places_country
ON places(country);

CREATE INDEX idx_visits_user_id
ON visits(user_id);

CREATE INDEX idx_visits_place_id
ON visits(place_id);

CREATE INDEX idx_visits_visited_at
ON visits(visited_at);

-- +goose Down

DROP TABLE IF EXISTS visits;
DROP TABLE IF EXISTS places;
DROP TABLE IF EXISTS users;