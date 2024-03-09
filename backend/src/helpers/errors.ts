import express from "express";

export const Codes = {
  NotFoundError: 404,
  NotSavedError: 500,
  ExistingUserError: 400,
  DeletionError: 500,
  Success: 200,
};

export class NotFoundError extends Error {
    constructor(msg: string) {
        super(msg);
		    this.name = "NotFoundError";
    }
    public code() {
      return Codes.NotFoundError;
    }
}

export class NotSavedError extends Error {
    constructor(msg: string) {
        super(msg);
		this.name = "NotSavedError"
    }
    public code() {
      return Codes.NotSavedError;
    }
}

export class ExistingUserError extends Error {
    constructor(msg: string) {
        super(msg);
		this.name = "NotExistingError"
    }
    public code() {
      return Codes.ExistingUserError;
    }
}

export class DeletionError extends Error {
    constructor(msg: string) {
        super(msg);
		this.name = "DeletionError"
    }
    public code() {
      return Codes.DeletionError;
    }
}

export function errorWrapper(func: { (req: express.Request, res: express.Response): Promise<express.Response>; (arg0: express.Request, arg1: express.Response): any; }) {
	return async function call(req: express.Request, res: express.Response) {
		try {
			// console.log(`running function ${func.name}`)
			return await func(req, res)
		} catch (err) {
			// console.log("caught error")
			try {
				return res.sendStatus(err.code());
			} catch {
				return res.sendStatus(500)
			}
		}
	}
}