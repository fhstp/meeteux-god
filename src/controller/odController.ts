
import { Connection } from '../database';
import {Message, SUCCESS_CREATED} from "../messages";
import {OD_NOT_CREATED} from "../messages/odTypes";

export class OdController
{
    private database: Connection;

    constructor()
    {
        this.database = Connection.getInstance();
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
            return this.database.location.findAll().then( (locations) => {
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
            return this.database.location.findAll().then( (locations) => {
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
}