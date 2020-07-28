DROP TABLE IF EXISTS joke;
CREATE TABLE joke (
    id SERIAL PRIMARY KEY ,
    type varchar(255),
    setup varchar(255),
    punchline varchar(255)
);
