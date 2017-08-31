
import { Connection } from '../database';

export class OdController
{
    private database: Connection;

    constructor()
    {
        this.database = Connection.getInstance();
    }

    public registerOD(identifier: string): void
    {
        this.database.user.create({
            name: identifier,
            deviceAddress: 'not known',
            ipAddress: 'not known'
        });
    }
}