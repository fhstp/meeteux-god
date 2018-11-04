"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../database");
const messages_1 = require("../messages");
const odTypes_1 = require("../messages/odTypes");
const authenticationTypes_1 = require("../messages/authenticationTypes");
class OdController {
    constructor() {
        this.database = database_1.Connection.getInstance();
    }
    getLookupTable(user) {
        return this.database.location.findAll().then((locations) => {
            return this.database.activity.findAll({ where: { userId: user } }).then((activities) => {
                for (let loc of locations) {
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
    registerOD(data) {
        const identifier = data.identifier;
        const deviceAddress = data.deviceAddress;
        const deviceOS = data.deviceOS;
        const deviceVersion = data.deviceVersion;
        const deviceModel = data.deviceModel;
        const email = data.email;
        const pwd = data.password;
        //const ipAddress: string = data.ipAddress;
        return this.database.sequelize.transaction((t1) => {
            return this.database.user.create({
                name: identifier,
                email: email,
                password: pwd,
                isGuest: false,
                deviceAddress: deviceAddress,
                deviceOS: deviceOS,
                deviceVersion: deviceVersion,
                deviceModel: deviceModel,
                ipAddress: 'not set'
            }).then((user) => {
                return this.getLookupTable(user.id).then((locations) => {
                    return {
                        data: { user, locations },
                        message: new messages_1.Message(messages_1.SUCCESS_CREATED, "User created successfully")
                    };
                });
            }).catch(() => {
                return { data: null, message: new messages_1.Message(odTypes_1.OD_NOT_CREATED, "Could not create user") };
            });
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
        return this.database.sequelize.transaction((t1) => {
            return this.database.user.create({
                name: identifier,
                deviceAddress: deviceAddress,
                deviceOS: deviceOS,
                deviceVersion: deviceVersion,
                deviceModel: deviceModel,
                ipAddress: 'not set'
            }).then((user) => {
                return this.getLookupTable(user.id).then((locations) => {
                    return {
                        data: { user, locations },
                        message: new messages_1.Message(messages_1.SUCCESS_CREATED, "User created successfully")
                    };
                });
            }).catch(() => {
                return { data: null, message: new messages_1.Message(odTypes_1.OD_NOT_CREATED, "User could not be registered") };
            });
        });
    }
    findUser(identifier) {
        return this.database.user.findById(identifier).then(user => {
            return user;
        });
    }
    autoLoginUser(identifier) {
        return this.database.user.findById(identifier).then(user => {
            if (!user)
                throw new Error('User not found');
            return this.getLookupTable(user.id).then((locations) => {
                return { data: { user, locations }, message: new messages_1.Message(messages_1.SUCCESS_LOGGED_IN, "User logged in successfully") };
            });
        }).catch(() => {
            return { data: null, message: new messages_1.Message(authenticationTypes_1.LOGIN_FAILED, "User not found!") };
        });
    }
    loginUser(data) {
        const user = data.user;
        const password = data.password;
        return this.database.user.findOne({ where: { name: user, password: password } }).then((user) => {
            return this.getLookupTable(user.id).then((locations) => {
                return { data: { user, locations }, message: new messages_1.Message(messages_1.SUCCESS_LOGGED_IN, "User logged in successfully") };
            });
        }).catch(() => {
            return { data: null, message: new messages_1.Message(authenticationTypes_1.LOGIN_FAILED, "User not found!") };
        });
    }
    checkUserNameExists(name) {
        return this.database.user.count({ where: { name: name } }).then(count => {
            return count != 0;
        });
    }
}
exports.OdController = OdController;
//# sourceMappingURL=odController.js.map