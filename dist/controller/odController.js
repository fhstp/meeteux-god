"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../database");
class OdController {
    constructor() {
        this.database = database_1.Connection.getInstance();
    }
    registerOD(identifier) {
        return this.database.user.create({
            name: identifier,
            deviceAddress: 'not known',
            ipAddress: 'not known'
        }).then((user) => {
            return this.database.location.findAll().then((locations) => {
                return { user, locations };
            });
        }).catch((err) => {
            //console.log(err);
            return "FAILED";
        });
    }
}
exports.OdController = OdController;
//# sourceMappingURL=odController.js.map