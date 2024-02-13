import * as express from "express";

const router = express.Router();

router.post("/api/user", (req, res) => {
	res.send("hello")
});

export {
	router as createUserRouter
}