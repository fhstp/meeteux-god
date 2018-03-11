export class Message
{
    private code: Number;
    private message: String;
    private date: Date;

    constructor (code, message)
    {
        this.code = code;
        this.message = message;
        this.date = new Date();
    }
}