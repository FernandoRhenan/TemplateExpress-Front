-- Up Migration
CREATE TABLE tb_user (
    id SERIAL PRIMARY KEY,
    email VARCHAR(254) NOT NULL UNIQUE,
    password CHAR(60) NOT NULL,
    username VARCHAR(40) NOT NULL UNIQUE,
    updatedAt TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    createdAt TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    confirmedAccount BOOLEAN DEFAULT false
);

-- Down Migration
DROP TABLE tb_user;
