const config = {
  test: {
    client: "pg",
    connection:
      process.env.DB_URL ||
      "postgres://elevenlabs:elevenlabs@db:5432/elevenlabs",
    migrations: {
      directory: `${__dirname}/migrations`
    },
    seeds: {
      directory: `${__dirname}/seeds`
    }
  },
  development: {
    client: "pg",
    connection:
      process.env.DB_URL ||
      "postgres://elevenlabs:elevenlabs@db:5432/elevenlabs",
    migrations: {
      directory: `${__dirname}/migrations`
    },
    seeds: {
      directory: `${__dirname}/seeds`
    }
  },
  production: {
    client: "pg",
    connection: process.env.DB_URL,
    migrations: {
      directory: `${__dirname}/migrations`
    },
    seeds: {
      directory: `${__dirname}/seeds`
    }
  }
};

module.exports = config;
