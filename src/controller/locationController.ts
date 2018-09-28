
import { Connection } from '../database';
import {
    Message,
    LOCATION_NOT_FOUND,
    SUCCESS_OK,
    LOCATION_NOT_UPDATED,
    LOCATION_NOT_CREATED,
    SUCCESS_CREATED
} from '../messages';
import * as statusTypes from '../config/statusTypes';
import * as locationTypes from '../config/locationTypes';

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
        const dismissed: boolean = data.dismissed;

        return this.database.activity.create({
            userId: user,
            locationId: location,
            timestamp: Date.now(),
            dismissed
        }).then(() => {
            this.database.user.update({currentLocation:location}, {where: {id: user}});
            if(!dismissed) {
                this.database.location.findById(location).then((currentLocation) => {
                    this.database.location.update({currentSeat: this.database.sequelize.literal('currentSeat +1')}, {where: {id: currentLocation.parentId}}).then(() => {
                        if (currentLocation.locationTypeId === locationTypes.ACTIVE_EXHIBIT_ON) {
                            this.database.location.update({statusId: statusTypes.OCCUPIED}, {where: {id: currentLocation.id}});
                        }
                        this.updateActiveLocationStatus(currentLocation.parentId);
                    });
                });
            }
        }).then( () =>
        {
            return {data: { location, dismissed }, message: new Message(SUCCESS_OK, 'Location Registered successfully')};
        }).catch(() => {
            return {data: null, message: new Message(LOCATION_NOT_UPDATED, 'Could not register location')};
        });
    }

    public registerLocationLike(data: any): any
    {
        const user: number = data.user;
        const location: number = data.location;
        const like: boolean = data.like;

        console.log('registerLocationLike');

        return this.database.activity.update({liked:like}, {where: {userId: user, locationId: location}}).then( () =>
        {
            return this.getLookupTable(user).then( (locations) =>
            {
                return {data: {locations}, message: new Message(SUCCESS_OK, "Activity updated successfully")};
            });
        }).catch(() => {
            return {data: null, message: new Message(LOCATION_NOT_UPDATED, 'Could not update activity')};
        });
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

    public disconnectedFromExhibit(data: any): any
    {
        const parentLocation: number = data.parentLocation;
        const location: number = data.location;

        return this.database.location.update({statusId: statusTypes.FREE}, {where: {id: location}}).then( () => {
            return this.database.location.update({currentSeat: this.database.sequelize.literal('currentSeat -1')}, {where: {id: parentLocation}}).then(() => {
                this.updateActiveLocationStatus(parentLocation);
            });
        }).then( () => {
            return {data: {location, parent: parentLocation}, message: new Message(SUCCESS_OK, 'Disconnected successfully from Exhibit')};
        }).catch(() => {
            return {data: null, message: new Message(LOCATION_NOT_UPDATED, "Could not update location status")};
        });
    }

    public tableDisconnectFromExhibit(users: any): void
    {
        for(let u of users)
        {
            this.database.user.findById(u.id).then(user => {
                this.database.location.findById(user.currentLocation).then( location => {
                    this.disconnectedFromExhibit({parentLocation: location.parentId, location: location.id});
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
            // console.log("CheckLocationStatus:\n-typeId: " + location.locationTypeId + "\n-statusId: " + location.statusId);
            if(location.locationTypeId != locationTypes.ACTIVE_EXHIBIT_ON && location.locationTypeId != locationTypes.ACTIVE_EXHIBIT_AT && location.locationTypeId != locationTypes.ACTIVE_EXHIBIT_BEHAVIOR_ON && location.locationTypeId != locationTypes.ACTIVE_EXHIBIT_BEHAVIOR_AT)
                status = "NOT ACTIVE EXHIBIT";

            else if(location.locationTypeId === locationTypes.ACTIVE_EXHIBIT_AT && location.statusId === statusTypes.FREE && location.currentSeat < location.maxSeat)
                status = "FREE";

            else if(location.locationTypeId === locationTypes.ACTIVE_EXHIBIT_BEHAVIOR_AT && location.statusId === statusTypes.FREE && location.currentSeat < location.maxSeat)
                status = "FREE";

            else if(location.locationTypeId === locationTypes.ACTIVE_EXHIBIT_ON && location.statusId === statusTypes.FREE)
                status = "FREE";

            else if(location.statusId === statusTypes.OFFLINE)
                status = "OFFLINE";

            else
                status = "OCCUPIED";

            return {data: {status, location: locationId} , message: new Message(SUCCESS_OK, "Status queried successfully")};
        }).catch(() => {
            return {data: null, message: new Message(LOCATION_NOT_FOUND, "Could not find location")};
        });
    }

    public updateActiveLocationStatus(locationId: number): any
    {
        return this.database.location.findById(locationId).then( (location) =>
        {
            if(location.locationTypeId === locationTypes.ACTIVE_EXHIBIT_AT || location.locationTypeId === locationTypes.ACTIVE_EXHIBIT_BEHAVIOR_AT)
            {
                if(location.currentSeat < location.maxSeat && location.statusId === statusTypes.OCCUPIED)
                {
                    location.statusId = statusTypes.FREE;
                }

                else if(location.currentSeat >= location.maxSeat && location.statusId === statusTypes.FREE)
                {
                    location.statusId = statusTypes.OCCUPIED;
                }

                location.save();
            }
        });
    }
}