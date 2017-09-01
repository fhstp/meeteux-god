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
        const type = data.type;
        let message = "SUCCESS";
        return this.database.activity.create({
            userId: user,
            locationId: location,
            activityTypeId: type,
            timestamp: Date.now()
        }).then(() => {
            return message;
        }).catch((err) => {
            message = "FAILED";
            //console.log(err);
            return message;
        });
    }
}
exports.LocationController = LocationController;
//# sourceMappingURL=locationController.js.map