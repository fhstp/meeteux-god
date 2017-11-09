
import { Connection } from '../database';

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
            //console.log(exhibit);
            return exhibit;
        }).catch( (err) =>
        {
            return "FAILED";
        });
    }
}