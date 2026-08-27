-- ============================================================
-- data.sql
-- Тестовые данные для AvtoAnalytics
-- ============================================================

-- ============================================================
-- 1. ПОЛЬЗОВАТЕЛИ (50 штук)
-- ============================================================
INSERT INTO users (email, password, full_name, phone, role, is_private_seller, is_active, created_at, updated_at) VALUES
('ivan.petrov@mail.ru', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5E', 'Иван Петров', '+79001001001', 'USER', true, true, NOW(), NOW()),
('anna.smirnova@yandex.ru', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5E', 'Анна Смирнова', '+79001001002', 'USER', true, true, NOW(), NOW()),
('sergey.ivanov@gmail.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5E', 'Сергей Иванов', '+79001001003', 'USER', false, true, NOW(), NOW()),
('elena.kuznetsova@mail.ru', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5E', 'Елена Кузнецова', '+79001001004', 'USER', true, true, NOW(), NOW()),
('dmitry.sokolov@yandex.ru', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5E', 'Дмитрий Соколов', '+79001001005', 'USER', false, true, NOW(), NOW()),
('olga.popova@gmail.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5E', 'Ольга Попова', '+79001001006', 'USER', true, true, NOW(), NOW()),
('alexey.lebedeva@mail.ru', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5E', 'Алексей Лебедев', '+79001001007', 'USER', false, true, NOW(), NOW()),
('maria.kozlov@yandex.ru', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5E', 'Мария Козлова', '+79001001008', 'USER', true, true, NOW(), NOW()),
('nikolay.novikov@gmail.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5E', 'Николай Новиков', '+79001001009', 'USER', false, true, NOW(), NOW()),
('tatyana.morozova@mail.ru', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5E', 'Татьяна Морозова', '+79001001010', 'USER', true, true, NOW(), NOW()),
('vladimir.volkov@yandex.ru', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5E', 'Владимир Волков', '+79001001011', 'USER', false, true, NOW(), NOW()),
('ekaterina.pavlova@gmail.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5E', 'Екатерина Павлова', '+79001001012', 'USER', true, true, NOW(), NOW()),
('maxim.belov@mail.ru', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5E', 'Максим Белов', '+79001001013', 'USER', false, true, NOW(), NOW()),
('irina.egorova@yandex.ru', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5E', 'Ирина Егорова', '+79001001014', 'USER', true, true, NOW(), NOW()),
('denis.mikhailov@gmail.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5E', 'Денис Михайлов', '+79001001015', 'USER', false, true, NOW(), NOW()),
('nadezhda.fedorova@mail.ru', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5E', 'Надежда Федорова', '+79001001016', 'USER', true, true, NOW(), NOW()),
('andrey.semenov@yandex.ru', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5E', 'Андрей Семенов', '+79001001017', 'USER', false, true, NOW(), NOW()),
('svetlana.vlasova@gmail.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5E', 'Светлана Власова', '+79001001018', 'USER', true, true, NOW(), NOW()),
('alexandr.anikina@mail.ru', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5E', 'Александр Аникин', '+79001001019', 'USER', false, true, NOW(), NOW()),
('victoria.kiseleva@yandex.ru', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5E', 'Виктория Киселева', '+79001001020', 'USER', true, true, NOW(), NOW());

-- Ещё 30 пользователей (перекупы и частники)
INSERT INTO users (email, password, full_name, phone, role, is_private_seller, is_active, created_at, updated_at)
SELECT 
    'user' || generate_series(21, 50) || '@mail.ru',
    '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5E',
    'Пользователь ' || generate_series(21, 50),
    '+79001001' || LPAD(generate_series(21, 50)::text, 2, '0'),
    'USER',
    CASE WHEN random() > 0.5 THEN true ELSE false END,
    true,
    NOW(),
    NOW();

-- ============================================================
-- 2. АВТОМОБИЛИ (200+ штук)
-- ============================================================

-- Toyota
INSERT INTO cars (make, model, year, engine_volume, horsepower, transmission, drive_type, body_type, description, created_at, updated_at) VALUES
('Toyota', 'Camry', 2023, 2.5, 181, 'AUTOMATIC', 'FRONT', 'SEDAN', 'Надежный седан бизнес-класса', NOW(), NOW()),
('Toyota', 'Camry', 2022, 2.5, 181, 'AUTOMATIC', 'FRONT', 'SEDAN', 'Надежный седан бизнес-класса', NOW(), NOW()),
('Toyota', 'Camry', 2021, 2.5, 181, 'AUTOMATIC', 'FRONT', 'SEDAN', 'Надежный седан бизнес-класса', NOW(), NOW()),
('Toyota', 'Camry', 2020, 2.5, 181, 'AUTOMATIC', 'FRONT', 'SEDAN', 'Надежный седан бизнес-класса', NOW(), NOW()),
('Toyota', 'Camry', 2019, 2.5, 181, 'AUTOMATIC', 'FRONT', 'SEDAN', 'Надежный седан бизнес-класса', NOW(), NOW()),
('Toyota', 'Camry', 2018, 2.5, 181, 'AUTOMATIC', 'FRONT', 'SEDAN', 'Надежный седан бизнес-класса', NOW(), NOW()),
('Toyota', 'RAV4', 2023, 2.0, 146, 'CVT', 'ALL', 'SUV', 'Популярный кроссовер', NOW(), NOW()),
('Toyota', 'RAV4', 2022, 2.0, 146, 'CVT', 'ALL', 'SUV', 'Популярный кроссовер', NOW(), NOW()),
('Toyota', 'RAV4', 2021, 2.0, 146, 'CVT', 'ALL', 'SUV', 'Популярный кроссовер', NOW(), NOW()),
('Toyota', 'RAV4', 2020, 2.0, 146, 'CVT', 'ALL', 'SUV', 'Популярный кроссовер', NOW(), NOW()),
('Toyota', 'RAV4', 2019, 2.0, 146, 'CVT', 'ALL', 'SUV', 'Популярный кроссовер', NOW(), NOW()),
('Toyota', 'Land Cruiser', 2023, 4.5, 249, 'AUTOMATIC', 'ALL', 'SUV', 'Легендарный внедорожник', NOW(), NOW()),
('Toyota', 'Land Cruiser', 2022, 4.5, 249, 'AUTOMATIC', 'ALL', 'SUV', 'Легендарный внедорожник', NOW(), NOW()),
('Toyota', 'Land Cruiser', 2021, 4.5, 249, 'AUTOMATIC', 'ALL', 'SUV', 'Легендарный внедорожник', NOW(), NOW()),
('Toyota', 'Corolla', 2023, 1.8, 122, 'CVT', 'FRONT', 'SEDAN', 'Надежный компактный седан', NOW(), NOW()),
('Toyota', 'Corolla', 2022, 1.8, 122, 'CVT', 'FRONT', 'SEDAN', 'Надежный компактный седан', NOW(), NOW()),
('Toyota', 'Corolla', 2021, 1.8, 122, 'CVT', 'FRONT', 'SEDAN', 'Надежный компактный седан', NOW(), NOW()),
('Toyota', 'Highlander', 2023, 3.5, 249, 'AUTOMATIC', 'ALL', 'SUV', 'Большой семейный кроссовер', NOW(), NOW()),
('Toyota', 'Highlander', 2022, 3.5, 249, 'AUTOMATIC', 'ALL', 'SUV', 'Большой семейный кроссовер', NOW(), NOW()),
('Toyota', 'Highlander', 2021, 3.5, 249, 'AUTOMATIC', 'ALL', 'SUV', 'Большой семейный кроссовер', NOW(), NOW()),
('Toyota', 'Supra', 2023, 3.0, 387, 'AUTOMATIC', 'REAR', 'COUPE', 'Спортивное купе', NOW(), NOW()),
('Toyota', 'Supra', 2022, 3.0, 387, 'AUTOMATIC', 'REAR', 'COUPE', 'Спортивное купе', NOW(), NOW());

-- BMW
INSERT INTO cars (make, model, year, engine_volume, horsepower, transmission, drive_type, body_type, description, created_at, updated_at) VALUES
('BMW', '5 Series', 2023, 3.0, 250, 'AUTOMATIC', 'REAR', 'SEDAN', 'Бизнес-седан с характером', NOW(), NOW()),
('BMW', '5 Series', 2022, 3.0, 250, 'AUTOMATIC', 'REAR', 'SEDAN', 'Бизнес-седан с характером', NOW(), NOW()),
('BMW', '5 Series', 2021, 3.0, 250, 'AUTOMATIC', 'REAR', 'SEDAN', 'Бизнес-седан с характером', NOW(), NOW()),
('BMW', '5 Series', 2020, 3.0, 250, 'AUTOMATIC', 'REAR', 'SEDAN', 'Бизнес-седан с характером', NOW(), NOW()),
('BMW', 'X5', 2023, 3.0, 340, 'AUTOMATIC', 'ALL', 'SUV', 'Премиальный кроссовер', NOW(), NOW()),
('BMW', 'X5', 2022, 3.0, 340, 'AUTOMATIC', 'ALL', 'SUV', 'Премиальный кроссовер', NOW(), NOW()),
('BMW', 'X5', 2021, 3.0, 340, 'AUTOMATIC', 'ALL', 'SUV', 'Премиальный кроссовер', NOW(), NOW()),
('BMW', 'X5', 2020, 3.0, 340, 'AUTOMATIC', 'ALL', 'SUV', 'Премиальный кроссовер', NOW(), NOW()),
('BMW', 'X3', 2023, 2.0, 184, 'AUTOMATIC', 'ALL', 'SUV', 'Компактный премиальный кроссовер', NOW(), NOW()),
('BMW', 'X3', 2022, 2.0, 184, 'AUTOMATIC', 'ALL', 'SUV', 'Компактный премиальный кроссовер', NOW(), NOW()),
('BMW', 'X3', 2021, 2.0, 184, 'AUTOMATIC', 'ALL', 'SUV', 'Компактный премиальный кроссовер', NOW(), NOW()),
('BMW', '3 Series', 2023, 2.0, 184, 'AUTOMATIC', 'REAR', 'SEDAN', 'Спортивный седан', NOW(), NOW()),
('BMW', '3 Series', 2022, 2.0, 184, 'AUTOMATIC', 'REAR', 'SEDAN', 'Спортивный седан', NOW(), NOW()),
('BMW', '3 Series', 2021, 2.0, 184, 'AUTOMATIC', 'REAR', 'SEDAN', 'Спортивный седан', NOW(), NOW()),
('BMW', 'X7', 2023, 4.4, 530, 'AUTOMATIC', 'ALL', 'SUV', 'Флагманский кроссовер', NOW(), NOW()),
('BMW', 'X7', 2022, 4.4, 530, 'AUTOMATIC', 'ALL', 'SUV', 'Флагманский кроссовер', NOW(), NOW()),
('BMW', '7 Series', 2023, 4.4, 530, 'AUTOMATIC', 'REAR', 'SEDAN', 'Флагманский седан', NOW(), NOW()),
('BMW', '7 Series', 2022, 4.4, 530, 'AUTOMATIC', 'REAR', 'SEDAN', 'Флагманский седан', NOW(), NOW());

-- Mercedes-Benz
INSERT INTO cars (make, model, year, engine_volume, horsepower, transmission, drive_type, body_type, description, created_at, updated_at) VALUES
('Mercedes', 'E-Class', 2023, 2.0, 197, 'AUTOMATIC', 'REAR', 'SEDAN', 'Бизнес-класс с комфортом', NOW(), NOW()),
('Mercedes', 'E-Class', 2022, 2.0, 197, 'AUTOMATIC', 'REAR', 'SEDAN', 'Бизнес-класс с комфортом', NOW(), NOW()),
('Mercedes', 'E-Class', 2021, 2.0, 197, 'AUTOMATIC', 'REAR', 'SEDAN', 'Бизнес-класс с комфортом', NOW(), NOW()),
('Mercedes', 'E-Class', 2020, 2.0, 197, 'AUTOMATIC', 'REAR', 'SEDAN', 'Бизнес-класс с комфортом', NOW(), NOW()),
('Mercedes', 'GLC', 2023, 2.0, 197, 'AUTOMATIC', 'ALL', 'SUV', 'Премиальный кроссовер', NOW(), NOW()),
('Mercedes', 'GLC', 2022, 2.0, 197, 'AUTOMATIC', 'ALL', 'SUV', 'Премиальный кроссовер', NOW(), NOW()),
('Mercedes', 'GLC', 2021, 2.0, 197, 'AUTOMATIC', 'ALL', 'SUV', 'Премиальный кроссовер', NOW(), NOW()),
('Mercedes', 'S-Class', 2023, 3.0, 367, 'AUTOMATIC', 'REAR', 'SEDAN', 'Флагманский седан', NOW(), NOW()),
('Mercedes', 'S-Class', 2022, 3.0, 367, 'AUTOMATIC', 'REAR', 'SEDAN', 'Флагманский седан', NOW(), NOW()),
('Mercedes', 'GLE', 2023, 3.0, 367, 'AUTOMATIC', 'ALL', 'SUV', 'Большой премиальный кроссовер', NOW(), NOW()),
('Mercedes', 'GLE', 2022, 3.0, 367, 'AUTOMATIC', 'ALL', 'SUV', 'Большой премиальный кроссовер', NOW(), NOW()),
('Mercedes', 'C-Class', 2023, 2.0, 184, 'AUTOMATIC', 'REAR', 'SEDAN', 'Компактный премиальный седан', NOW(), NOW()),
('Mercedes', 'C-Class', 2022, 2.0, 184, 'AUTOMATIC', 'REAR', 'SEDAN', 'Компактный премиальный седан', NOW(), NOW());

-- Audi
INSERT INTO cars (make, model, year, engine_volume, horsepower, transmission, drive_type, body_type, description, created_at, updated_at) VALUES
('Audi', 'A6', 2023, 2.0, 190, 'AUTOMATIC', 'FRONT', 'SEDAN', 'Бизнес-седан с технологиями', NOW(), NOW()),
('Audi', 'A6', 2022, 2.0, 190, 'AUTOMATIC', 'FRONT', 'SEDAN', 'Бизнес-седан с технологиями', NOW(), NOW()),
('Audi', 'A6', 2021, 2.0, 190, 'AUTOMATIC', 'FRONT', 'SEDAN', 'Бизнес-седан с технологиями', NOW(), NOW()),
('Audi', 'Q5', 2023, 2.0, 190, 'AUTOMATIC', 'ALL', 'SUV', 'Популярный кроссовер', NOW(), NOW()),
('Audi', 'Q5', 2022, 2.0, 190, 'AUTOMATIC', 'ALL', 'SUV', 'Популярный кроссовер', NOW(), NOW()),
('Audi', 'Q5', 2021, 2.0, 190, 'AUTOMATIC', 'ALL', 'SUV', 'Популярный кроссовер', NOW(), NOW()),
('Audi', 'Q7', 2023, 3.0, 249, 'AUTOMATIC', 'ALL', 'SUV', 'Большой кроссовер', NOW(), NOW()),
('Audi', 'Q7', 2022, 3.0, 249, 'AUTOMATIC', 'ALL', 'SUV', 'Большой кроссовер', NOW(), NOW()),
('Audi', 'A4', 2023, 2.0, 190, 'AUTOMATIC', 'FRONT', 'SEDAN', 'Компактный седан', NOW(), NOW()),
('Audi', 'A4', 2022, 2.0, 190, 'AUTOMATIC', 'FRONT', 'SEDAN', 'Компактный седан', NOW(), NOW()),
('Audi', 'Q3', 2023, 1.4, 150, 'AUTOMATIC', 'FRONT', 'SUV', 'Компактный кроссовер', NOW(), NOW()),
('Audi', 'Q3', 2022, 1.4, 150, 'AUTOMATIC', 'FRONT', 'SUV', 'Компактный кроссовер', NOW(), NOW()),
('Audi', 'A8', 2023, 3.0, 249, 'AUTOMATIC', 'ALL', 'SEDAN', 'Флагманский седан', NOW(), NOW()),
('Audi', 'A8', 2022, 3.0, 249, 'AUTOMATIC', 'ALL', 'SEDAN', 'Флагманский седан', NOW(), NOW());

-- Kia
INSERT INTO cars (make, model, year, engine_volume, horsepower, transmission, drive_type, body_type, description, created_at, updated_at) VALUES
('Kia', 'Sportage', 2023, 2.0, 150, 'AUTOMATIC', 'FRONT', 'SUV', 'Стильный кроссовер', NOW(), NOW()),
('Kia', 'Sportage', 2022, 2.0, 150, 'AUTOMATIC', 'FRONT', 'SUV', 'Стильный кроссовер', NOW(), NOW()),
('Kia', 'Sportage', 2021, 2.0, 150, 'AUTOMATIC', 'FRONT', 'SUV', 'Стильный кроссовер', NOW(), NOW()),
('Kia', 'Sportage', 2020, 2.0, 150, 'AUTOMATIC', 'FRONT', 'SUV', 'Стильный кроссовер', NOW(), NOW()),
('Kia', 'Sportage', 2019, 2.0, 150, 'AUTOMATIC', 'FRONT', 'SUV', 'Стильный кроссовер', NOW(), NOW()),
('Kia', 'Rio', 2023, 1.6, 123, 'AUTOMATIC', 'FRONT', 'SEDAN', 'Бюджетный седан', NOW(), NOW()),
('Kia', 'Rio', 2022, 1.6, 123, 'AUTOMATIC', 'FRONT', 'SEDAN', 'Бюджетный седан', NOW(), NOW()),
('Kia', 'Rio', 2021, 1.6, 123, 'AUTOMATIC', 'FRONT', 'SEDAN', 'Бюджетный седан', NOW(), NOW()),
('Kia', 'Rio', 2020, 1.6, 123, 'AUTOMATIC', 'FRONT', 'SEDAN', 'Бюджетный седан', NOW(), NOW()),
('Kia', 'Stinger', 2023, 3.3, 370, 'AUTOMATIC', 'REAR', 'SEDAN', 'Спортивный седан', NOW(), NOW()),
('Kia', 'Stinger', 2022, 3.3, 370, 'AUTOMATIC', 'REAR', 'SEDAN', 'Спортивный седан', NOW(), NOW()),
('Kia', 'Sorento', 2023, 2.2, 200, 'AUTOMATIC', 'ALL', 'SUV', 'Большой кроссовер', NOW(), NOW()),
('Kia', 'Sorento', 2022, 2.2, 200, 'AUTOMATIC', 'ALL', 'SUV', 'Большой кроссовер', NOW(), NOW()),
('Kia', 'Ceed', 2023, 1.4, 140, 'AUTOMATIC', 'FRONT', 'HATCHBACK', 'Компактный хэтчбек', NOW(), NOW()),
('Kia', 'Ceed', 2022, 1.4, 140, 'AUTOMATIC', 'FRONT', 'HATCHBACK', 'Компактный хэтчбек', NOW(), NOW());

-- Hyundai
INSERT INTO cars (make, model, year, engine_volume, horsepower, transmission, drive_type, body_type, description, created_at, updated_at) VALUES
('Hyundai', 'Santa Fe', 2023, 2.2, 200, 'AUTOMATIC', 'ALL', 'SUV', 'Семейный кроссовер', NOW(), NOW()),
('Hyundai', 'Santa Fe', 2022, 2.2, 200, 'AUTOMATIC', 'ALL', 'SUV', 'Семейный кроссовер', NOW(), NOW()),
('Hyundai', 'Santa Fe', 2021, 2.2, 200, 'AUTOMATIC', 'ALL', 'SUV', 'Семейный кроссовер', NOW(), NOW()),
('Hyundai', 'Santa Fe', 2020, 2.2, 200, 'AUTOMATIC', 'ALL', 'SUV', 'Семейный кроссовер', NOW(), NOW()),
('Hyundai', 'Tucson', 2023, 2.0, 150, 'AUTOMATIC', 'FRONT', 'SUV', 'Популярный кроссовер', NOW(), NOW()),
('Hyundai', 'Tucson', 2022, 2.0, 150, 'AUTOMATIC', 'FRONT', 'SUV', 'Популярный кроссовер', NOW(), NOW()),
('Hyundai', 'Tucson', 2021, 2.0, 150, 'AUTOMATIC', 'FRONT', 'SUV', 'Популярный кроссовер', NOW(), NOW()),
('Hyundai', 'Elantra', 2023, 2.0, 150, 'AUTOMATIC', 'FRONT', 'SEDAN', 'Стильный седан', NOW(), NOW()),
('Hyundai', 'Elantra', 2022, 2.0, 150, 'AUTOMATIC', 'FRONT', 'SEDAN', 'Стильный седан', NOW(), NOW()),
('Hyundai', 'Palisade', 2023, 3.8, 295, 'AUTOMATIC', 'ALL', 'SUV', 'Большой семейный кроссовер', NOW(), NOW()),
('Hyundai', 'Palisade', 2022, 3.8, 295, 'AUTOMATIC', 'ALL', 'SUV', 'Большой семейный кроссовер', NOW(), NOW()),
('Hyundai', 'Solaris', 2023, 1.6, 123, 'AUTOMATIC', 'FRONT', 'SEDAN', 'Бюджетный седан', NOW(), NOW()),
('Hyundai', 'Solaris', 2022, 1.6, 123, 'AUTOMATIC', 'FRONT', 'SEDAN', 'Бюджетный седан', NOW(), NOW());

-- Volkswagen
INSERT INTO cars (make, model, year, engine_volume, horsepower, transmission, drive_type, body_type, description, created_at, updated_at) VALUES
('Volkswagen', 'Tiguan', 2023, 2.0, 180, 'AUTOMATIC', 'FRONT', 'SUV', 'Популярный кроссовер', NOW(), NOW()),
('Volkswagen', 'Tiguan', 2022, 2.0, 180, 'AUTOMATIC', 'FRONT', 'SUV', 'Популярный кроссовер', NOW(), NOW()),
('Volkswagen', 'Tiguan', 2021, 2.0, 180, 'AUTOMATIC', 'FRONT', 'SUV', 'Популярный кроссовер', NOW(), NOW()),
('Volkswagen', 'Tiguan', 2020, 2.0, 180, 'AUTOMATIC', 'FRONT', 'SUV', 'Популярный кроссовер', NOW(), NOW()),
('Volkswagen', 'Passat', 2023, 2.0, 190, 'AUTOMATIC', 'FRONT', 'SEDAN', 'Бизнес-седан', NOW(), NOW()),
('Volkswagen', 'Passat', 2022, 2.0, 190, 'AUTOMATIC', 'FRONT', 'SEDAN', 'Бизнес-седан', NOW(), NOW()),
('Volkswagen', 'Passat', 2021, 2.0, 190, 'AUTOMATIC', 'FRONT', 'SEDAN', 'Бизнес-седан', NOW(), NOW()),
('Volkswagen', 'Golf', 2023, 1.4, 150, 'AUTOMATIC', 'FRONT', 'HATCHBACK', 'Культовый хэтчбек', NOW(), NOW()),
('Volkswagen', 'Golf', 2022, 1.4, 150, 'AUTOMATIC', 'FRONT', 'HATCHBACK', 'Культовый хэтчбек', NOW(), NOW()),
('Volkswagen', 'Golf', 2021, 1.4, 150, 'AUTOMATIC', 'FRONT', 'HATCHBACK', 'Культовый хэтчбек', NOW(), NOW());

-- Skoda
INSERT INTO cars (make, model, year, engine_volume, horsepower, transmission, drive_type, body_type, description, created_at, updated_at) VALUES
('Skoda', 'Octavia', 2023, 1.4, 150, 'AUTOMATIC', 'FRONT', 'HATCHBACK', 'Практичный лифтбек', NOW(), NOW()),
('Skoda', 'Octavia', 2022, 1.4, 150, 'AUTOMATIC', 'FRONT', 'HATCHBACK', 'Практичный лифтбек', NOW(), NOW()),
('Skoda', 'Octavia', 2021, 1.4, 150, 'AUTOMATIC', 'FRONT', 'HATCHBACK', 'Практичный лифтбек', NOW(), NOW()),
('Skoda', 'Octavia', 2020, 1.4, 150, 'AUTOMATIC', 'FRONT', 'HATCHBACK', 'Практичный лифтбек', NOW(), NOW()),
('Skoda', 'Kodiaq', 2023, 2.0, 190, 'AUTOMATIC', 'ALL', 'SUV', 'Большой кроссовер', NOW(), NOW()),
('Skoda', 'Kodiaq', 2022, 2.0, 190, 'AUTOMATIC', 'ALL', 'SUV', 'Большой кроссовер', NOW(), NOW()),
('Skoda', 'Kodiaq', 2021, 2.0, 190, 'AUTOMATIC', 'ALL', 'SUV', 'Большой кроссовер', NOW(), NOW()),
('Skoda', 'Rapid', 2023, 1.4, 125, 'AUTOMATIC', 'FRONT', 'SEDAN', 'Бюджетный седан', NOW(), NOW()),
('Skoda', 'Rapid', 2022, 1.4, 125, 'AUTOMATIC', 'FRONT', 'SEDAN', 'Бюджетный седан', NOW(), NOW());

-- Lexus
INSERT INTO cars (make, model, year