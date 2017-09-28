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
    checkLocationStatus(locationId) {
        let status = "NOT FOUND";
        return this.database.user.findById(locationId).then((location) => {
            if (location.locationType != 3)
                status = "NOT ACTIVE EXHIBIT";
            else if (location.statusId == 3 && location.currentSeat < location.maxSeat)
                status = "FREE";
            else
                status = "OCCUPIED";
            return status;
        }).catch((err) => {
            //console.log(err);
            return "FAILED";
        });
    }
}
exports.LocationController = LocationController;
//# sourceMappingURL=locationController.js.map