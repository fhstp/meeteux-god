"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../database");
const messages_1 = require("../messages");
class ConfigController {
    constructor() {
        this.database = database_1.Connection.getInstance();
    }
    isWifiSSIDMatching(ssid) {
        const correctSSID = this.database.currentSettings.wifiSSID;
        return { data: { check: correctSSID.localeCompare(ssid) === 0 }, message: new messages_1.Message(messages_1.SUCCESS_OK, 'SSID was checked!') };
    }
}
exports.ConfigController = ConfigController;
//# sourceMappingURL=configController.js.map