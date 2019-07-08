const knex = require("knex");
const config = require("./knexfile");

const Logger = require("./logger");
const SQLExtension = require("./sqlExtension");
const SQLDataSource = require('./sqlDataSource');

const environment = process.env.NODE_ENV || "development";
let Database = Logger(knex(config[environment]));

module.exports = {
    SQLExtension,
    Database,
    SQLDataSource
}