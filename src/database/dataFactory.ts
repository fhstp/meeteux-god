import {Connection} from "./connection";

export class DataFactory
{
    private static _instance: DataFactory;
    private _connection: Connection;

    public static getInstance(): DataFactory
    {
        if(DataFactory._instance === null || DataFactory._instance === undefined)
        {
            DataFactory._instance = new DataFactory();
        }

        return DataFactory._instance;
    }

    public async createData()
    {
        this.initSettings();
        await this.createLocationTypes();
        await this.createStatusTypes();
        await this.createContentTypes();
        await this.createRoomLocations();
        await this.createPassiveLocations();
        await this.createActiveExhibitLocation();
        await this.createActiveExhibitBehaviorLocation();
    }

    private initSettings(): void
    {
        this._connection.settings.create({
            guestNumber: 1,
            wifiSSID: 'MEETeUX'
        });
    }

    private async createLocationTypes()
    {
        return this._connection.sequelize.transaction(t1 =>
        {
            return Promise.all([
                this._connection.locationType.create({id: 1, description: 'room'}),
                this._connection.locationType.create({id: 2, description: 'activeExhibitOn'}),
                this._connection.locationType.create({id: 3, description: 'activeExhibitAt'}),
                this._connection.locationType.create({id: 4, description: 'passiveExhibit'}),
                this._connection.locationType.create({id: 5, description: 'door'}),
                this._connection.locationType.create({id: 6, description: 'activeExhibitBehaviorAt'}),
                this._connection.locationType.create({id: 7, description: 'activeExhibitBehaviorOn'})
            ]);
        });
    }

    private async createStatusTypes()
    {
        return this._connection.sequelize.transaction(t1 =>
        {
            return Promise.all([
                this._connection.status.create({id: 1, description: 'online'}),
                this._connection.status.create({id: 2, description: 'offline'}),
                this._connection.status.create({id: 3, description: 'free'}),
                this._connection.status.create({id: 4, description: 'occupied'})
            ]);
        });
    }

    private async createContentTypes()
    {
        return this._connection.sequelize.transaction(t1 =>
        {
            return this._connection.contentType.create({description: 'webContent'});
        });
    }

    private async createRoomLocations()
    {
        return this._connection.sequelize.transaction(t1 =>
        {
            return Promise.all([
                this._connection.location.create({id: 10, description: 'Büro', locationTypeId: 1, statusId: 1, ipAddress: '0.0.0.0', isStartPoint: true})
            ]);
        });
    }

    private async createActiveExhibitLocation()
    {
        return this._connection.sequelize.transaction(t1 =>
        {
            return Promise.all([
                this._connection.location.create({id: 100, parentId: 10, description: 'Table1 atExhibit', contentURL: 'tableat', ipAddress: '192.168.178.253',
                    locationTypeId: 3, contentTypeId: 1, statusId: 2, currentSeat: 0, maxSeat: 4, showInTimeline: true}),
                this._connection.location.create({id: 1000, description: 'Table1 onExhibit-1', parentId:100, contentURL: 'tableon', ipAddress: '0.0.0.0',
                    locationTypeId: 2, contentTypeId: 1, statusId: 2}),
                this._connection.location.create({id: 1001, description: 'Table1 onExhibit-2', parentId:100, contentURL: 'tableon', ipAddress: '0.0.0.0',
                    locationTypeId: 2, contentTypeId: 1, statusId: 2}),
                this._connection.location.create({id: 1002, description: 'Table1 onExhibit-3', parentId:100, contentURL: 'tableon', ipAddress: '0.0.0.0',
                    locationTypeId: 2, contentTypeId: 1, statusId: 2}),
                this._connection.location.create({id: 1003, description: 'Table1 onExhibit-4', parentId:100, contentURL: 'tableon', ipAddress: '0.0.0.0',
                    locationTypeId: 2, contentTypeId: 1, statusId: 2})
            ]);
        });
    }

    private async createActiveExhibitBehaviorLocation()
    {
        return this._connection.sequelize.transaction(t1 =>
        {
            return Promise.all([
                this._connection.location.create({id: 101, parentId: 10, description: 'Table2 atExhibitBehavior', contentURL: 'tableat', ipAddress: '192.168.178.48',
                    locationTypeId: 6, contentTypeId: 1, statusId: 2, currentSeat: 0, maxSeat: 15, showInTimeline: true}),
                this._connection.location.create({id: 1013, description: 'Table2 onExhibitBehavior', parentId: 101, contentURL: 'tableon', ipAddress: '0.0.0.0',
                    locationTypeId: 7, contentTypeId: 1, statusId: 2})
            ]);
        });
    }

    private async createPassiveLocations()
    {
        return this._connection.sequelize.transaction(t1 =>
        {
            return Promise.all([
                this._connection.location.create({id: 1004, parentId: 10, description: 'passive Exhibit1', contentURL: 'passive', ipAddress: '0.0.0.0',
                    locationTypeId: 4, contentTypeId: 1, statusId: 1, showInTimeline:true}),
                this._connection.location.create({id: 1005, parentId: 10, description: 'passive Exhibit2', contentURL: 'passive', ipAddress: '0.0.0.0',
                    locationTypeId: 4, contentTypeId: 1, statusId: 1, showInTimeline:true}),
                this._connection.location.create({id: 1006, parentId: 10, description: 'passive Exhibit3', contentURL: 'passive', ipAddress: '0.0.0.0',
                    locationTypeId: 4, contentTypeId: 1, statusId: 1, showInTimeline:true}),
                this._connection.location.create({id: 1007, parentId: 10, description: 'passive Exhibit4', contentURL: 'passive', ipAddress: '0.0.0.0',
                    locationTypeId: 4, contentTypeId: 1, statusId: 1, showInTimeline:true}),
                this._connection.location.create({id: 1008, parentId: 10, description: 'passive Exhibit5', contentURL: 'passive', ipAddress: '0.0.0.0',
                    locationTypeId: 4, contentTypeId: 1, statusId: 1, showInTimeline:true}),
                this._connection.location.create({id: 1009, parentId: 10, description: 'passive Exhibit6', contentURL: 'passive', ipAddress: '0.0.0.0',
                    locationTypeId: 4, contentTypeId: 1, statusId: 1, showInTimeline:true}),
                this._connection.location.create({id: 1010, parentId: 10, description: 'passive Exhibit7', contentURL: 'passive', ipAddress: '0.0.0.0',
                    locationTypeId: 4, contentTypeId: 1, statusId: 1, showInTimeline:true}),
                this._connection.location.create({id: 1011, parentId: 10, description: 'passive Exhibit8', contentURL: 'passive', ipAddress: '0.0.0.0',
                    locationTypeId: 4, contentTypeId: 1, statusId: 1, showInTimeline:true}),
                this._connection.location.create({id: 1012, parentId: 10, description: 'passive Exhibit9', contentURL: 'passive', ipAddress: '0.0.0.0',
                    locationTypeId: 4, contentTypeId: 1, statusId: 1, showInTimeline:true})
            ]);
        });
    }

    set connection(value: any)
    {
        this._connection = value;
    }
}