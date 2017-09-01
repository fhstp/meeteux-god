"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../database");
class OdController {
    constructor() {
        this.database = database_1.Connection.getInstance();
    }
    registerOD(identifier) {
        this.database.user.create({
            name: identifier,
            deviceAddress: 'not known',
            ipAddress: 'not known'
        });
        return this.database.location.findAll();
    }
}
exports.OdController = OdController;
//# sourceMappingURL=odController.js.map