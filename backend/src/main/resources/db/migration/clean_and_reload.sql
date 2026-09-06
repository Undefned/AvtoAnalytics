-- ============================================================
-- clean_and_reload.sql
-- Полная очистка и перезаполнение тестовыми данными
-- ============================================================

-- ============================================================
-- 1. ОТКЛЮЧАЕМ ПРОВЕРКИ ВНЕШНИХ КЛЮЧЕЙ
-- ============================================================
SET session_replication_role = 'replica';

-- ============================================================
-- 2. УДАЛЯЕМ ДАННЫЕ ИЗ ВСЕХ ТАБЛИЦ
-- ============================================================
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
-- 4. НАСТРОЙКИ ДЛЯ СКОРОСТИ
-- ============================================================
SET maintenance_work_mem = '1GB';
SET max_parallel_workers = 8;

-- ============================================================
-- 5. ЗАГРУЖАЕМ ДАННЫЕ
-- ============================================================

-- ============================================================
-- 5.1. ПОЛЬЗОВАТЕЛИ (20 штук)
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

-- ============================================================
-- 5.2. АВТОМОБИЛИ (70 штук, все марки)
-- ============================================================
INSERT INTO avto_analytics_cars (make, model, year, engine_volume, horsepower, transmission, drive_type, body_type, description, created_at, updated_at) VALUES
-- Toyota
('Toyota', 'Camry', 2023, 2.5, 181, 'AUTOMATIC', 'FRONT', 'SEDAN', 'Надежный седан бизнес-класса', NOW(), NOW()),
('Toyota', 'RAV4', 2023, 2.0, 146, 'CVT', 'ALL', 'SUV', 'Популярный кроссовер', NOW(), NOW()),
('Toyota', 'Land Cruiser', 2023, 4.5, 249, 'AUTOMATIC', 'ALL', 'SUV', 'Легендарный внедорожник', NOW(), NOW()),
('Toyota', 'Corolla', 2023, 1.8, 122, 'CVT', 'FRONT', 'SEDAN', 'Надежный компактный седан', NOW(), NOW()),
('Toyota', 'Highlander', 2023, 3.5, 249, 'AUTOMATIC', 'ALL', 'SUV', 'Большой семейный кроссовер', NOW(), NOW()),
('Toyota', 'Camry', 2022, 2.5, 181, 'AUTOMATIC', 'FRONT', 'SEDAN', 'Надежный седан бизнес-класса', NOW(), NOW()),
('Toyota', 'RAV4', 2022, 2.0, 146, 'CVT', 'ALL', 'SUV', 'Популярный кроссовер', NOW(), NOW()),
('Toyota', 'Land Cruiser', 2022, 4.5, 249, 'AUTOMATIC', 'ALL', 'SUV', 'Легендарный внедорожник', NOW(), NOW()),

-- BMW
('BMW', '5 Series', 2023, 3.0, 250, 'AUTOMATIC', 'REAR', 'SEDAN', 'Бизнес-седан с характером', NOW(), NOW()),
('BMW', 'X5', 2023, 3.0, 340, 'AUTOMATIC', 'ALL', 'SUV', 'Премиальный кроссовер', NOW(), NOW()),
('BMW', 'X3', 2023, 2.0, 184, 'AUTOMATIC', 'ALL', 'SUV', 'Компактный премиальный кроссовер', NOW(), NOW()),
('BMW', '3 Series', 2023, 2.0, 184, 'AUTOMATIC', 'REAR', 'SEDAN', 'Спортивный седан', NOW(), NOW()),
('BMW', '5 Series', 2022, 3.0, 250, 'AUTOMATIC', 'REAR', 'SEDAN', 'Бизнес-седан с характером', NOW(), NOW()),
('BMW', 'X5', 2022, 3.0, 340, 'AUTOMATIC', 'ALL', 'SUV', 'Премиальный кроссовер', NOW(), NOW()),

-- Mercedes
('Mercedes', 'E-Class', 2023, 2.0, 197, 'AUTOMATIC', 'REAR', 'SEDAN', 'Бизнес-класс с комфортом', NOW(), NOW()),
('Mercedes', 'GLC', 2023, 2.0, 197, 'AUTOMATIC', 'ALL', 'SUV', 'Премиальный кроссовер', NOW(), NOW()),
('Mercedes', 'S-Class', 2023, 3.0, 367, 'AUTOMATIC', 'REAR', 'SEDAN', 'Флагманский седан', NOW(), NOW()),
('Mercedes', 'E-Class', 2022, 2.0, 197, 'AUTOMATIC', 'REAR', 'SEDAN', 'Бизнес-класс с комфортом', NOW(), NOW()),
('Mercedes', 'GLC', 2022, 2.0, 197, 'AUTOMATIC', 'ALL', 'SUV', 'Премиальный кроссовер', NOW(), NOW()),

-- Audi
('Audi', 'A6', 2023, 2.0, 190, 'AUTOMATIC', 'FRONT', 'SEDAN', 'Бизнес-седан с технологиями', NOW(), NOW()),
('Audi', 'Q5', 2023, 2.0, 190, 'AUTOMATIC', 'ALL', 'SUV', 'Популярный кроссовер', NOW(), NOW()),
('Audi', 'Q7', 2023, 3.0, 249, 'AUTOMATIC', 'ALL', 'SUV', 'Большой кроссовер', NOW(), NOW()),
('Audi', 'A6', 2022, 2.0, 190, 'AUTOMATIC', 'FRONT', 'SEDAN', 'Бизнес-седан с технологиями', NOW(), NOW()),
('Audi', 'Q5', 2022, 2.0, 190, 'AUTOMATIC', 'ALL', 'SUV', 'Популярный кроссовер', NOW(), NOW()),

-- Kia
('Kia', 'Sportage', 2023, 2.0, 150, 'AUTOMATIC', 'FRONT', 'SUV', 'Стильный кроссовер', NOW(), NOW()),
('Kia', 'Rio', 2023, 1.6, 123, 'AUTOMATIC', 'FRONT', 'SEDAN', 'Бюджетный седан', NOW(), NOW()),
('Kia', 'Sportage', 2022, 2.0, 150, 'AUTOMATIC', 'FRONT', 'SUV', 'Стильный кроссовер', NOW(), NOW()),
('Kia', 'Rio', 2022, 1.6, 123, 'AUTOMATIC', 'FRONT', 'SEDAN', 'Бюджетный седан', NOW(), NOW()),

-- Hyundai
('Hyundai', 'Santa Fe', 2023, 2.2, 200, 'AUTOMATIC', 'ALL', 'SUV', 'Семейный кроссовер', NOW(), NOW()),
('Hyundai', 'Tucson', 2023, 2.0, 150, 'AUTOMATIC', 'FRONT', 'SUV', 'Популярный кроссовер', NOW(), NOW()),
('Hyundai', 'Elantra', 2023, 2.0, 150, 'AUTOMATIC', 'FRONT', 'SEDAN', 'Стильный седан', NOW(), NOW()),
('Hyundai', 'Santa Fe', 2022, 2.2, 200, 'AUTOMATIC', 'ALL', 'SUV', 'Семейный кроссовер', NOW(), NOW()),
('Hyundai', 'Tucson', 2022, 2.0, 150, 'AUTOMATIC', 'FRONT', 'SUV', 'Популярный кроссовер', NOW(), NOW()),

-- Volkswagen
('Volkswagen', 'Tiguan', 2023, 2.0, 180, 'AUTOMATIC', 'FRONT', 'SUV', 'Популярный кроссовер', NOW(), NOW()),
('Volkswagen', 'Passat', 2023, 2.0, 190, 'AUTOMATIC', 'FRONT', 'SEDAN', 'Бизнес-седан', NOW(), NOW()),
('Volkswagen', 'Golf', 2023, 1.4, 150, 'AUTOMATIC', 'FRONT', 'HATCHBACK', 'Культовый хэтчбек', NOW(), NOW()),
('Volkswagen', 'Tiguan', 2022, 2.0, 180, 'AUTOMATIC', 'FRONT', 'SUV', 'Популярный кроссовер', NOW(), NOW()),
('Volkswagen', 'Passat', 2022, 2.0, 190, 'AUTOMATIC', 'FRONT', 'SEDAN', 'Бизнес-седан', NOW(), NOW()),

-- Skoda
('Skoda', 'Octavia', 2023, 1.4, 150, 'AUTOMATIC', 'FRONT', 'HATCHBACK', 'Практичный лифтбек', NOW(), NOW()),
('Skoda', 'Kodiaq', 2023, 2.0, 190, 'AUTOMATIC', 'ALL', 'SUV', 'Большой кроссовер', NOW(), NOW()),
('Skoda', 'Octavia', 2022, 1.4, 150, 'AUTOMATIC', 'FRONT', 'HATCHBACK', 'Практичный лифтбек', NOW(), NOW()),
('Skoda', 'Kodiaq', 2022, 2.0, 190, 'AUTOMATIC', 'ALL', 'SUV', 'Большой кроссовер', NOW(), NOW()),

-- Lexus
('Lexus', 'RX', 2023, 3.5, 295, 'AUTOMATIC', 'ALL', 'SUV', 'Премиальный кроссовер', NOW(), NOW()),
('Lexus', 'ES', 2023, 2.5, 200, 'AUTOMATIC', 'FRONT', 'SEDAN', 'Премиальный седан', NOW(), NOW()),
('Lexus', 'RX', 2022, 3.5, 295, 'AUTOMATIC', 'ALL', 'SUV', 'Премиальный кроссовер', NOW(), NOW()),
('Lexus', 'ES', 2022, 2.5, 200, 'AUTOMATIC', 'FRONT', 'SEDAN', 'Премиальный седан', NOW(), NOW()),

-- Nissan
('Nissan', 'Qashqai', 2023, 2.0, 150, 'CVT', 'FRONT', 'SUV', 'Популярный кроссовер', NOW(), NOW()),
('Nissan', 'X-Trail', 2023, 2.5, 169, 'CVT', 'ALL', 'SUV', 'Семейный кроссовер', NOW(), NOW()),
('Nissan', 'Qashqai', 2022, 2.0, 150, 'CVT', 'FRONT', 'SUV', 'Популярный кроссовер', NOW(), NOW()),
('Nissan', 'X-Trail', 2022, 2.5, 169, 'CVT', 'ALL', 'SUV', 'Семейный кроссовер', NOW(), NOW());

-- ============================================================
-- ✅ 5.3. ОБЪЯВЛЕНИЯ (60 штук, ФИКСИРОВАННЫЙ СИНТАКСИС)
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
    -- ✅ ФИКС: Правильный синтаксис ARRAY без лишних пробелов
    (ARRAY[
        'Москва', 'Санкт-Петербург', 'Казань', 'Новосибирск', 
        'Екатеринбург', 'Нижний Новгород', 'Челябинск', 'Красноярск', 
        'Самара', 'Ростов-на-Дону', 'Уфа', 'Омск', 'Воронеж', 
        'Пермь', 'Волгоград', 'Краснодар', 'Саратов', 'Тюмень',
        'Тольятти', 'Ижевск', 'Барнаул', 'Иркутск', 'Хабаровск',
        'Ярославль', 'Владивосток', 'Махачкала', 'Томск', 'Оренбург',
        'Кемерово', 'Новокузнецк', 'Рязань', 'Астрахань', 'Пенза',
        'Липецк', 'Киров', 'Чебоксары', 'Калининград', 'Тула'
    ])[floor(random() * 38 + 1)],
    'ул. ' || (ARRAY['Ленина', 'Пушкина', 'Гагарина', 'Советская', 'Мира', 'Кирова', 'Московская', 'Победы', 'Садовая', 'Крупской'])[floor(random() * 10 + 1)] || ', ' || (random() * 150 + 1)::int,
    'ACTIVE',
    (random() * 500)::int,
    NULL,
    NOW() - (random() * 90 || ' days')::interval,
    NOW() - (random() * 30 || ' days')::interval
FROM avto_analytics_users u
CROSS JOIN avto_analytics_cars c
WHERE u.id <= 15 AND c.id <= 70
ORDER BY random()
LIMIT 60;

-- ============================================================
-- 5.4. ИСТОРИЯ ЦЕНЫ
-- ============================================================
INSERT INTO avto_analytics_price_history (ad_id, price, recorded_at, created_at, updated_at)
SELECT
    a.id,
    a.price + (random() * 1000000 + 300000)::int,
    a.created_at + (random() * 10 || ' days')::interval,
    NOW(),
    NOW()
FROM avto_analytics_ads a
WHERE random() > 0.1;

INSERT INTO avto_analytics_price_history (ad_id, price, recorded_at, created_at, updated_at)
SELECT
    a.id,
    a.price + (random() * 500000 + 100000)::int,
    a.created_at + (random() * 25 || ' days')::interval,
    NOW(),
    NOW()
FROM avto_analytics_ads a
WHERE random() > 0.2;

INSERT INTO avto_analytics_price_history (ad_id, price, recorded_at, created_at, updated_at)
SELECT
    a.id,
    a.price + (random() * 200000 + 50000)::int,
    a.created_at + (random() * 40 || ' days')::interval,
    NOW(),
    NOW()
FROM avto_analytics_ads a
WHERE random() > 0.3;

INSERT INTO avto_analytics_price_history (ad_id, price, recorded_at, created_at, updated_at)
SELECT
    a.id,
    a.price + (random() * 50000 + 10000)::int,
    a.created_at + (random() * 60 || ' days')::interval,
    NOW(),
    NOW()
FROM avto_analytics_ads a
WHERE random() > 0.4;

INSERT INTO avto_analytics_price_history (ad_id, price, recorded_at, created_at, updated_at)
SELECT
    a.id,
    a.price + (random() * 20000 + 5000)::int,
    a.created_at + (random() * 75 || ' days')::interval,
    NOW(),
    NOW()
FROM avto_analytics_ads a
WHERE random() > 0.5;

-- ============================================================
-- 5.5. ИЗБРАННОЕ
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
WHERE u.id <= 10 AND a.id <= 40
AND random() > 0.4
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
        'Можно ли загнать на диагностику?',
        'Какая комплектация?',
        'Когда проходили последнее ТО?'
    ])[floor(random() * 10 + 1)],
    CASE 
        WHEN random() > 0.2 THEN 
            (ARRAY[
                'Здравствуйте! Машина в отличном состоянии, все ТО пройдены.',
                'Добрый день! Пробег реальный, все документы в порядке.',
                'Здравствуйте! Да, можно, напишите в личку, договоримся.',
                'Я первый и единственный владелец. Авто с салона.',
                'Добрый день! Не битая, все номера оригинальные.',
                'Документы в полном порядке. На меня оформлена.',
                'Здравствуйте! При осмотре торг возможен.',
                'Добрый день! Конечно, можем заехать на СТО.',
                'Комплектация максимальная, всё есть.',
                'Последнее ТО было месяц назад.'
            ])[floor(random() * 10 + 1)]
        ELSE NULL
    END,
    true,
    NOW() - (random() * 20 || ' days')::interval,
    NOW() - (random() * 10 || ' days')::interval,
    CASE WHEN random() > 0.2 THEN NOW() - (random() * 5 || ' days')::interval ELSE NULL END
FROM avto_analytics_ads a
CROSS JOIN avto_analytics_users u
WHERE a.id <= 45 AND u.id <= 10
AND random() > 0.3
LIMIT 120;

-- ============================================================
-- ✅ 5.7. ОБНОВЛЕНИЕ ФОТО МАШИН (ПРАВИЛЬНОЕ СООТВЕТСТВИЕ)
-- ============================================================
WITH car_images AS (
    SELECT 
        c.id as car_id,
        c.make,
        CASE 
            WHEN c.make = 'Audi' THEN 'Audi'
            WHEN c.make = 'BMW' THEN 'Audi'
            WHEN c.make = 'Mercedes' THEN 'Rolls Royce'
            WHEN c.make = 'Volkswagen' THEN 'Audi'
            WHEN c.make = 'Skoda' THEN 'Audi'
            WHEN c.make = 'Kia' THEN 'Hyundai Creta'
            WHEN c.make = 'Hyundai' THEN 'Hyundai Creta'
            WHEN c.make = 'Lexus' THEN 'Toyota Innova'
            WHEN c.make = 'Nissan' THEN 'Toyota Innova'
            WHEN c.make = 'Toyota' THEN 'Toyota Innova'
            ELSE 'Audi'
        END as folder_name,
        CASE 
            WHEN c.make IN ('Audi', 'BMW', 'Volkswagen', 'Skoda') THEN
                ARRAY['104','109','134','135','138','141','163','167','176','187','190','195','205','209','213','216','222','23','230','231','232','236','253','257','259','276','279','284','290','303','308','312','313','316','321','349','355','356','360','364','382','39','41','42','43','47','48','54','66','67','68','87','96','98']
            WHEN c.make IN ('Hyundai', 'Kia') THEN
                ARRAY['102','147','151','155','188','190','205','226','232','242','247','249','254','257','281','283','285','291','294','297','299','300','304','305','326','328','342','345','348','372','394','399','57','58','62','91','99']
            WHEN c.make = 'Mercedes' THEN
                ARRAY['271','273','274','278','281','282','301','313','316','319','354','359','361','366','373','379','385','386','392','397']
            WHEN c.make IN ('Toyota', 'Lexus', 'Nissan') THEN
                ARRAY['1053','1055','1057','1066','1075','1077','1082','1092','1093','1100','1105','1106','1110','1114','1115','1222','1232','1246','1248','1251','1260','1263','1265','1268','1270','1271','1279','1299']
            ELSE
                ARRAY['104','109','134','135','138','141','163','167','176','187','190','195','205','209','213','216','222','23','230','231','232','236','253','257','259','276','279','284','290','303','308','312','313','316','321','349','355','356','360','364','382','39','41','42','43','47','48','54','66','67','68','87','96','98']
        END as file_names
    FROM avto_analytics_cars c
)
UPDATE avto_analytics_ads a
SET photo_urls = ARRAY[
    'http://localhost:9000/avtoanalytics/' || REPLACE(ci.folder_name, ' ', '%20') || '/' || ci.file_names[floor(random() * array_length(ci.file_names, 1)) + 1] || '.jpg',
    'http://localhost:9000/avtoanalytics/' || REPLACE(ci.folder_name, ' ', '%20') || '/' || ci.file_names[floor(random() * array_length(ci.file_names, 1)) + 1] || '.jpg'
]
FROM car_images ci
WHERE a.car_id = ci.car_id;

-- ============================================================
-- 5.8. АВАТАРКИ ПОЛЬЗОВАТЕЛЕЙ
-- ============================================================
UPDATE avto_analytics_users
SET avatar_url = 'http://localhost:9000/avtoanalytics/Users/user' || 
    (floor(random() * 4) + 1) || '.png'
WHERE avatar_url IS NULL;



-- ============================================================
-- fix_minio_urls.sql
-- Разово переписывает уже засеянные абсолютные "http://localhost:9000/..."
-- ссылки на фото/аватарки в относительные "/minio/..." — те, что после
-- фикса MinioService.getDirectFileUrl() генерируются по умолчанию и
-- резолвятся через nginx-прокси с любого хоста, а не только с localhost.
--
-- Выполнить один раз после того, как накатите фикс MinioService + nginx.
-- Новые объявления/аватарки, созданные ПОСЛЕ фикса, уже получат
-- правильный URL сами — этот скрипт только чинит старые, уже
-- сохранённые записи.
-- ============================================================

UPDATE avto_analytics_ads
SET photo_urls = (
    SELECT array_agg(REPLACE(url, 'http://localhost:9000/avtoanalytics', '/minio/avtoanalytics'))
    FROM unnest(photo_urls) AS url
)
WHERE photo_urls IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM unnest(photo_urls) AS url WHERE url LIKE 'http://localhost:9000/%'
  );

UPDATE avto_analytics_users
SET avatar_url = REPLACE(avatar_url, 'http://localhost:9000/avtoanalytics', '/minio/avtoanalytics')
WHERE avatar_url LIKE 'http://localhost:9000/%';

-- Проверка
SELECT id, photo_urls FROM avto_analytics_ads WHERE photo_urls IS NOT NULL LIMIT 5;
SELECT id, avatar_url FROM avto_analytics_users WHERE avatar_url IS NOT NULL LIMIT 5;

-- ============================================================
-- 6. ОБНОВЛЕНИЕ СТАТИСТИКИ
-- ============================================================
VACUUM ANALYZE;

-- ============================================================
-- 7. СТАТИСТИКА
-- ============================================================
SELECT 
    (SELECT COUNT(*) FROM avto_analytics_users) AS users_count,
    (SELECT COUNT(*) FROM avto_analytics_cars) AS cars_count,
    (SELECT COUNT(*) FROM avto_analytics_ads) AS ads_count,
    (SELECT COUNT(*) FROM avto_analytics_price_history) AS price_history_count,
    (SELECT COUNT(*) FROM avto_analytics_favorites) AS favorites_count,
    (SELECT COUNT(*) FROM avto_analytics_questions) AS questions_count;