export type ErrorResponse = {
    errorCode: string,
    errorMessage: string
}

export class InvalidDateError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'InvalidDateError';
    }
}

export class ApiKeyError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'InvalidApiKeyError';
    }
}

export class DefaultError extends Error {
    constructor(errorCode: string, errorMessage: string) {
        super(errorMessage);
        this.name = errorCode;
    }
}
