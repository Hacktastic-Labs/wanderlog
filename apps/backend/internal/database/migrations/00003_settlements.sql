-- +goose Up

-- Person-to-person paybacks within a plan (e.g. Venmo/cash).
-- Multi-payer activities use multiple expense rows tied to the same plan_item_id.

CREATE TABLE settlements (
    id BIGSERIAL PRIMARY KEY,

    plan_id BIGINT NOT NULL REFERENCES plans(id),

    from_user_id BIGINT NOT NULL REFERENCES users(id),
    to_user_id BIGINT NOT NULL REFERENCES users(id),

    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    currency TEXT NOT NULL DEFAULT 'USD',

    notes TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CHECK (from_user_id <> to_user_id)
);

CREATE INDEX idx_settlements_plan_id
ON settlements(plan_id);

CREATE INDEX idx_settlements_from_user_id
ON settlements(from_user_id);

CREATE INDEX idx_settlements_to_user_id
ON settlements(to_user_id);

-- +goose Down

DROP TABLE IF EXISTS settlements;
