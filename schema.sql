DROP DATABASE IF EXISTS charles_hustle;

CREATE DATABASE charles_hustle;

\c charles_hustle;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR (26) NOT NULL,
  last_name VARCHAR (26) NOT NULL,
  email VARCHAR (50) NOT NULL UNIQUE,
  slug VARCHAR (50) UNIQUE,
  created TIMESTAMP NOT NULL,
  last_updated TIMESTAMP NOT NULL,
  pass_hash VARCHAR NOT NULL
);
