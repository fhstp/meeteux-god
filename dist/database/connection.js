"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Sequelize = require("sequelize");
require('dotenv').config();
class Connection {
    constructor() {
        this._sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
            host: 'localhost',
            dialect: 'mysql',
        });
        this.initDatabaseTables();
        this.initDatabaseRelations();
        this._sequelize.sync({ force: true }).then(() => {
            this._locationType.create({
                description: 'room'
            });
            this._locationType.create({
                description: 'activeExhibitOn'
            });
            this._locationType.create({
                description: 'activeExhibitAt'
            });
            this._locationType.create({
                description: 'passiveExhibit'
            });
            this._locationType.create({
                description: 'door'
            });
            this._contentType.create({
                description: 'webContent'
            });
            this._status.create({
                description: 'online'
            });
            this._status.create({
                description: 'offline'
            });
            this._status.create({
                description: 'free'
            });
            this._status.create({
                description: 'occupied'
            });
            this._position.create({
                longitude: 12,
                latitude: 25,
                floor: 1
            });
        }).then(() => {
            this.location.create({
                id: 10,
                description: 'Büro',
                locationTypeId: 1,
                statusId: 1,
                positionId: 1,
                ipAddress: '0.0.0.0'
            }).then(() => {
                this._location.create({
                    id: 101,
                    parentId: 10,
                    description: 'Kerstin atExhibit',
                    contentURL: 'http://www.google.at',
                    ipAddress: '192.168.0.113',
                    locationTypeId: 3,
                    contentTypeId: 1,
                    statusId: 1,
                    positionId: 1,
                    currentSeat: 0,
                    maxSeat: 2
                }).then(() => {
                    this._location.create({
                        id: 100,
                        description: 'Kerstin onExhibit',
                        parentId: 101,
                        contentURL: 'http://www.google.at',
                        ipAddress: '192.168.0.112',
                        locationTypeId: 2,
                        contentTypeId: 1,
                        statusId: 1,
                        positionId: 1
                    });
                });
                this._location.create({
                    id: 1000,
                    parentId: 10,
                    description: 'Flo atExhibit',
                    contentURL: 'http://www.google.at',
                    ipAddress: '192.168.0.114',
                    locationTypeId: 4,
                    contentTypeId: 1,
                    statusId: 1,
                    positionId: 1
                });
                this._location.create({
                    id: 1001,
                    parentId: 10,
                    description: 'Drucker atExhibit',
                    contentURL: 'http://www.google.at',
                    ipAddress: '192.168.0.115',
                    locationTypeId: 4,
                    contentTypeId: 1,
                    statusId: 1,
                    positionId: 1
                });
                this._location.create({
                    id: 1002,
                    parentId: 10,
                    description: 'Stud-Assi atExhibit',
                    contentURL: 'http://www.google.at',
                    ipAddress: '192.168.0.116',
                    locationTypeId: 4,
                    contentTypeId: 1,
                    statusId: 1,
                    positionId: 1
                });
                this._location.create({
                    id: 10000,
                    parentId: 10,
                    description: 'Door',
                    contentURL: 'http://www.google.at',
                    ipAddress: '192.168.0.117',
                    locationTypeId: 5,
                    contentTypeId: 1,
                    statusId: 1,
                    positionId: 1
                });
            });
        });
        //this._sequelize.sync();
    }
    static getInstance() {
        if (Connection._instance === null || Connection._instance === undefined) {
            Connection._instance = new Connection();
        }
        return Connection._instance;
    }
    initDatabaseRelations() {
        //User to Group Relation (1:n)
        this._group.hasMany(this._user, { onDelete: 'cascade' });
        this._user.belongsTo(this._group);
        //User to Location Relation (n:m)
        this._user.hasMany(this._activity, { onDelete: 'cascade', foreignKey: { allowNull: false } });
        this._activity.belongsTo(this._user, { foreignKey: { allowNull: false } });
        this._location.hasMany(this._activity, { onDelete: 'cascade', foreignKey: { allowNull: false } });
        this._activity.belongsTo(this._location, { foreignKey: { allowNull: false } });
        //_location to _location relation (1:n)
        this._location.hasMany(this._location, { onDelete: 'cascade', foreignKey: {
                name: 'parentId',
                allowNull: true
            }
        });
        this._location.belongsTo(this._location, { foreignKey: {
                name: 'parentId',
                allowNull: true
            }
        });
        //_user to _location relation (1:n)
        this._location.hasMany(this._user, { foreignKey: 'currentLocation' });
        this._user.belongsTo(this._location, { foreignKey: 'currentLocation' });
        //_location to _location relation (n:m)
        this._location.belongsToMany(this._location, {
            as: 'location1',
            through: {
                model: this._neighbor
            },
            foreignKey: {
                name: 'locationOne',
                primaryKey: true
            }
        });
        this._location.belongsToMany(this._location, {
            as: 'location2',
            through: {
                model: this._neighbor
            },
            foreignKey: {
                name: 'locationTwo',
                primaryKey: true
            }
        });
        //_location to _locationType relation (1:n)
        this._locationType.hasMany(this._location, { foreignKey: { allowNull: false } });
        this._location.belongsTo(this._locationType, { foreignKey: { allowNull: false } });
        //_location to _contentType relation (1:n)
        this._location.belongsTo(this._contentType);
        this._contentType.hasMany(this._location);
        //_location to _status relation (1:n)
        this._status.hasMany(this._location, { foreignKey: { allowNull: false } });
        this._location.belongsTo(this._status, { foreignKey: { allowNull: false } });
        //_location to _position relation (1:n)
        this._position.hasMany(this._location, { foreignKey: { allowNull: false } });
        this._location.belongsTo(this._position, { foreignKey: { allowNull: false } });
    }
    initDatabaseTables() {
        this._user = this._sequelize.define('user', {
            name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            currentLocation: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            avatar: {
                type: Sequelize.STRING
            },
            deviceAddress: {
                type: Sequelize.STRING,
                allowNull: false
            },
            ipAddress: {
                type: Sequelize.STRING,
                allowNull: false
            },
            deviceOS: {
                type: Sequelize.STRING,
                allowNull: true
            },
            deviceVersion: {
                type: Sequelize.STRING,
                allowNull: true
            },
            deviceModel: {
                type: Sequelize.STRING,
                allowNull: true
            }
        });
        this._group = this._sequelize.define('group', {
            name: {
                type: Sequelize.STRING,
                allowNull: false
            }
        });
        this._location = this._sequelize.define('location', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: false
            },
            contentURL: {
                type: Sequelize.STRING
            },
            contentVersion: {
                type: Sequelize.DOUBLE,
                defaultValue: 1.0
            },
            ipAddress: {
                type: Sequelize.STRING,
                allowNull: false
            },
            description: {
                type: Sequelize.STRING,
                allowNull: false
            },
            currentSeat: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            maxSeat: {
                type: Sequelize.INTEGER,
                allowNull: true,
                defaultValue: 1
            }
        });
        this._neighbor = this._sequelize.define('neighbor', {
            locationOne: {
                type: Sequelize.INTEGER,
                unique: 'compositeIndex'
            },
            locationTwo: {
                type: Sequelize.INTEGER,
                unique: 'compositeIndex'
            }
        });
        this._locationType = this._sequelize.define('locationType', {
            description: {
                type: Sequelize.STRING,
                allowNull: false
            }
        });
        this._contentType = this._sequelize.define('contentType', {
            description: {
                type: Sequelize.STRING,
                allowNull: false
            }
        });
        this._status = this._sequelize.define('status', {
            description: {
                type: Sequelize.STRING,
                allowNull: false
            }
        });
        this._position = this._sequelize.define('position', {
            longitude: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            latitude: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            floor: {
                type: Sequelize.INTEGER,
                allowNull: false
            }
        });
        this._activity = this._sequelize.define('activity', {
            timestamp: {
                type: Sequelize.DATE,
                allowNull: false
            }
        });
    }
    get activity() {
        return this._activity;
    }
    get user() {
        return this._user;
    }
    get group() {
        return this._group;
    }
    get location() {
        return this._location;
    }
    get locationType() {
        return this._locationType;
    }
    get contentType() {
        return this._contentType;
    }
    get status() {
        return this._status;
    }
    get position() {
        return this._position;
    }
    get neighbor() {
        return this._neighbor;
    }
}
exports.Connection = Connection;
//# sourceMappingURL=connection.js.map