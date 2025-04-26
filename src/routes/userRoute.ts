import express from "express";
import * as UserController from "../controllers/userController";

const router = express.Router();

router.post("/sign-up", UserController.signUp);
router.post("/log-in", UserController.logIn);
router.post("/log-out", UserController.logOut);
router.get("/get-current-user", UserController.getAuthenticatedUser);

export default router;
