CREATE TABLE global_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id INTEGER NOT NULL REFERENCES users(id),
    encrypted_message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
