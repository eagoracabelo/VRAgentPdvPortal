INSERT INTO users (username, password_hash, email, full_name, created_at, updated_at)
VALUES (
    'admin',
    '$2a$10$dXJ3SW6G7P4wuq/qffRt.eQQbD4YuQPu4B8Z8J3v5C3K5ZJ7x8E5G', -- senha: admin123
    'admin@vrsoftware.com.br',
    'Administrador do Sistema',
    NOW(),
    NOW()
);