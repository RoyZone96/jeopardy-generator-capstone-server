require('dotenv').config();
const pg = require('pg');
pg.defaults.ssl = process.env.NODE_ENV === "production";

module.exports = {
  "migrationDirectory": "migrations",
  "driver": "pg",
  "connectionString": process.env.DATABASE_URL,
  "host": process.env.MIGRATION_DB_HOST,
  "port": process.env.MIGRATION_DB_PORT,
  "database": process.env.MIGRATION_DATABASE_NAME,
  "username": process.env.MIGRATION_DATABASE_USER,
  "password": process.env.MIGRATION_DATABASE_PASS
}