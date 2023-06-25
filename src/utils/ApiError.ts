export class ApiError extends Error {
    status;
    errors;
    constructor(status: number, errors: any[] | null) {
        super();
        this.status = status;
        this.errors = errors;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

