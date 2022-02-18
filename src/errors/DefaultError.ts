export type ErrorResponse = {
    errorCode: string,
    errorMessage: string
}

export class DefaultError extends Error {
    constructor(errorCode: string, errorMessage: string) {
        super(errorMessage);
        this.name = errorCode;
    }
}
