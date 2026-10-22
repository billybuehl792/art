CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,

    title TEXT NOT NULL,
    subtitle TEXT NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    
    category TEXT,
    link TEXT,

    media_type TEXT,
    media_url TEXT,
    thumbnail_url TEXT,

    priority INTEGER NOT NULL DEFAULT 1,
    sort_order INTEGER NOT NULL DEFAULT 0,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);