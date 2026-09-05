-- ============================================================
-- V2__add_avatar_url.sql
-- Добавляем поле avatar_url в таблицу пользователей
-- ============================================================

ALTER TABLE avto_analytics_users
ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(500);