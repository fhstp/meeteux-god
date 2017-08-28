import * as Sequelize from 'sequelize';
require('dotenv').config();

export class Connection
{
    private static instance: Connection;
    private sequelize: any;
    private user: any;

    private constructor()
    {
        this.sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
            host: 'localhost',
            dialect: 'mysql',
        });
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
        });
    }
}
