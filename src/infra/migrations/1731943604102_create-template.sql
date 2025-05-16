-- Up Migration
CREATE TABLE tb_template (
    id BIGSERIAL PRIMARY KEY,
    userId INTEGER NOT NULL,
    width SMALLINT NOT NULL,
    height SMALLINT NOT NULL,
    updatedAt TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    createdAt TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    FOREIGN KEY (userId) REFERENCES tb_user (id) ON DELETE CASCADE
);

-- Down Migration
DROP TABLE tb_template;
