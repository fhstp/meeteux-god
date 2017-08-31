"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../database");
class LocationController {
    constructor() {
        this.database = database_1.Connection.getInstance();
    }
    registerLocation(data) {
        const user = 0;
        const location = 0;
        const type = 0;
        this.database.activity.create({
            name: '',
            deviceAddress: 'not known',
            ipAddress: 'not known'
        });
    }
}
exports.LocationController = LocationController;
//# sourceMappingURL=locationController.js.map