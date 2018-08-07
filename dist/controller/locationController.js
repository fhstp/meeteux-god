"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../database");
const messages_1 = require("../messages");
const statusTypes = require("../config/statusTypes");
const locationTypes = require("../config/locationTypes");
class LocationController {
    constructor() {
        this.database = database_1.Connection.getInstance();
    }
    registerLocation(data) {
        const user = data.user;
        const location = data.location;
        const dismissed = data.dismissed;
        return this.database.activity.create({
            userId: user,
            locationId: location,
            timestamp: Date.now(),
            dismissed
        }).then(() => {
            this.database.user.update({ currentLocation: location }, { where: { id: user } });
            if (!dismissed) {
                this.database.location.findById(location).then((currentLocation) => {
                    this.database.location.update({ currentSeat: this.database.sequelize.literal('currentSeat +1') }, { where: { id: currentLocation.parentId } }).then(() => {
                        if (currentLocation.locationTypeId === locationTypes.ACTIVE_EXHIBIT_ON) {
                            this.database.location.update({ statusId: statusTypes.OCCUPIED }, { where: { id: currentLocation.id } });
                        }
                        this.updateActiveLocationStatus(currentLocation.parentId);
                    });
                });
            }
        }).then(() => {
            return { data: { location, dismissed }, message: new messages_1.Message(messages_1.SUCCESS_OK, 'Location Registered successfully') };
        }).catch(() => {
            return { data: null, message: new messages_1.Message(messages_1.LOCATION_NOT_UPDATED, 'Could not register location') };
        });
    }
    registerLocationLike(data) {
        const user = data.user;
        const location = data.location;
        const like = data.like;
        console.log('registerLocationLike');
        return this.database.activity.update({ liked: like }, { where: { userId: user, locationId: location } }).then(() => {
            return this.getLookupTable(user).then((locations) => {
                return { data: { locations }, message: new messages_1.Message(messages_1.SUCCESS_OK, "Activity updated successfully") };
            });
        }).catch(() => {
            return { data: null, message: new messages_1.Message(messages_1.LOCATION_NOT_UPDATED, 'Could not update activity') };
        });
    }
    getLookupTable(user) {
        return this.database.location.findAll().then((locations) => {
            return this.database.activity.findAll({ where: { userId: user, liked: true } }).then((activities) => {
                for (let loc of locations) {
                    loc.dataValues.liked = false;
                    for (let act of activities) {
                        if (loc.id === act.locationId) {
                            loc.dataValues.liked = true;
                        }
                    }
                }
                return locations;
            });
        });
    }
    disconnectedFromExhibit(data) {
        const parentLocation = data.parentLocation;
        const location = data.location;
        return this.database.location.update({ statusId: statusTypes.FREE }, { where: { id: location } }).then(() => {
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
            // console.log("CheckLocationStatus:\n-typeId: " + location.locationTypeId + "\n-statusId: " + location.statusId);
            if (location.locationTypeId != locationTypes.ACTIVE_EXHIBIT_ON && location.locationTypeId != locationTypes.ACTIVE_EXHIBIT_AT && location.locationTypeId != locationTypes.ACTIVE_EXHIBIT_BEHAVIOR_ON && location.locationTypeId != locationTypes.ACTIVE_EXHIBIT_BEHAVIOR_AT)
                status = "NOT ACTIVE EXHIBIT";
            else if (location.locationTypeId === locationTypes.ACTIVE_EXHIBIT_AT && location.statusId === statusTypes.FREE && location.currentSeat < location.maxSeat)
                status = "FREE";
            else if (location.locationTypeId === locationTypes.ACTIVE_EXHIBIT_BEHAVIOR_AT && location.statusId === statusTypes.FREE && location.currentSeat < location.maxSeat)
                status = "FREE";
            else if (location.locationTypeId === locationTypes.ACTIVE_EXHIBIT_ON && location.statusId === statusTypes.FREE)
                status = "FREE";
            else
                status = "OCCUPIED";
            return { data: { status, location: locationId }, message: new messages_1.Message(messages_1.SUCCESS_OK, "Status queried successfully") };
        }).catch(() => {
            return { data: null, message: new messages_1.Message(messages_1.LOCATION_NOT_FOUND, "Could not find location") };
        });
    }
    updateActiveLocationStatus(locationId) {
        return this.database.location.findById(locationId).then((location) => {
            if (location.locationTypeId === locationTypes.ACTIVE_EXHIBIT_AT || location.locationTypeId === locationTypes.ACTIVE_EXHIBIT_BEHAVIOR_AT) {
                if (location.currentSeat < location.maxSeat && location.statusId === statusTypes.OCCUPIED) {
                    location.statusId = statusTypes.FREE;
                }
                else if (location.currentSeat >= location.maxSeat && location.statusId === statusTypes.FREE) {
                    location.statusId = statusTypes.OCCUPIED;
                }
                location.save();
            }
        });
    }
}
exports.LocationController = LocationController;
//# sourceMappingURL=locationController.js.map