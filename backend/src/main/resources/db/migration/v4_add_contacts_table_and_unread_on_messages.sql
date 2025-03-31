CREATE TABLE contacts (
    id BIGSERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    contact_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_message_at TIMESTAMP WITH TIME ZONE

    UNIQUE(user_id, contact_id). 
    CHECK (user_id != contact_id)
);

ALTER TABLE messages
    ADD COLUMN IF NOT EXISTS is_read BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX idx_contacts_user ON contacts(user_id, contact_id);
CREATE INDEX idx_messages_unread ON messages(recipient_id, is_read) WHERE NOT is_read;
CREATE INDEX idx_contacts_last_message ON contacts(last_message_at DESC);
CREATE INDEX idx_message_conversation ON messages(
    LEAST(sender_id::bigint, recipient_id::bigint),
    GREATEST(sender_id::bigint, recipient_id::bigint),
    created_at DESC
);