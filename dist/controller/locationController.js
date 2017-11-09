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
            this.database.location.findById(location).then((currentLocation) => {
                if (currentLocation.locationTypeId === 2) {
                    this.database.location.update({ currentSeat: this.database.sequelize.literal('currentSeat +1') }, { where: { id: currentLocation.parentId } });
                }
            });
        }).then(() => {
            return location;
        }).catch((err) => {
            //console.log(err);
            return "FAILED";
        });
    }
    disconnectedFromExhibit(location) {
        console.log("Location: " + location);
        return this.database.location.update({ currentSeat: this.database.sequelize.literal('currentSeat -1') }, { where: { id: location } }).then((update) => {
            console.log(update);
            return "SUCCESS";
        }).catch((err) => {
            //console.log(err);
            return "FAILED";
        });
        ;
    }
    checkLocationStatus(locationId) {
        //console.log(locationId);
        let status = "NOT FOUND";
        return this.database.location.findById(locationId).then((location) => {
            //console.log(location);
            if (location.locationTypeId != 3)
                status = "NOT ACTIVE EXHIBIT";
            else if (location.statusId === 3 && location.currentSeat < location.maxSeat)
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