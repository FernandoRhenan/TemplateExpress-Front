-- Up Migration

CREATE TABLE tb_email_confirmation_token (
    id SERIAL PRIMARY KEY,
    userId INTEGER NOT NULL,
    userEmail VARCHAR(155) NOT NULL UNIQUE,
    token UUID NOT NULL,
    expiresAt TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    updatedAt TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    createdAt TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    FOREIGN KEY (userId) REFERENCES tb_user (id) ON DELETE CASCADE
);

-- Down Migration

DROP TABLE tb_email_confirmation_token
