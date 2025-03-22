ALTER TABLE users
    ADD COLUMN public_key TEXT NOT NULL UNIQUE,
    ADD COLUMN encrypted_private_key TEXT;