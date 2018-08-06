
import { Connection } from '../database';
import {Message, SUCCESS_CREATED, SUCCESS_LOGGED_IN} from "../messages";
import {OD_NOT_CREATED} from "../messages/odTypes";
import {LOGIN_FAILED} from "../messages/authenticationTypes";

export class OdController
{
    private database: Connection;

    constructor()
    {
        this.database = Connection.getInstance();
    }

    private getLookupTable(user: number): any
    {
        return this.database.location.findAll().then( (locations) =>
        {
            return this.database.activity.findAll({where: {userId: user, liked: true}}).then( (activities) =>
            {
                for(let loc of locations)
                {
                    loc.dataValues.liked = false;
                    for(let act of activities)
                    {
                        if(loc.id === act.locationId)
                        {
                            loc.dataValues.liked = true;
                        }
                    }
                }

                return locations;
            });
        });
    }

    public registerOD(data: any): any
    {
        const identifier: string = data.identifier;
        const deviceAddress: string = data.deviceAddress;
        const deviceOS: string = data.deviceOS;
        const deviceVersion: string = data.deviceVersion;
        const deviceModel: string = data.deviceModel;
        //const ipAddress: string = data.ipAddress;

        return this.database.user.create({
            name: identifier,
            isGuest: false,
            deviceAddress: deviceAddress,
            deviceOS: deviceOS,
            deviceVersion: deviceVersion,
            deviceModel: deviceModel,
            ipAddress: 'not set'
        }).then( (user) => {
            return this.getLookupTable(user.id).then( (locations) =>
            {
                return {data: {user, locations}, message: new Message(SUCCESS_CREATED, "User created successfully")};
            });
        }).catch(() => {
            return {data: null, message: new Message(OD_NOT_CREATED, "Could not create user")};
        });
    }

    public registerGuest(data: any): any
    {
        const next = this.database.getNextGuestNumber();

        const identifier: string = 'Guest' + next;
        const deviceAddress: string = data.deviceAddress;
        const deviceOS: string = data.deviceOS;
        const deviceVersion: string = data.deviceVersion;
        const deviceModel: string = data.deviceModel;
        //const ipAddress: string = data.ipAddress;

        return this.database.user.create({
            name: identifier,
            deviceAddress: deviceAddress,
            deviceOS: deviceOS,
            deviceVersion: deviceVersion,
            deviceModel: deviceModel,
            ipAddress: 'not set'
        }).then( (user) => {
            return this.getLookupTable(user.id).then( (locations) => {
                return {data: {user, locations}, message: new Message(SUCCESS_CREATED, "User created successfully")};
            });
        }).catch(() => {
            return {data: null, message: new Message(OD_NOT_CREATED, "User could not be registered")};
        });
    }

    public findUser(identifier: any): any
    {
        return this.database.user.findById(identifier).then( user => {
            return user;
        });
    }

    public autoLoginUser(identifier: any): any
    {
        return this.database.user.findById(identifier).then( user => {
            return this.getLookupTable(user.id).then( (locations) => {
                return {data: {user, locations}, message: new Message(SUCCESS_LOGGED_IN, "User logged in successfully")};
            });
        }).catch(() => {
            return {data: null, message: new Message(LOGIN_FAILED, "User not found!")}
        });
    }

    public loginUser(data: any): any
    {
        const user = data.user;
        const password = data.password;

        return this.database.user.findOne({where: {name: user, password: password}}).then( (user) =>
        {
            return this.getLookupTable(user.id).then( (locations) => {
                return {data: {user, locations}, message: new Message(SUCCESS_LOGGED_IN, "User logged in successfully")};
            });
        }).catch(() => {
            return {data: null, message: new Message(LOGIN_FAILED, "User not found!")}
        });;
    }
}