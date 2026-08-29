-- ============================================================
-- V1__create_tables.sql
-- Создание таблиц для AvtoAnalytics
-- ============================================================

-- 1. Пользователи
CREATE TABLE IF NOT EXISTS avto_analytics_users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    phone VARCHAR(20),
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    is_private_seller BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Автомобили (справочник)
CREATE TABLE IF NOT EXISTS avto_analytics_cars (
    id BIGSERIAL PRIMARY KEY,
    make VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    year INT,
    engine_volume DOUBLE PRECISION,
    horsepower INT,
    transmission VARCHAR(20),
    drive_type VARCHAR(20),
    body_type VARCHAR(30),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Объявления
CREATE TABLE IF NOT EXISTS avto_analytics_ads (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES avto_analytics_users(id) ON DELETE CASCADE,
    car_id BIGINT NOT NULL REFERENCES avto_analytics_cars(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(15,2) NOT NULL,
    mileage INT,
    city VARCHAR(100),
    address VARCHAR(255),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    views INT DEFAULT 0,
    photo_urls TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. История цены
CREATE TABLE IF NOT EXISTS avto_analytics_price_history (
    id BIGSERIAL PRIMARY KEY,
    ad_id BIGINT NOT NULL REFERENCES avto_analytics_ads(id) ON DELETE CASCADE,
    price DECIMAL(15,2) NOT NULL,
    recorded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Избранное
CREATE TABLE IF NOT EXISTS avto_analytics_favorites (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES avto_analytics_users(id) ON DELETE CASCADE,
    ad_id BIGINT NOT NULL REFERENCES avto_analytics_ads(id) ON DELETE CASCADE,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, ad_id)
);

-- 6. Вопросы продавцу
CREATE TABLE IF NOT EXISTS avto_analytics_questions (
    id BIGSERIAL PRIMARY KEY,
    ad_id BIGINT NOT NULL REFERENCES avto_analytics_ads(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES avto_analytics_users(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    answer TEXT,
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    answered_at TIMESTAMP
);

-- Индексы для производительности
CREATE INDEX idx_ads_user_id ON avto_analytics_ads(user_id);
CREATE INDEX idx_ads_car_id ON avto_analytics_ads(car_id);
CREATE INDEX idx_ads_status ON avto_analytics_ads(status);
CREATE INDEX idx_ads_price ON avto_analytics_ads(price);
CREATE INDEX idx_ads_city ON avto_analytics_ads(city);
CREATE INDEX idx_price_history_ad_id ON avto_analytics_price_history(ad_id);
CREATE INDEX idx_questions_ad_id ON avto_analytics_questions(ad_id);
CREATE INDEX idx_favorites_user_id ON avto_analytics_favorites(user_id);