-- ============================================================
-- clean_and_reload.sql
-- Полная очистка и перезаполнение тестовыми данными
-- ============================================================

-- ============================================================
-- 1. ОТКЛЮЧАЕМ ПРОВЕРКИ ВНЕШНИХ КЛЮЧЕЙ
-- ============================================================
SET session_replication_role = 'replica';

-- ============================================================
-- 2. УДАЛЯЕМ ДАННЫЕ ИЗ ВСЕХ ТАБЛИЦ (с учетом зависимостей)
-- ============================================================

-- Удаляем в обратном порядке зависимостей
TRUNCATE TABLE avto_analytics_questions RESTART IDENTITY CASCADE;
TRUNCATE TABLE avto_analytics_favorites RESTART IDENTITY CASCADE;
TRUNCATE TABLE avto_analytics_price_history RESTART IDENTITY CASCADE;
TRUNCATE TABLE avto_analytics_ads RESTART IDENTITY CASCADE;
TRUNCATE TABLE avto_analytics_cars RESTART IDENTITY CASCADE;
TRUNCATE TABLE avto_analytics_users RESTART IDENTITY CASCADE;

-- ============================================================
-- 3. ВКЛЮЧАЕМ ПРОВЕРКИ ВНЕШНИХ КЛЮЧЕЙ
-- ============================================================
SET session_replication_role = 'origin';

-- ============================================================
-- 4. ОТКЛЮЧАЕМ АВТООБНОВЛЕНИЕ СТАТИСТИКИ (для скорости)
-- ============================================================
SET maintenance_work_mem = '1GB';
SET max_parallel_workers = 8;

-- ============================================================
-- 5. ЗАГРУЖАЕМ НОВЫЕ ДАННЫЕ
-- ============================================================

-- ============================================================
-- 5.1. ПОЛЬЗОВАТЕЛИ (50 штук)
-- ============================================================

INSERT INTO avto_analytics_users (email, password, full_name, role, is_private_seller, is_active, created_at, updated_at) VALUES
('ivan.petrov@mail.ru', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5E', 'Иван Петров', 'USER', true, true, NOW(), NOW()),
('anna.smirnova@yandex.ru', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5E', 'Анна Смирнова', 'USER', true, true, NOW(), NOW()),
('sergey.ivanov@gmail.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5E', 'Сергей Иванов', 'USER', false, true, NOW(), NOW()),
('elena.kuznetsova@mail.ru', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5E', 'Елена Кузнецова', 'USER', true, true, NOW(), NOW()),
('dmitry.sokolov@yandex.ru', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5E', 'Дмитрий Соколов', 'USER', false, true, NOW(), NOW()),
('olga.popova@gmail.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5E', 'Ольга Попова', 'USER', true, true, NOW(), NOW()),
('alexey.lebedev@mail.ru', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5E', 'Алексей Лебедев', 'USER', false, true, NOW(), NOW()),
('maria.kozlov@yandex.ru', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5E', 'Мария Козлова', 'USER', true, true, NOW(), NOW()),
('nikolay.novikov@gmail.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5E', 'Николай Новиков', 'USER', false, true, NOW(), NOW()),
('tatyana.morozova@mail.ru', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5E', 'Татьяна Морозова', 'USER', true, true, NOW(), NOW()),
('vladimir.volkov@yandex.ru', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5E', 'Владимир Волков', 'USER', false, true, NOW(), NOW()),
('ekaterina.pavlova@gmail.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5E', 'Екатерина Павлова', 'USER', true, true, NOW(), NOW()),
('maxim.belov@mail.ru', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5E', 'Максим Белов', 'USER', false, true, NOW(), NOW()),
('irina.egorova@yandex.ru', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5E', 'Ирина Егорова', 'USER', true, true, NOW(), NOW()),
('denis.mikhailov@gmail.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5E', 'Денис Михайлов', 'USER', false, true, NOW(), NOW()),
('nadezhda.fedorova@mail.ru', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5E', 'Надежда Федорова', 'USER', true, true, NOW(), NOW()),
('andrey.semenov@yandex.ru', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5E', 'Андрей Семенов', 'USER', false, true, NOW(), NOW()),
('svetlana.vlasova@gmail.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5E', 'Светлана Власова', 'USER', true, true, NOW(), NOW()),
('alexandr.anikin@mail.ru', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5E', 'Александр Аникин', 'USER', false, true, NOW(), NOW()),
('victoria.kiseleva@yandex.ru', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5E', 'Виктория Киселева', 'USER', true, true, NOW(), NOW());

INSERT INTO avto_analytics_users (email, password, full_name, role, is_private_seller, is_active, created_at, updated_at)
SELECT 
    'user' || generate_series(21, 50) || '@mail.ru',
    '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5E',
    'Пользователь ' || generate_series(21, 50),
    'USER',
    CASE WHEN random() > 0.5 THEN true ELSE false END,
    true,
    NOW() - (random() * 365 || ' days')::interval,
    NOW() - (random() * 30 || ' days')::interval
FROM generate_series(21, 50);

-- ============================================================
-- 5.2. АВТОМОБИЛИ (70 штук)
-- ============================================================

INSERT INTO avto_analytics_cars (make, model, year, engine_volume, horsepower, transmission, drive_type, body_type, description, created_at, updated_at) VALUES

-- Toyota
('Toyota', 'Camry', 2023, 2.5, 181, 'AUTOMATIC', 'FRONT', 'SEDAN', 'Надежный седан бизнес-класса', NOW(), NOW()),
('Toyota', 'Camry', 2022, 2.5, 181, 'AUTOMATIC', 'FRONT', 'SEDAN', 'Надежный седан бизнес-класса', NOW(), NOW()),
('Toyota', 'Camry', 2021, 2.5, 181, 'AUTOMATIC', 'FRONT', 'SEDAN', 'Надежный седан бизнес-класса', NOW(), NOW()),
('Toyota', 'Camry', 2020, 2.5, 181, 'AUTOMATIC', 'FRONT', 'SEDAN', 'Надежный седан бизнес-класса', NOW(), NOW()),
('Toyota', 'Camry', 2019, 2.5, 181, 'AUTOMATIC', 'FRONT', 'SEDAN', 'Надежный седан бизнес-класса', NOW(), NOW()),
('Toyota', 'RAV4', 2023, 2.0, 146, 'CVT', 'ALL', 'SUV', 'Популярный кроссовер', NOW(), NOW()),
('Toyota', 'RAV4', 2022, 2.0, 146, 'CVT', 'ALL', 'SUV', 'Популярный кроссовер', NOW(), NOW()),
('Toyota', 'RAV4', 2021, 2.0, 146, 'CVT', 'ALL', 'SUV', 'Популярный кроссовер', NOW(), NOW()),
('Toyota', 'Land Cruiser', 2023, 4.5, 249, 'AUTOMATIC', 'ALL', 'SUV', 'Легендарный внедорожник', NOW(), NOW()),
('Toyota', 'Land Cruiser', 2022, 4.5, 249, 'AUTOMATIC', 'ALL', 'SUV', 'Легендарный внедорожник', NOW(), NOW()),
('Toyota', 'Corolla', 2023, 1.8, 122, 'CVT', 'FRONT', 'SEDAN', 'Надежный компактный седан', NOW(), NOW()),
('Toyota', 'Corolla', 2022, 1.8, 122, 'CVT', 'FRONT', 'SEDAN', 'Надежный компактный седан', NOW(), NOW()),
('Toyota', 'Highlander', 2023, 3.5, 249, 'AUTOMATIC', 'ALL', 'SUV', 'Большой семейный кроссовер', NOW(), NOW()),
('Toyota', 'Highlander', 2022, 3.5, 249, 'AUTOMATIC', 'ALL', 'SUV', 'Большой семейный кроссовер', NOW(), NOW()),

-- BMW
('BMW', '5 Series', 2023, 3.0, 250, 'AUTOMATIC', 'REAR', 'SEDAN', 'Бизнес-седан с характером', NOW(), NOW()),
('BMW', '5 Series', 2022, 3.0, 250, 'AUTOMATIC', 'REAR', 'SEDAN', 'Бизнес-седан с характером', NOW(), NOW()),
('BMW', '5 Series', 2021, 3.0, 250, 'AUTOMATIC', 'REAR', 'SEDAN', 'Бизнес-седан с характером', NOW(), NOW()),
('BMW', 'X5', 2023, 3.0, 340, 'AUTOMATIC', 'ALL', 'SUV', 'Премиальный кроссовер', NOW(), NOW()),
('BMW', 'X5', 2022, 3.0, 340, 'AUTOMATIC', 'ALL', 'SUV', 'Премиальный кроссовер', NOW(), NOW()),
('BMW', 'X5', 2021, 3.0, 340, 'AUTOMATIC', 'ALL', 'SUV', 'Премиальный кроссовер', NOW(), NOW()),
('BMW', 'X3', 2023, 2.0, 184, 'AUTOMATIC', 'ALL', 'SUV', 'Компактный премиальный кроссовер', NOW(), NOW()),
('BMW', 'X3', 2022, 2.0, 184, 'AUTOMATIC', 'ALL', 'SUV', 'Компактный премиальный кроссовер', NOW(), NOW()),
('BMW', '3 Series', 2023, 2.0, 184, 'AUTOMATIC', 'REAR', 'SEDAN', 'Спортивный седан', NOW(), NOW()),
('BMW', '3 Series', 2022, 2.0, 184, 'AUTOMATIC', 'REAR', 'SEDAN', 'Спортивный седан', NOW(), NOW()),

-- Mercedes
('Mercedes', 'E-Class', 2023, 2.0, 197, 'AUTOMATIC', 'REAR', 'SEDAN', 'Бизнес-класс с комфортом', NOW(), NOW()),
('Mercedes', 'E-Class', 2022, 2.0, 197, 'AUTOMATIC', 'REAR', 'SEDAN', 'Бизнес-класс с комфортом', NOW(), NOW()),
('Mercedes', 'E-Class', 2021, 2.0, 197, 'AUTOMATIC', 'REAR', 'SEDAN', 'Бизнес-класс с комфортом', NOW(), NOW()),
('Mercedes', 'GLC', 2023, 2.0, 197, 'AUTOMATIC', 'ALL', 'SUV', 'Премиальный кроссовер', NOW(), NOW()),
('Mercedes', 'GLC', 2022, 2.0, 197, 'AUTOMATIC', 'ALL', 'SUV', 'Премиальный кроссовер', NOW(), NOW()),
('Mercedes', 'S-Class', 2023, 3.0, 367, 'AUTOMATIC', 'REAR', 'SEDAN', 'Флагманский седан', NOW(), NOW()),
('Mercedes', 'S-Class', 2022, 3.0, 367, 'AUTOMATIC', 'REAR', 'SEDAN', 'Флагманский седан', NOW(), NOW()),

-- Audi
('Audi', 'A6', 2023, 2.0, 190, 'AUTOMATIC', 'FRONT', 'SEDAN', 'Бизнес-седан с технологиями', NOW(), NOW()),
('Audi', 'A6', 2022, 2.0, 190, 'AUTOMATIC', 'FRONT', 'SEDAN', 'Бизнес-седан с технологиями', NOW(), NOW()),
('Audi', 'A6', 2021, 2.0, 190, 'AUTOMATIC', 'FRONT', 'SEDAN', 'Бизнес-седан с технологиями', NOW(), NOW()),
('Audi', 'Q5', 2023, 2.0, 190, 'AUTOMATIC', 'ALL', 'SUV', 'Популярный кроссовер', NOW(), NOW()),
('Audi', 'Q5', 2022, 2.0, 190, 'AUTOMATIC', 'ALL', 'SUV', 'Популярный кроссовер', NOW(), NOW()),
('Audi', 'Q7', 2023, 3.0, 249, 'AUTOMATIC', 'ALL', 'SUV', 'Большой кроссовер', NOW(), NOW()),
('Audi', 'Q7', 2022, 3.0, 249, 'AUTOMATIC', 'ALL', 'SUV', 'Большой кроссовер', NOW(), NOW()),

-- Kia
('Kia', 'Sportage', 2023, 2.0, 150, 'AUTOMATIC', 'FRONT', 'SUV', 'Стильный кроссовер', NOW(), NOW()),
('Kia', 'Sportage', 2022, 2.0, 150, 'AUTOMATIC', 'FRONT', 'SUV', 'Стильный кроссовер', NOW(), NOW()),
('Kia', 'Sportage', 2021, 2.0, 150, 'AUTOMATIC', 'FRONT', 'SUV', 'Стильный кроссовер', NOW(), NOW()),
('Kia', 'Rio', 2023, 1.6, 123, 'AUTOMATIC', 'FRONT', 'SEDAN', 'Бюджетный седан', NOW(), NOW()),
('Kia', 'Rio', 2022, 1.6, 123, 'AUTOMATIC', 'FRONT', 'SEDAN', 'Бюджетный седан', NOW(), NOW()),
('Kia', 'Rio', 2021, 1.6, 123, 'AUTOMATIC', 'FRONT', 'SEDAN', 'Бюджетный седан', NOW(), NOW()),

-- Hyundai
('Hyundai', 'Santa Fe', 2023, 2.2, 200, 'AUTOMATIC', 'ALL', 'SUV', 'Семейный кроссовер', NOW(), NOW()),
('Hyundai', 'Santa Fe', 2022, 2.2, 200, 'AUTOMATIC', 'ALL', 'SUV', 'Семейный кроссовер', NOW(), NOW()),
('Hyundai', 'Santa Fe', 2021, 2.2, 200, 'AUTOMATIC', 'ALL', 'SUV', 'Семейный кроссовер', NOW(), NOW()),
('Hyundai', 'Tucson', 2023, 2.0, 150, 'AUTOMATIC', 'FRONT', 'SUV', 'Популярный кроссовер', NOW(), NOW()),
('Hyundai', 'Tucson', 2022, 2.0, 150, 'AUTOMATIC', 'FRONT', 'SUV', 'Популярный кроссовер', NOW(), NOW()),
('Hyundai', 'Elantra', 2023, 2.0, 150, 'AUTOMATIC', 'FRONT', 'SEDAN', 'Стильный седан', NOW(), NOW()),
('Hyundai', 'Elantra', 2022, 2.0, 150, 'AUTOMATIC', 'FRONT', 'SEDAN', 'Стильный седан', NOW(), NOW()),

-- Volkswagen
('Volkswagen', 'Tiguan', 2023, 2.0, 180, 'AUTOMATIC', 'FRONT', 'SUV', 'Популярный кроссовер', NOW(), NOW()),
('Volkswagen', 'Tiguan', 2022, 2.0, 180, 'AUTOMATIC', 'FRONT', 'SUV', 'Популярный кроссовер', NOW(), NOW()),
('Volkswagen', 'Passat', 2023, 2.0, 190, 'AUTOMATIC', 'FRONT', 'SEDAN', 'Бизнес-седан', NOW(), NOW()),
('Volkswagen', 'Passat', 2022, 2.0, 190, 'AUTOMATIC', 'FRONT', 'SEDAN', 'Бизнес-седан', NOW(), NOW()),
('Volkswagen', 'Golf', 2023, 1.4, 150, 'AUTOMATIC', 'FRONT', 'HATCHBACK', 'Культовый хэтчбек', NOW(), NOW()),
('Volkswagen', 'Golf', 2022, 1.4, 150, 'AUTOMATIC', 'FRONT', 'HATCHBACK', 'Культовый хэтчбек', NOW(), NOW()),

-- Skoda
('Skoda', 'Octavia', 2023, 1.4, 150, 'AUTOMATIC', 'FRONT', 'HATCHBACK', 'Практичный лифтбек', NOW(), NOW()),
('Skoda', 'Octavia', 2022, 1.4, 150, 'AUTOMATIC', 'FRONT', 'HATCHBACK', 'Практичный лифтбек', NOW(), NOW()),
('Skoda', 'Octavia', 2021, 1.4, 150, 'AUTOMATIC', 'FRONT', 'HATCHBACK', 'Практичный лифтбек', NOW(), NOW()),
('Skoda', 'Kodiaq', 2023, 2.0, 190, 'AUTOMATIC', 'ALL', 'SUV', 'Большой кроссовер', NOW(), NOW()),
('Skoda', 'Kodiaq', 2022, 2.0, 190, 'AUTOMATIC', 'ALL', 'SUV', 'Большой кроссовер', NOW(), NOW()),

-- Lexus
('Lexus', 'RX', 2023, 3.5, 295, 'AUTOMATIC', 'ALL', 'SUV', 'Премиальный кроссовер', NOW(), NOW()),
('Lexus', 'RX', 2022, 3.5, 295, 'AUTOMATIC', 'ALL', 'SUV', 'Премиальный кроссовер', NOW(), NOW()),
('Lexus', 'ES', 2023, 2.5, 200, 'AUTOMATIC', 'FRONT', 'SEDAN', 'Премиальный седан', NOW(), NOW()),
('Lexus', 'ES', 2022, 2.5, 200, 'AUTOMATIC', 'FRONT', 'SEDAN', 'Премиальный седан', NOW(), NOW()),

-- Nissan
('Nissan', 'Qashqai', 2023, 2.0, 150, 'CVT', 'FRONT', 'SUV', 'Популярный кроссовер', NOW(), NOW()),
('Nissan', 'Qashqai', 2022, 2.0, 150, 'CVT', 'FRONT', 'SUV', 'Популярный кроссовер', NOW(), NOW()),
('Nissan', 'X-Trail', 2023, 2.5, 169, 'CVT', 'ALL', 'SUV', 'Семейный кроссовер', NOW(), NOW()),
('Nissan', 'X-Trail', 2022, 2.5, 169, 'CVT', 'ALL', 'SUV', 'Семейный кроссовер', NOW(), NOW());


-- ============================================================
-- 5.3. ОБЪЯВЛЕНИЯ (100 штук)
-- ============================================================

INSERT INTO avto_analytics_ads (user_id, car_id, title, description, price, mileage, city, address, status, views, photo_urls, created_at, updated_at)
SELECT
    u.id,
    c.id,
    c.make || ' ' || c.model || ', ' || c.year || ' года',
    'Продаю ' || c.make || ' ' || c.model || ' ' || c.year || ' года. ' || 
    CASE WHEN c.engine_volume IS NOT NULL THEN 'Двигатель ' || c.engine_volume || 'L, ' || c.horsepower || ' л.с. ' ELSE '' END ||
    c.transmission || '. ' || c.body_type || '. Состояние отличное!',
    (random() * 5000000 + 1000000)::int,
    (random() * 150000 + 10000)::int,
    (ARRAY['Москва', 'Санкт-Петербург', 'Казань', 'Новосибирск', 'Екатеринбург', 'Нижний Новгород', 'Челябинск', 'Красноярск', 'Самара', 'Ростов-на-Дону', 'Уфа', 'Омск', 'Воронеж', 'Пермь', 'Волгоград'])[floor(random() * 15 + 1)],
    'ул. ' || (ARRAY['Ленина', 'Пушкина', 'Гагарина', 'Советская', 'Мира', 'Кирова', 'Московская'])[floor(random() * 7 + 1)] || ', ' || (random() * 100 + 1)::int,
    'ACTIVE',
    (random() * 500)::int,
    ARRAY['https://example.com/car' || c.id || '_1.jpg', 'https://example.com/car' || c.id || '_2.jpg'],
    NOW() - (random() * 90 || ' days')::interval,
    NOW() - (random() * 30 || ' days')::interval
FROM avto_analytics_users u
CROSS JOIN avto_analytics_cars c
WHERE u.id <= 25 AND c.id <= 50
LIMIT 100;


-- ============================================================
-- 5.4. ИСТОРИЯ ЦЕНЫ (для каждого объявления)
-- ============================================================

INSERT INTO avto_analytics_price_history (ad_id, price, recorded_at, created_at, updated_at)
SELECT
    a.id,
    a.price - (random() * 500000 + 100000)::int,
    a.created_at + (random() * 10 || ' days')::interval,
    NOW(),
    NOW()
FROM avto_analytics_ads a
WHERE a.id <= 50
AND random() > 0.3;

INSERT INTO avto_analytics_price_history (ad_id, price, recorded_at, created_at, updated_at)
SELECT
    a.id,
    a.price - (random() * 300000 + 50000)::int,
    a.created_at + (random() * 25 || ' days')::interval,
    NOW(),
    NOW()
FROM avto_analytics_ads a
WHERE a.id <= 30
AND random() > 0.4;

INSERT INTO avto_analytics_price_history (ad_id, price, recorded_at, created_at, updated_at)
SELECT
    a.id,
    a.price - (random() * 200000 + 30000)::int,
    a.created_at + (random() * 40 || ' days')::interval,
    NOW(),
    NOW()
FROM avto_analytics_ads a
WHERE a.id <= 20
AND random() > 0.5;


-- ============================================================
-- 5.5. ИЗБРАННОЕ (пользователи добавляют в избранное)
-- ============================================================

INSERT INTO avto_analytics_favorites (user_id, ad_id, added_at, created_at, updated_at)
SELECT
    u.id,
    a.id,
    NOW() - (random() * 30 || ' days')::interval,
    NOW(),
    NOW()
FROM avto_analytics_users u
CROSS JOIN avto_analytics_ads a
WHERE u.id <= 15 AND a.id <= 30
AND random() > 0.6
ON CONFLICT (user_id, ad_id) DO NOTHING;


-- ============================================================
-- 5.6. ВОПРОСЫ И ОТВЕТЫ
-- ============================================================

INSERT INTO avto_analytics_questions (ad_id, user_id, question, answer, is_public, created_at, updated_at, answered_at)
SELECT
    a.id,
    u.id,
    (ARRAY[
        'Здравствуйте! Машина в хорошем состоянии?',
        'Пробег реальный? ТО проходили у официального дилера?',
        'Можно посмотреть машину в выходные?',
        'Сколько собственников было?',
        'Машина битая? Кузов оригинальный?',
        'Документы в порядке? На кого оформлена?',
        'Есть ли скидка при осмотре?',
        'Можно ли загнать на диагностику?'
    ])[floor(random() * 8 + 1)],
    CASE 
        WHEN random() > 0.3 THEN 
            (ARRAY[
                'Здравствуйте! Машина в отличном состоянии, все ТО пройдены.',
                'Добрый день! Пробег реальный, все документы в порядке.',
                'Здравствуйте! Да, можно, напишите в личку, договоримся.',
                'Я первый и единственный владелец. Авто с салона.',
                'Добрый день! Не битая, все номера оригинальные.',
                'Документы в полном порядке. На меня оформлена.',
                'Здравствуйте! При осмотре торг возможен.',
                'Добрый день! Конечно, можем заехать на СТО.'
            ])[floor(random() * 8 + 1)]
        ELSE NULL
    END,
    true,
    NOW() - (random() * 20 || ' days')::interval,
    NOW() - (random() * 10 || ' days')::interval,
    CASE WHEN random() > 0.3 THEN NOW() - (random() * 5 || ' days')::interval ELSE NULL END
FROM avto_analytics_ads a
CROSS JOIN avto_analytics_users u
WHERE a.id <= 30 AND u.id <= 10
AND random() > 0.5
LIMIT 50;


-- ============================================================
-- 6. ВКЛЮЧАЕМ АВТООБНОВЛЕНИЕ СТАТИСТИКИ
-- ============================================================
VACUUM ANALYZE;

-- ============================================================
-- 7. ВЫВОД ИНФОРМАЦИИ
-- ============================================================
DO $$
DECLARE
    users_count INTEGER;
    cars_count INTEGER;
    ads_count INTEGER;
    price_history_count INTEGER;
    favorites_count INTEGER;
    questions_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO users_count FROM avto_analytics_users;
    SELECT COUNT(*) INTO cars_count FROM avto_analytics_cars;
    SELECT COUNT(*) INTO ads_count FROM avto_analytics_ads;
    SELECT COUNT(*) INTO price_history_count FROM avto_analytics_price_history;
    SELECT COUNT(*) INTO favorites_count FROM avto_analytics_favorites;
    SELECT COUNT(*) INTO questions_count FROM avto_analytics_questions;
    
    RAISE NOTICE '✅ Данные успешно загружены!';
    RAISE NOTICE '📊 Статистика:';
    RAISE NOTICE '   👤 Пользователей: %', users_count;
    RAISE NOTICE '   🚗 Автомобилей: %', cars_count;
    RAISE NOTICE '   📝 Объявлений: %', ads_count;
    RAISE NOTICE '   📈 История цен: %', price_history_count;
    RAISE NOTICE '   ❤️ Избранное: %', favorites_count;
    RAISE NOTICE '   ❓ Вопросов: %', questions_count;
END $$;