const { Sequelize } = require("sequelize");
let sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    logging: false,
    host: process.env.DB_HOST,
    dialect: "postgres",
    dialectOptions: {
      connectTimeout: 10000,
    },
    pool: {
      max: 60,
      min: 0,
      acquire: 20000,
      idle: 5000,
    },
    sync: true
  }
);
try {
  sequelize
    // .sync({alter:true})
    .authenticate()
    .then( () => {
        console.log("Database connection has been established successfully.");
    })
    .catch( (err) => {
        console.error('Unable to connect to the database:', err);
    });
} catch (error) {
    console.log(`Unable to connect to the PostgresDb: ${JSON.stringify(error)}`);
}

module.exports = { Sequelize, sequelize };
