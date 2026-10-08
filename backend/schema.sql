CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,

    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT,

    category TEXT,

    link TEXT,
    media_type TEXT,
    media_url TEXT,
    thumbnail_url TEXT,

    sort_order INTEGER NOT NULL DEFAULT 0,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);