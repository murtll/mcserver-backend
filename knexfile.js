/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
const config = {
  prod: {
    client: "pg",
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      user: process.env.DB_USER || 'test',
      password: process.env.DB_PASSWORD || 'test',
      database: process.env.DB_NAME || 'test'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    }
  },
  dev: {
    client: "pg",
    connection: {
      host: 'localhost',
      port: 54321,
      user: 'test',
      password: 'test',
      database: 'test'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    }
  }
};

export default config