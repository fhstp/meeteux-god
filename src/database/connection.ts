import * as Sequelize from 'sequelize';
import * as CLS from 'continuation-local-storage';
import {DataFactory} from "./dataFactory";
import * as Winston from 'winston';
import Logger from "../config/logger";
require('dotenv').config();

export class Connection
{
    private static _instance: Connection;
    private readonly _sequelize: any;
    private readonly _namespace: any;
    private _user: any;
    private _group: any;
    private _location: any;
    private _locationType: any;
    private _contentType: any;
    private _status: any;
    private _position: any;
    private _activity: any;
    private _neighbor:any;
    private _settings: any;

    private _currentSettings: any;

    private constructor()
    {
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

        const dataFactory = new DataFactory();
        dataFactory.connection = this;

        this._sequelize.sync({force: true}).then(() =>
        {
            dataFactory.createData().catch(err =>
            {
                console.log("Could not create data!");
            });
        }).then( this._settings.findById(1).then(result => this._currentSettings = result));


        // this._sequelize.sync().then( this._settings.findById(1).then(result => this._currentSettings = result));

    }

    public static getInstance(): Connection
    {
        if(Connection._instance === null || Connection._instance === undefined)
        {
            Connection._instance = new Connection();
        }

        return Connection._instance;
    }

    private initDatabaseRelations(): void
    {
        //User to Group Relation (1:n)
        this._group.hasMany(this._user, {onDelete: 'cascade'});
        this._user.belongsTo(this._group);

        //User to Location Relation (n:m)
        this._user.hasMany(this._activity, {onDelete: 'cascade', foreignKey: {allowNull: false}});
        this._activity.belongsTo(this._user, {foreignKey: {allowNull: false}});
        this._location.hasMany(this._activity, {onDelete: 'cascade', foreignKey: {allowNull: false}});
        this._activity.belongsTo(this._location, {foreignKey: {allowNull: false}});

        //_location to _location relation (1:n)
        this._location.hasMany(this._location, {onDelete: 'cascade', foreignKey: {
            name: 'parentId',
            allowNull: true
            }
        });
        this._location.belongsTo(this._location, {foreignKey: {
            name: 'parentId',
            allowNull: true
         }
        });

        //_user to _location relation (1:n)
        this._location.hasMany(this._user, {foreignKey: 'currentLocation'});
        this._user.belongsTo(this._location, {foreignKey: 'currentLocation'});

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
        this._locationType.hasMany(this._location, {foreignKey: {allowNull: false}});
        this._location.belongsTo(this._locationType, {foreignKey: {allowNull: false}});

        //_location to _contentType relation (1:n)
        this._location.belongsTo(this._contentType);
        this._contentType.hasMany(this._location);

        //_location to _status relation (1:n)
        this._status.hasMany(this._location, {foreignKey: {allowNull: false}});
        this._location.belongsTo(this._status, {foreignKey: {allowNull: false}});

        //_location to _position relation (1:n)
        this._position.hasMany(this._location, {foreignKey: {allowNull: true}});
        this._location.belongsTo(this._position, {foreignKey: {allowNull: true}});
    }

    private initDatabaseTables():void
    {
        this._settings = this._sequelize.define('setting', {
            guestNumber: {
                type: Sequelize.INTEGER
            }
        });

        this._user = this._sequelize.define('user', {
            'id': {
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            password: {
                type: Sequelize.STRING,
                allowNull: true
            },
            email: {
                type: Sequelize.STRING
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
        })

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
            },
            isStartPoint: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
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
            timestamp: {
                type: Sequelize.DATE,
                allowNull: false
            },
            liked: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            dismissed: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            }
        });
    }

    public getNextGuestNumber(): Number
    {
        const numb = this._currentSettings.guestNumber;
        this._currentSettings.guestNumber = numb+1;
        this._currentSettings.save();

        return numb;
    }

    get activity(): any {
        return this._activity;
    }

    get user(): any {
        return this._user;
    }

    get group(): any {
        return this._group;
    }

    get location(): any {
        return this._location;
    }

    get locationType(): any {
        return this._locationType;
    }

    get contentType(): any {
        return this._contentType;
    }

    get status(): any {
        return this._status;
    }

    get position(): any {
        return this._position;
    }

    get neighbor(): any {
        return this._neighbor;
    }

    get currentSettings(): any {
        return this._currentSettings;
    }

    get sequelize(): any {
        return this._sequelize;
    }

    get settings(): any {
        return this._settings;
    }
}
