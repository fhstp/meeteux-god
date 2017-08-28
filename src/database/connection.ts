import * as Sequelize from 'sequelize';

export class Connection
{
    private static instance: Connection;
    private sequelize: any;
    private user: any;

    private constructor()
    {
        this.sequelize = new Sequelize('database', 'username', 'password');
        this.initDatabase();

        this.sequelize.sync();
    }

    public static getInstance(): Connection
    {
        if(Connection.instance === null || Connection.instance === undefined)
        {
            Connection.instance = new Connection();
        }

        return Connection.instance;
    }

    private initDatabase():void
    {
        this.user = this.sequelize.define('user', {
            username: Sequelize.STRING,
        })
    }
}
