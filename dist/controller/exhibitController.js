"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../database");
class ExhibitController {
    constructor() {
        this.database = database_1.Connection.getInstance();
    }
    loginExhibit(ipAddress) {
        return this.database.location.findOne({ where: { ipAddress: ipAddress } }).then((exhibit) => {
            return exhibit;
        }).catch((err) => {
            return "FAILED";
        });
    }
}
exports.ExhibitController = ExhibitController;
//# sourceMappingURL=exhibitController.js.map