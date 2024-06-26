import express from "express";

export const Codes = {
	ParameterError: 400,
	NotFoundError: 400,
	NotSavedError: 500,
	ExistingUserError: 400,
	DeletionError: 500,
	// SigningError: 400,
	Success: 200,
};

export class ParameterError extends Error {
	constructor(msg: string) {
		super(msg);
		this.name = "ParameterError";
	}
	public code() {
		return Codes.ParameterError;
	}
}

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
		this.name = "ExistingUserError"
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

// export class SigningError extends Error {
// 	constructor(msg: string) {
// 		super(msg);
// 		this.name = "SigningError"
// 	}
// 	public code() {
// 		return Codes.SigningError;
// 	}
// }

export function errorWrapper(func: { (req: express.Request, res: express.Response): Promise<express.Response> }) {
	return async function call(req: express.Request, res: express.Response) {
		try {
			// console.log(`running function ${func.name}`)
			return await func(req, res)
		} catch (err) {

			console.log("caught error", err.name, err.message)
			try {
				return res.sendStatus(err.code());
			} catch {
				return res.sendStatus(500)
			}
		}
	}
}