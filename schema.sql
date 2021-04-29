DROP DATABASE IF EXISTS charles_hustle;

CREATE DATABASE charles_hustle;

\c charles_hustle;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR (26) NOT NULL,
    CHECK (first_name <> ''),
  last_name VARCHAR (26) NOT NULL,
    CHECK (last_name <> ''),
  email VARCHAR (50) NOT NULL UNIQUE,
    CHECK (email <> ''),
  slug VARCHAR (50) UNIQUE,
    CHECK(slug <> ''),
  created TIMESTAMP NOT NULL,
  last_updated TIMESTAMP NOT NULL,
  pass_hash VARCHAR NOT NULL,
    CHECK (pass_hash <> '')
);
