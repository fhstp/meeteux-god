"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../database");
const messages_1 = require("../messages");
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
            this.database.user.update({ currentLocation: location }, { where: { id: user } });
        }).then(() => {
            this.database.location.findById(location).then((currentLocation) => {
                if (currentLocation.locationTypeId === 2) {
                    this.database.location.update({ currentSeat: this.database.sequelize.literal('currentSeat +1') }, { where: { id: currentLocation.parentId } });
                    this.database.location.update({ statusId: 4 }, { where: { id: currentLocation.id } });
                }
            });
        }).then(() => {
            return { data: location, message: new messages_1.Message(messages_1.SUCCESS_OK, 'Location Registered successfully') };
        }).catch(() => {
            return { data: null, message: new messages_1.Message(messages_1.LOCATION_NOT_UPDATED, 'Could not register location') };
        });
    }
    disconnectedFromExhibit(data) {
        const parentLocation = data.parentLocation;
        const location = data.location;
        return this.database.location.update({ statusId: 3 }, { where: { id: location } }).then(() => {
            return this.database.location.update({ currentSeat: this.database.sequelize.literal('currentSeat -1') }, { where: { id: parentLocation } });
        }).then(() => {
            return { data: { location, parent: parentLocation }, message: new messages_1.Message(messages_1.SUCCESS_OK, 'Disconnected successfully from Exhibit') };
        }).catch(() => {
            return { data: null, message: new messages_1.Message(messages_1.LOCATION_NOT_UPDATED, "Could not update location status") };
        });
    }
    tableDisconnectFromExhibit(users) {
        for (let u of users) {
            this.database.user.findById(u.id).then(user => {
                this.database.location.findById(user.currentLocation).then(location => {
                    this.disconnectedFromExhibit({ parentLocation: location.parentId, location: location.id });
                    this.registerLocation({ user: user.id, location: location.parentId });
                });
            });
        }
    }
    checkLocationStatus(locationId) {
        //console.log(locationId);
        let status = "NOT FOUND";
        return this.database.location.findById(locationId).then((location) => {
            //console.log(location);
            if (location.locationTypeId != 3 && location.locationTypeId != 2)
                status = "NOT ACTIVE EXHIBIT";
            else if (location.locationTypeId === 3 && location.statusId === 3 && location.currentSeat < location.maxSeat)
                status = "FREE";
            else if (location.locationTypeId === 2 && location.statusId === 3)
                status = "FREE";
            else
                status = "OCCUPIED";
            return { data: { status, location: locationId }, message: new messages_1.Message(messages_1.SUCCESS_OK, "Status queried successfully") };
        }).catch(() => {
            return { data: null, message: new messages_1.Message(messages_1.LOCATION_NOT_FOUND, "Could not find location") };
        });
    }
}
exports.LocationController = LocationController;
//# sourceMappingURL=locationController.js.map