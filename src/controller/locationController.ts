
import { Connection } from '../database';

export class LocationController
{
    private database: Connection;

    constructor()
    {
        this.database = Connection.getInstance();
    }

    public registerLocation(data: any): any
    {
        const user: number = data.user;
        const location: number = data.location;
        const type: number = data.type;

        let message: string = "SUCCESS";

        return this.database.activity.create({
            userId: user,
            locationId: location,
            activityTypeId: type,
            timestamp: Date.now()
        }).then( () => {
            return message;
        }).catch((err) => {
            message = "FAILED";
            //console.log(err);
            return message;
        });

    }
}