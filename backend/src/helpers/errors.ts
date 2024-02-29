import express from "express";

export const Codes = {
  NotFoundError: 404,
  NotSavedError: 500,
  ExistingUserError: 400,
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

export function errorWrapper(func: { (req: express.Request, res: express.Response): Promise<express.Response>; (arg0: express.Request, arg1: express.Response): any; }) {
	return function call(req: express.Request, res: express.Response) {
		try {
			return func(req, res)
		} catch (err) {
			if(err.code) {
        return res.sendStatus(err.code());
      }

			return res.sendStatus(500)
		}
	}
}