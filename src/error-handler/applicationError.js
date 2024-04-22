export default class ApplicationError extends Error{
    constructor(msg,code)
    {
        super(msg);
        this.code=code;
    }
}