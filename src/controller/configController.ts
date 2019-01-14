import { Connection } from '../database';
import {Message, SUCCESS_OK} from "../messages";
import * as statusTypes from '../config/statusTypes';

export class ConfigController
{
    private database: Connection;

    constructor()
    {
        this.database = Connection.getInstance();
    }

    public isWifiSSIDMatching(ssid: string): any
    {
        const correctSSID = this.database.currentSettings.wifiSSID;
        return { data: { check: correctSSID.localeCompare(ssid) === 0 }, message: new Message(SUCCESS_OK, 'SSID was checked!') };
    }

}