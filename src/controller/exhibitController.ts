
import { Connection } from '../database';
import {LOCATION_NOT_FOUND, Message, SUCCESS_OK} from "../messages";

export class ExhibitController
{
    private database: Connection;

    constructor()
    {
        this.database = Connection.getInstance();
    }

    public loginExhibit(ipAddress: String): any
    {
        return this.database.location.findOne({where: {ipAddress: ipAddress}}).then( (exhibit) =>
        {
            return { data: exhibit , message: new Message(SUCCESS_OK, "location data found")};
        }).catch( () =>
        {
            return { data: null, message: new Message(LOCATION_NOT_FOUND, "Could not find location")};
        });
    }
}