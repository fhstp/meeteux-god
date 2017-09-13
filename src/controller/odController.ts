
import { Connection } from '../database';

export class OdController
{
    private database: Connection;

    constructor()
    {
        this.database = Connection.getInstance();
    }

    public registerOD(identifier: string): any
    {
        return this.database.user.create({
            name: identifier,
            deviceAddress: 'not known',
            ipAddress: 'not known'
        }).then( (user) => {
            return this.database.location.findAll().then( (locations) => {
                return {user, locations};
            });
        }).catch((err) => {
            //console.log(err);
            return "FAILED";
        });
    }
}