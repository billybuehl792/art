CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,

    title TEXT NOT NULL,
    description TEXT,

    type TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS media (
    id SERIAL PRIMARY KEY,

    project_id INTEGER NOT NULL
        REFERENCES projects(id)
        ON DELETE CASCADE,

    title TEXT,
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    media_type TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);