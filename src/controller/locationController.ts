
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

        return this.database.activity.create({
            userId: user,
            locationId: location,
            timestamp: Date.now()
        }).then( () => {
            return location;
        }).catch((err) => {
            //console.log(err);
            return "FAILED";
        });

    }

    public checkLocationStatus(locationId: number): any
    {
        let status: String = "OCCUPIED";
        return this.database.user.findById(locationId).then( (location) =>
        {
            //TODO: check status of location

            if(location.locationType != 3)
                status = "NOT ACTIVE EXHIBIT";

            if(location.currentSeat < location.maxSeat)
                status = "FREE";

            return status;
        }).catch((err) => {
            //console.log(err);
            return "FAILED";
        });
    }
}