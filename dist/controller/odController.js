"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../database");
class OdController {
    constructor() {
        this.database = database_1.Connection.getInstance();
    }
    registerOD(data) {
        const identifier = data.identifier;
        const deviceAddress = data.deviceAddress;
        const deviceOS = data.deviceOS;
        const deviceVersion = data.deviceVersion;
        const deviceModel = data.deviceModel;
        //const ipAddress: string = data.ipAddress;
        return this.database.user.create({
            name: identifier,
            isGuest: false,
            deviceAddress: deviceAddress,
            deviceOS: deviceOS,
            deviceVersion: deviceVersion,
            deviceModel: deviceModel,
            ipAddress: 'not set'
        }).then((user) => {
            return this.database.location.findAll().then((locations) => {
                return { user, locations };
            });
        }).catch((err) => {
            //console.log(err);
            return "FAILED";
        });
    }
    registerGuest(data) {
        const next = this.database.getNextGuestNumber();
        const identifier = 'Guest' + next;
        const deviceAddress = data.deviceAddress;
        const deviceOS = data.deviceOS;
        const deviceVersion = data.deviceVersion;
        const deviceModel = data.deviceModel;
        //const ipAddress: string = data.ipAddress;
        return this.database.user.create({
            name: identifier,
            deviceAddress: deviceAddress,
            deviceOS: deviceOS,
            deviceVersion: deviceVersion,
            deviceModel: deviceModel,
            ipAddress: 'not set'
        }).then((user) => {
            return this.database.location.findAll().then((locations) => {
                return { user, locations };
            });
        }).catch((err) => {
            //console.log(err);
            return "FAILED";
        });
    }
    findUser(identifier) {
        return this.database.user.findById(identifier).then(user => {
            return user;
        });
    }
}
exports.OdController = OdController;
//# sourceMappingURL=odController.js.map