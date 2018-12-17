"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../database");
const messages_1 = require("../messages");
const odTypes_1 = require("../messages/odTypes");
const authenticationTypes_1 = require("../messages/authenticationTypes");
const contentLanguages = require("../config/contentLanguages");
class OdController {
    constructor() {
        this.database = database_1.Connection.getInstance();
    }
    getLookupTable(user) {
        return this.database.location.findAll({
            include: [
                {
                    model: this.database.content,
                    where: { contentLanguageId: { [this.database.sequelize.Op.or]: [user.contentLanguageId, contentLanguages.ALL] } },
                    required: false
                }
            ],
            order: [
                ['id', 'ASC'],
                [this.database.content, 'order', 'ASC']
            ]
        }).then((locations) => {
            return this.database.activity.findAll({ where: { userId: user.id } }).then((activities) => {
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
    registerOD(data) {
        const identifier = data.identifier;
        const deviceAddress = data.deviceAddress;
        const deviceOS = data.deviceOS;
        const deviceVersion = data.deviceVersion;
        const deviceModel = data.deviceModel;
        const email = data.email;
        const pwd = data.password;
        const language = data.language;
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
                ipAddress: 'not set',
                contentLanguageId: language
            }).then((user) => {
                return this.getLookupTable(user).then((locations) => {
                    // console.log(user);
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
        const language = data.language;
        //const ipAddress: string = data.ipAddress;
        // console.log("id: %s language: %d", identifier, language);
        return this.database.sequelize.transaction((t1) => {
            return this.database.user.create({
                name: identifier,
                deviceAddress: deviceAddress,
                deviceOS: deviceOS,
                deviceVersion: deviceVersion,
                deviceModel: deviceModel,
                ipAddress: 'not set',
                contentLanguageId: language
            }).then((user) => {
                return this.getLookupTable(user).then((locations) => {
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
        return this.database.user.findByPk(identifier).then(user => {
            return user;
        });
    }
    autoLoginUser(identifier) {
        return this.database.user.findByPk(identifier).then(user => {
            if (!user)
                throw new Error('User not found');
            return this.getLookupTable(user).then((locations) => {
                return {
                    data: { user, locations },
                    message: new messages_1.Message(messages_1.SUCCESS_LOGGED_IN, "User logged in successfully")
                };
            });
        }).catch(() => {
            return { data: null, message: new messages_1.Message(authenticationTypes_1.LOGIN_FAILED, "User not found!") };
        });
    }
    loginUser(data) {
        const user = data.user;
        const email = data.email;
        const password = data.password;
        if (user) {
            return this.database.user.findOne({ where: { name: user, password } }).then((user) => {
                if (user) {
                    return this.getLookupTable(user).then((locations) => {
                        return {
                            data: { user, locations },
                            message: new messages_1.Message(messages_1.SUCCESS_LOGGED_IN, "User logged in successfully")
                        };
                    });
                }
                else {
                    return { data: undefined, message: new messages_1.Message(odTypes_1.OD_NOT_FOUND, "Could not log in user") };
                }
            }).catch(() => {
                return { data: null, message: new messages_1.Message(authenticationTypes_1.LOGIN_FAILED, "User not found!") };
            });
        }
        else {
            return this.database.user.findOne({ where: { email, password } }).then((user) => {
                if (user) {
                    return this.getLookupTable(user).then((locations) => {
                        return {
                            data: { user, locations },
                            message: new messages_1.Message(messages_1.SUCCESS_LOGGED_IN, "User logged in successfully")
                        };
                    });
                }
                else {
                    return { data: undefined, message: new messages_1.Message(odTypes_1.OD_NOT_FOUND, "Could not log in user") };
                }
            }).catch(() => {
                return { data: null, message: new messages_1.Message(authenticationTypes_1.LOGIN_FAILED, "User not found!") };
            });
        }
    }
    updateUserLanguage(data) {
        const id = data.user;
        const lang = data.language;
        return this.database.user.findByPk(id).then(user => {
            if (!user)
                throw new Error('User not found');
            user.contentLanguageId = lang;
            user.save();
            return this.getLookupTable(user).then((locations) => {
                return {
                    data: { locations, language: lang },
                    message: new messages_1.Message(messages_1.SUCCESS_UPDATED, "Updated user language successfully!")
                };
            });
        }).catch(() => {
            return { data: null, message: new messages_1.Message(odTypes_1.OD_NOT_UPDATED, "Could not change language!") };
        });
    }
    updateUserData(data) {
        const id = data.user;
        const username = data.username;
        const email = data.email;
        const password = data.password;
        const newPassword = data.newPassword;
        return this.database.user.findByPk(id).then(user => {
            if (!user)
                throw new Error('User not found');
            if (username && username !== '')
                user.name = username;
            if (email && email !== '')
                user.email = email;
            if (password && password === user.password && newPassword && newPassword !== user.password && newPassword !== '')
                user.password = password;
            user.save();
            return { data: { user }, message: new messages_1.Message(messages_1.SUCCESS_UPDATED, "Updated user data successfully!") };
        }).catch(() => {
            return { data: null, message: new messages_1.Message(odTypes_1.OD_NOT_UPDATED, "Could not update user data!") };
        });
    }
    deleteOD(userId) {
        this.database.user.destroy({ where: { id: userId } });
    }
    checkUserNameExists(name) {
        return this.database.user.count({ where: { name: name } }).then(count => {
            return count != 0;
        });
    }
    checkEmailExists(email) {
        return this.database.user.count({ where: { email } }).then(count => {
            return count != 0;
        });
    }
}
exports.OdController = OdController;
//# sourceMappingURL=odController.js.map