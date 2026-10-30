relational=> CREATE TABLE blogs(
  id SERIAL PRIMARY KEY,
  author text,
  url text NOT NULL,
  title text NOT NULL,
  likes integer DEFAULT 0
);

insert into blogs (author, url, title) values ('Fredrick Onyango','https://fredrickoguya.github.io/My-Portfolio/', 'the boy');

insert into blogs (author, url, title) values ('The boys', 'boys.com', 'To man boy', );