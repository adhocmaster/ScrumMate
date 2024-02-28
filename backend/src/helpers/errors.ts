export class NotFoundError extends Error {
    constructor(msg: string) {
        super(msg);
		this.name = "NotFoundError"
    }
}

export class NotSavedError extends Error {
    constructor(msg: string) {
        super(msg);
		this.name = "NotFoundError"
    }
}

export class ExistingUserError extends Error {
    constructor(msg: string) {
        super(msg);
		this.name = "NotFoundError"
    }
}