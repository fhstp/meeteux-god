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
        const userId = data.user;
        const locationId = data.location;
        const dismissed = data.dismissed;
        return this.database.sequelize.transaction((t1) => {
            return this.database.activity.findOrCreate({
                where: { userId, locationId },
                defaults: { locked: dismissed }
            }).spread((activity, wasCreated) => {
                if (!wasCreated) {
                    activity.locked = dismissed;
                    activity.save();
                }
                this.database.activityLog.create({ activityId: activity.id });
                if (dismissed)
                    return { data: { location: locationId, dismissed }, message: new messages_1.Message(messages_1.SUCCESS_OK, 'Location Registered successfully') };
                this.database.user.update({ currentLocation: locationId }, { where: { id: userId } });
                this.database.location.findByPk(locationId).then((currentLocation) => {
                    if (currentLocation.statusId === statusTypes.FREE && (currentLocation.locationTypeId === locationTypes.ACTIVE_EXHIBIT_ON || currentLocation.locationTypeId === locationTypes.ACTIVE_EXHIBIT_BEHAVIOR_ON)) {
                        this.database.location.update({ currentSeat: this.database.sequelize.literal('currentSeat +1') }, { where: { id: currentLocation.parentId } }).then(() => {
                            if (currentLocation.locationTypeId === locationTypes.ACTIVE_EXHIBIT_ON)
                                this.database.location.update({ statusId: statusTypes.OCCUPIED }, { where: { id: currentLocation.id } });
                            this.updateActiveLocationStatus(currentLocation.parentId);
                        });
                    }
                });
            }).then(() => {
                return this.getLookupTable(userId).then(lookuptable => {
                    return {
                        data: { location: locationId, dismissed, lookuptable },
                        message: new messages_1.Message(messages_1.SUCCESS_OK, 'Location Registered successfully')
                    };
                });
            });
        });
    }
    updateLocationLike(data) {
        const user = data.user;
        const location = data.location;
        const like = data.like;
        return this.database.sequelize.transaction((t1) => {
            return this.database.activity.update({ liked: like }, {
                where: {
                    userId: user,
                    locationId: location
                }
            }).then(() => {
                return this.getLookupTable(user).then((locations) => {
                    return { data: { locations }, message: new messages_1.Message(messages_1.SUCCESS_OK, "Activity updated successfully") };
                });
            }).catch(() => {
                return { data: null, message: new messages_1.Message(messages_1.LOCATION_NOT_UPDATED, 'Could not update activity') };
            });
        });
    }
    getLookupTable(user) {
        return this.database.location.findAll().then((locations) => {
            return this.database.activity.findAll({ where: { userId: user } }).then((activities) => {
                for (let loc of locations) {
                    // default values must be set if no activity exists yet
                    loc.dataValues.liked = false;
                    loc.dataValues.locked = true;
                    for (let act of activities) {
                        if (loc.id === act.locationId) {
                            loc.dataValues.liked = act.liked;
                            loc.dataValues.locked = act.locked;
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
        return this.database.sequelize.transaction((t1) => {
            return this.database.location.update({ statusId: statusTypes.FREE }, { where: { id: location } }).then(() => {
                return this.database.location.update({ currentSeat: this.database.sequelize.literal('currentSeat -1') }, { where: { id: parentLocation } }).then(() => {
                    this.updateActiveLocationStatus(parentLocation);
                });
            }).then(() => {
                return {
                    data: { location, parent: parentLocation },
                    message: new messages_1.Message(messages_1.SUCCESS_OK, 'Disconnected successfully from Exhibit')
                };
            }).catch(() => {
                return { data: null, message: new messages_1.Message(messages_1.LOCATION_NOT_UPDATED, "Could not update location status") };
            });
        });
    }
    tableDisconnectFromExhibit(users) {
        for (let u of users) {
            this.database.user.findByPk(u.id).then(user => {
                this.database.location.findByPk(user.currentLocation).then(location => {
                    this.disconnectedFromExhibit({ parentLocation: location.parentId, location: location.id });
                    this.registerLocation({ user: user.id, location: location.parentId });
                });
            });
        }
    }
    checkLocationStatus(locationId) {
        //console.log(locationId);
        let status = "NOT FOUND";
        return this.database.location.findByPk(locationId).then((location) => {
            // console.log("CheckLocationStatus:\n-typeId: " + location.locationTypeId + "\n-statusId: " + location.statusId);
            if (location.locationTypeId != locationTypes.ACTIVE_EXHIBIT_ON && location.locationTypeId != locationTypes.ACTIVE_EXHIBIT_AT && location.locationTypeId != locationTypes.ACTIVE_EXHIBIT_BEHAVIOR_ON && location.locationTypeId != locationTypes.ACTIVE_EXHIBIT_BEHAVIOR_AT)
                status = "NOT ACTIVE EXHIBIT";
            else if (location.locationTypeId === locationTypes.ACTIVE_EXHIBIT_AT && location.statusId === statusTypes.FREE && location.currentSeat < location.maxSeat)
                status = "FREE";
            else if (location.locationTypeId === locationTypes.ACTIVE_EXHIBIT_BEHAVIOR_AT && location.statusId === statusTypes.FREE && location.currentSeat < location.maxSeat)
                status = "FREE";
            else if (location.locationTypeId === locationTypes.ACTIVE_EXHIBIT_ON && location.statusId === statusTypes.FREE)
                status = "FREE";
            else if (location.statusId === statusTypes.OFFLINE)
                status = "OFFLINE";
            else
                status = "OCCUPIED";
            return { data: { status, location: locationId }, message: new messages_1.Message(messages_1.SUCCESS_OK, "Status queried successfully") };
        }).catch(() => {
            return { data: null, message: new messages_1.Message(messages_1.LOCATION_NOT_FOUND, "Could not find location") };
        });
    }
    updateActiveLocationStatus(locationId) {
        return this.database.location.findByPk(locationId).then((location) => {
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