"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Sequelize = require("sequelize");
require('dotenv').config();
class Connection {
    constructor() {
        this.sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
            host: 'localhost',
            dialect: 'mysql',
        });
        this.initDatabase();
        this.sequelize.sync();
    }
    static getInstance() {
        if (Connection.instance === null || Connection.instance === undefined) {
            Connection.instance = new Connection();
        }
        return Connection.instance;
    }
    initDatabase() {
        this.user = this.sequelize.define('user', {
            username: Sequelize.STRING,
            password: Sequelize.STRING,
        });
    }
}
exports.Connection = Connection;
//# sourceMappingURL=connection.js.map