-- Таблица пользователей
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    firstName TEXT,
    lastName TEXT,
    avatar TEXT,
    google_id TEXT UNIQUE,
    subscription_status TEXT DEFAULT 'free',
    subscription_expiry DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    sync_status TEXT DEFAULT 'synced',
    last_synced DATETIME
);

-- Таблица тренировок
CREATE TABLE IF NOT EXISTS workouts (
    id TEXT PRIMARY KEY,
    local_id TEXT UNIQUE,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    type TEXT,
    date DATETIME NOT NULL,
    duration INTEGER, -- в минутах
    notes TEXT,
    status TEXT DEFAULT 'completed', -- planned, in_progress, completed
    muscle_groups TEXT, -- JSON массив
    exercises_count INTEGER DEFAULT 0,
    sets_count INTEGER DEFAULT 0,
    total_volume REAL,
    sync_status TEXT DEFAULT 'pending', -- pending, synced, conflict
    server_version INTEGER DEFAULT 0,
    local_version INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted BOOLEAN DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

-- Таблица упражнений
CREATE TABLE IF NOT EXISTS exercises (
    id TEXT PRIMARY KEY,
    local_id TEXT UNIQUE,
    workout_id TEXT NOT NULL,
    name TEXT NOT NULL,
    muscle_group TEXT,
    order_index INTEGER DEFAULT 0,
    notes TEXT,
    sync_status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted BOOLEAN DEFAULT 0,
    FOREIGN KEY (workout_id) REFERENCES workouts (id) ON DELETE CASCADE
);

-- Таблица подходов
CREATE TABLE IF NOT EXISTS sets (
    id TEXT PRIMARY KEY,
    local_id TEXT UNIQUE,
    exercise_id TEXT NOT NULL,
    set_number INTEGER NOT NULL,
    weight REAL NOT NULL,
    reps INTEGER NOT NULL,
    completed BOOLEAN DEFAULT 1,
    rest_time INTEGER, -- в секундах
    notes TEXT,
    sync_status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted BOOLEAN DEFAULT 0,
    FOREIGN KEY (exercise_id) REFERENCES exercises (id) ON DELETE CASCADE
);

-- Таблица замеров тела
CREATE TABLE IF NOT EXISTS measurements (
    id TEXT PRIMARY KEY,
    local_id TEXT UNIQUE,
    user_id TEXT NOT NULL,
    date DATETIME NOT NULL,
    weight REAL,
    body_fat REAL,
    chest REAL,
    waist REAL,
    hips REAL,
    arms REAL,
    thighs REAL,
    calves REAL,
    neck REAL,
    notes TEXT,
    sync_status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted BOOLEAN DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

-- Таблица личных рекордов
CREATE TABLE IF NOT EXISTS personal_records (
    id TEXT PRIMARY KEY,
    local_id TEXT UNIQUE,
    user_id TEXT NOT NULL,
    exercise_name TEXT NOT NULL,
    weight REAL NOT NULL,
    reps INTEGER,
    date DATETIME NOT NULL,
    notes TEXT,
    sync_status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted BOOLEAN DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

-- Таблица синхронизации (очередь операций)
CREATE TABLE IF NOT EXISTS sync_queue (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    operation TEXT NOT NULL, -- CREATE, UPDATE, DELETE
    table_name TEXT NOT NULL,
    record_id TEXT NOT NULL,
    data TEXT, -- JSON данные
    retry_count INTEGER DEFAULT 0,
    status TEXT DEFAULT 'pending', -- pending, in_progress, failed, completed
    error TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_workouts_user_id ON workouts (user_id);

CREATE INDEX IF NOT EXISTS idx_workouts_date ON workouts (date);

CREATE INDEX IF NOT EXISTS idx_exercises_workout_id ON exercises (workout_id);

CREATE INDEX IF NOT EXISTS idx_sets_exercise_id ON sets (exercise_id);

CREATE INDEX IF NOT EXISTS idx_measurements_user_date ON measurements (user_id, date);

CREATE INDEX IF NOT EXISTS idx_sync_queue_status ON sync_queue (status);