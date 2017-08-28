"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Sequelize = require("sequelize");
class Connection {
    constructor() {
        this.sequelize = new Sequelize('database', 'username', 'password');
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
        });
    }
}
exports.Connection = Connection;
//# sourceMappingURL=connection.js.map