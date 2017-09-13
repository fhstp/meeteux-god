"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../database");
class LocationController {
    constructor() {
        this.database = database_1.Connection.getInstance();
    }
    registerLocation(data) {
        const user = data.user;
        const location = data.location;
        return this.database.activity.create({
            userId: user,
            locationId: location,
            timestamp: Date.now()
        }).then(() => {
            return location;
        }).catch((err) => {
            //console.log(err);
            return "FAILED";
        });
    }
}
exports.LocationController = LocationController;
//# sourceMappingURL=locationController.js.map