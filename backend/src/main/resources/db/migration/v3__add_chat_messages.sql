CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT get_random_uuid(),
    sender_id INTEGER NOT NULL REFERENCES users(id),
    recipient_id INTEGER NOT NULL REFERENCES users(id),
    encrypted_message TEXT NOT NULL,
    encrypted_key_recipient TEXT NOT NULL,
    encrypted_key_sender TEXT NOT NULL,
    iv TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_messages_sender_receiver ON messages(sender_id, recipient_id);