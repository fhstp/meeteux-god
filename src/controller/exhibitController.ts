
import { Connection } from '../database';
import {LOCATION_NOT_FOUND, Message, SUCCESS_OK} from "../messages";
import * as statusTypes from '../config/statusTypes';

export class ExhibitController
{
    private database: Connection;

    constructor()
    {
        this.database = Connection.getInstance();
    }

    public loginExhibit(ipAddress: String): any
    {
        // console.log("Logging in exhibit " + ipAddress);
        return this.database.location.findOne({where: {ipAddress: ipAddress}}).then( (exhibit) =>
        {
            // console.log('Found exhibit: ' + exhibit.id);
            return this.database.location.update({statusId: statusTypes.FREE}, {where: {[this.database.sequelize.Op.or]: [{id: exhibit.id}, {parentId: exhibit.id}]}}).then(() => {
                // console.log('Updated exhibit: ' + exhibit.id);
                return { data: exhibit , message: new Message(SUCCESS_OK, "location data found")};
            });
        }).catch( () =>
        {
            return { data: null, message: new Message(LOCATION_NOT_FOUND, "Could not find location")};
        });
    }
}