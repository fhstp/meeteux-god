
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
            this.database.location.findById(location).then( (currentLocation) =>
            {
                if (currentLocation.locationTypeId === 2)
                {
                    this.database.location.update({currentSeat:this.database.sequelize.literal('currentSeat +1')}, {where: {id: currentLocation.parentId}});
                    this.database.location.update({statusId: 4}, {where: {id: currentLocation.id}});
                }
            });
        }).then( () =>
        {
            return location;
        }).catch((err) => {
            //console.log(err);
            return "FAILED";
        });
    }

    public disconnectedFromExhibit(parentLocation: number, location: number): any
    {
        // console.log("Location: " + location);
        return this.database.location.update({statusId: 3}, {where: {id: location}}).then( () => {
            return this.database.location.update({currentSeat: this.database.sequelize.literal('currentSeat -1')}, {where: {id: parentLocation}});
        }).then( () => {
            return "SUCCESS";
        }).catch((err) => {
            //console.log(err);
            return "FAILED";
        });
    }

    public tableDisconnectFromExhibit(users: any): void
    {
        for(let u of users)
        {
            this.database.user.findById(u.id).then(user => {
                this.database.location.findById(user.currentLocation).then( location => {
                    this.disconnectedFromExhibit(location.parentId, location.id);
                    this.registerLocation({user: user.id, location: location.parentId});
                });
            });
        }
    }

    public checkLocationStatus(locationId: number): any
    {
        //console.log(locationId);
        let status: String = "NOT FOUND";
        return this.database.location.findById(locationId).then( (location) =>
        {
            //console.log(location);
            if(location.locationTypeId != 3 && location.locationTypeId != 2)
                status = "NOT ACTIVE EXHIBIT";

            else if(location.locationTypeId === 3 && location.statusId === 3 && location.currentSeat < location.maxSeat)
                status = "FREE";

            else if(location.locationTypeId === 2 && location.statusId === 3)
                status = "FREE";

            else
                status = "OCCUPIED";

            return status;
        }).catch((err) => {
            //console.log(err);
            return "FAILED";
        });
    }
}