-- Up Migration
CREATE TABLE tb_template_object (
    id BIGSERIAL PRIMARY KEY,
    templateId BIGINT NOT NULL,
    fieldName VARCHAR(40) NOT NULL,
    italic BOOLEAN NOT NULL,
    bold BOOLEAN NOT NULL,
    fontSize SMALLINT NOT NULL,
    fontFamily VARCHAR(100) NOT NULL,
    fillStyle CHAR(7) NOT NULL,
    x SMALLINT NOT NULL,
    y SMALLINT NOT NULL,
    baseBoxHeight SMALLINT NOT NULL,
    fontBoundingBoxDescent SMALLINT NOT NULL,
    maxRows SMALLINT NOT NULL,
    updatedAt TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    createdAt TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    FOREIGN KEY (templateId) REFERENCES tb_template (id) ON DELETE CASCADE
);

-- Down Migration
DROP TABLE tb_template_object;
