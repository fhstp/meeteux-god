"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Sequelize = require("sequelize");
const CLS = require("continuation-local-storage");
const dataFactory_1 = require("./dataFactory");
require('dotenv').config();
class Connection {
    constructor() {
        this._namespace = CLS.createNamespace('MEETeUX');
        Sequelize.useCLS(this._namespace);
        this._sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
            host: 'localhost',
            dialect: 'mysql',
            operatorsAliases: { $and: Sequelize.Op.and },
            logging: false
        });
        this.initDatabaseTables();
        this.initDatabaseRelations();
        const dataFactory = new dataFactory_1.DataFactory();
        dataFactory.connection = this;
        this._sequelize.sync({ force: true }).then(() => {
            dataFactory.createData().catch(err => {
                console.log("Could not create data!");
            });
        }).then(this._settings.findByPk(1).then(result => this._currentSettings = result));
        // this._sequelize.sync().then( this._settings.findById(1).then(result => this._currentSettings = result));
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
        //ActivityLog to Activity Relation (1:n)
        this._activity.hasMany(this._activityLog, { onDelete: 'cascade' });
        this._activityLog.belongsTo(this._activity);
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
        //_location to _content relation (1:n)
        this._content.belongsTo(this._location, { foreignKey: { allowNull: false } });
        this._location.hasMany(this._content, { foreignKey: { allowNull: false } });
        //_content to _contentType relation (1:n)
        this._content.belongsTo(this._contentType, { foreignKey: { allowNull: false } });
        this._contentType.hasMany(this._content, { foreignKey: { allowNull: false } });
        //_content to _contentLanguage relation (1:n)
        this._content.belongsTo(this._contentLanguage, { foreignKey: { allowNull: false } });
        this._contentLanguage.hasMany(this._content, { foreignKey: { allowNull: false } });
        //_user to _contentLanguage relation (1:n)
        this._user.belongsTo(this._contentLanguage, { foreignKey: { allowNull: false } });
        this._contentLanguage.hasMany(this._user, { foreignKey: { allowNull: false } });
        //_location to _status relation (1:n)
        this._status.hasMany(this._location, { foreignKey: { allowNull: false } });
        this._location.belongsTo(this._status, { foreignKey: { allowNull: false } });
        //_location to _position relation (1:n)
        this._position.hasMany(this._location, { foreignKey: { allowNull: true } });
        this._location.belongsTo(this._position, { foreignKey: { allowNull: true } });
    }
    initDatabaseTables() {
        this._settings = this._sequelize.define('setting', {
            guestNumber: {
                type: Sequelize.INTEGER
            },
            wifiSSID: {
                type: Sequelize.STRING
            }
        });
        this._user = this._sequelize.define('user', {
            id: {
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },
            password: {
                type: Sequelize.STRING,
                allowNull: true
            },
            email: {
                type: Sequelize.STRING,
                unique: true
            },
            isGuest: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true
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
            },
            isStartPoint: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            showInTimeline: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
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
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: false
            },
            description: {
                type: Sequelize.STRING,
                allowNull: false
            }
        });
        this._content = this._sequelize.define('content', {
            content: {
                type: Sequelize.STRING,
                allowNull: false
            },
            order: {
                type: Sequelize.INTEGER,
                allowNull: false
            }
        });
        this._contentLanguage = this._sequelize.define('contentLanguage', {
            description: {
                type: Sequelize.STRING,
                allowNull: false
            },
            tag: {
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
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: false
            },
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
            liked: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            locked: {
                type: Sequelize.BOOLEAN,
                defaultValue: true
            }
        });
        this._activityLog = this._sequelize.define('activityLog', {
            timestamp: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW
            }
        });
    }
    getNextGuestNumber() {
        const numb = this._currentSettings.guestNumber;
        this._currentSettings.guestNumber = numb + 1;
        this._currentSettings.save();
        return numb;
    }
    get activity() {
        return this._activity;
    }
    get activityLog() {
        return this._activityLog;
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
    get content() {
        return this._content;
    }
    get contentLanguage() {
        return this._contentLanguage;
    }
    get currentSettings() {
        return this._currentSettings;
    }
    get sequelize() {
        return this._sequelize;
    }
    get settings() {
        return this._settings;
    }
}
exports.Connection = Connection;
//# sourceMappingURL=connection.js.map