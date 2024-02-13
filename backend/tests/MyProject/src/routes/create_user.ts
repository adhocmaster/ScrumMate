import * as express from "express";

const router = express.Router();

router.post("/api/client", (req, res) => {
	res.send("hello")
});

export {
	router as createUserRouter
}