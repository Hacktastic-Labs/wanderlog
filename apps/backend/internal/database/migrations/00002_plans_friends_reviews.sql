-- +goose Up

-- Place reviews live on visits (rating + review). No separate reviews table for now.

CREATE TABLE friendships (
    id BIGSERIAL PRIMARY KEY,

    user_id BIGINT NOT NULL REFERENCES users(id),
    friend_id BIGINT NOT NULL REFERENCES users(id),

    status TEXT NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'accepted', 'rejected', 'blocked')),

    requested_by BIGINT NOT NULL REFERENCES users(id),
    requested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    accepted_at TIMESTAMPTZ,

    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CHECK (user_id <> friend_id),
    UNIQUE (user_id, friend_id)
);

CREATE TABLE plans (
    id BIGSERIAL PRIMARY KEY,

    title TEXT NOT NULL,
    description TEXT,

    visibility TEXT NOT NULL DEFAULT 'private'
        CHECK (visibility IN ('public', 'private')),

    status TEXT NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),

    created_by BIGINT NOT NULL REFERENCES users(id),

    start_date DATE,
    end_date DATE,

    estimated_cost NUMERIC(12, 2),
    actual_cost NUMERIC(12, 2),

    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE plan_members (
    id BIGSERIAL PRIMARY KEY,

    plan_id BIGINT NOT NULL REFERENCES plans(id),
    user_id BIGINT NOT NULL REFERENCES users(id),

    role TEXT NOT NULL DEFAULT 'participant'
        CHECK (role IN ('owner', 'editor', 'participant')),

    joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    UNIQUE (plan_id, user_id)
);

CREATE TABLE plan_invitations (
    id BIGSERIAL PRIMARY KEY,

    plan_id BIGINT NOT NULL REFERENCES plans(id),
    invited_user_id BIGINT NOT NULL REFERENCES users(id),
    invited_by BIGINT NOT NULL REFERENCES users(id),

    status TEXT NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'accepted', 'declined')),

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    UNIQUE (plan_id, invited_user_id)
);

CREATE TABLE plan_items (
    id BIGSERIAL PRIMARY KEY,

    plan_id BIGINT NOT NULL REFERENCES plans(id),
    place_id BIGINT REFERENCES places(id),

    title TEXT NOT NULL,
    description TEXT,

    activity_type TEXT,

    start_time TIMESTAMPTZ,
    end_time TIMESTAMPTZ,

    estimated_cost NUMERIC(12, 2),
    actual_cost NUMERIC(12, 2),

    notes TEXT,

    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE plan_item_participants (
    id BIGSERIAL PRIMARY KEY,

    plan_item_id BIGINT NOT NULL REFERENCES plan_items(id),
    user_id BIGINT NOT NULL REFERENCES users(id),

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    UNIQUE (plan_item_id, user_id)
);

CREATE TABLE expenses (
    id BIGSERIAL PRIMARY KEY,

    plan_id BIGINT NOT NULL REFERENCES plans(id),
    plan_item_id BIGINT REFERENCES plan_items(id),

    title TEXT NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,

    paid_by BIGINT NOT NULL REFERENCES users(id),
    currency TEXT NOT NULL DEFAULT 'USD',

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE expense_participants (
    id BIGSERIAL PRIMARY KEY,

    expense_id BIGINT NOT NULL REFERENCES expenses(id),
    user_id BIGINT NOT NULL REFERENCES users(id),

    amount_owed NUMERIC(12, 2) NOT NULL DEFAULT 0,
    amount_paid NUMERIC(12, 2) NOT NULL DEFAULT 0,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    UNIQUE (expense_id, user_id)
);

-- Helpful indexes

CREATE INDEX idx_friendships_user_id
ON friendships(user_id);

CREATE INDEX idx_friendships_friend_id
ON friendships(friend_id);

CREATE INDEX idx_friendships_status
ON friendships(status);

CREATE INDEX idx_plans_created_by
ON plans(created_by);

CREATE INDEX idx_plans_status
ON plans(status);

CREATE INDEX idx_plan_members_plan_id
ON plan_members(plan_id);

CREATE INDEX idx_plan_members_user_id
ON plan_members(user_id);

CREATE INDEX idx_plan_invitations_plan_id
ON plan_invitations(plan_id);

CREATE INDEX idx_plan_invitations_invited_user_id
ON plan_invitations(invited_user_id);

CREATE INDEX idx_plan_items_plan_id
ON plan_items(plan_id);

CREATE INDEX idx_plan_items_place_id
ON plan_items(place_id);

CREATE INDEX idx_plan_item_participants_plan_item_id
ON plan_item_participants(plan_item_id);

CREATE INDEX idx_plan_item_participants_user_id
ON plan_item_participants(user_id);

CREATE INDEX idx_expenses_plan_id
ON expenses(plan_id);

CREATE INDEX idx_expenses_plan_item_id
ON expenses(plan_item_id);

CREATE INDEX idx_expenses_paid_by
ON expenses(paid_by);

CREATE INDEX idx_expense_participants_expense_id
ON expense_participants(expense_id);

CREATE INDEX idx_expense_participants_user_id
ON expense_participants(user_id);

-- +goose Down

DROP TABLE IF EXISTS expense_participants;
DROP TABLE IF EXISTS expenses;
DROP TABLE IF EXISTS plan_item_participants;
DROP TABLE IF EXISTS plan_items;
DROP TABLE IF EXISTS plan_invitations;
DROP TABLE IF EXISTS plan_members;
DROP TABLE IF EXISTS plans;
DROP TABLE IF EXISTS friendships;
