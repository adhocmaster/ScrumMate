import express from "express";

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

export function errorWrapper(func: { (req: express.Request, res: express.Response): Promise<express.Response>; (arg0: express.Request, arg1: express.Response): any; }) {
	return function call(req: express.Request, res: express.Response) {
		try {
			return func(req, res)
		} catch (err) {
			if (err instanceof ExistingUserError) {
				return res.sendStatus(400)
			} else if (err instanceof NotFoundError) {
				return res.sendStatus(404)
			} else if (err instanceof NotSavedError) {
				return res.sendStatus(500)
			}

			return res.sendStatus(500)
		}
	}
}