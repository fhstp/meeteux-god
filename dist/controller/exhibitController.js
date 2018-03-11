"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../database");
const messages_1 = require("../messages");
class ExhibitController {
    constructor() {
        this.database = database_1.Connection.getInstance();
    }
    loginExhibit(ipAddress) {
        return this.database.location.findOne({ where: { ipAddress: ipAddress } }).then((exhibit) => {
            return { data: exhibit, message: new messages_1.Message(messages_1.SUCCESS_OK, "location data found") };
        }).catch(() => {
            return { data: null, message: new messages_1.Message(messages_1.LOCATION_NOT_FOUND, "Could not find location") };
        });
    }
}
exports.ExhibitController = ExhibitController;
//# sourceMappingURL=exhibitController.js.map