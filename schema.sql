DROP DATABASE IF EXISTS charles_hustle;

CREATE DATABASE charles_hustle;

\c charles_hustle;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR (26) NOT NULL,
  last_name VARCHAR (26) NOT NULL,
  email VARCHAR (50) NOT NULL,
  slug VARCHAR (50),
  created TIMESTAMP NOT NULL,
  last_updated TIMESTAMP NOT NULL,
  UNIQUE (email, slug),
  pass_hash VARCHAR NOT NULL
);
