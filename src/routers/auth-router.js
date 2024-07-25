import { Router } from "express";

import ctrlWrapper from "../utils/ctrlWrapper.js";
import validateBody from "../utils/validateBody.js";

import {userSignupSchema, userSigninSchema} from "../validation/user-schemas.js";

import { signUpController, signInController, signoutController, refreshController } from "../controllers/auth-controllers.js";

const authRouter = Router();

authRouter.post("/register", validateBody(userSignupSchema), ctrlWrapper(signUpController));

authRouter.post("/login", validateBody(userSigninSchema), ctrlWrapper(signInController))

authRouter.post("/refresh", ctrlWrapper(refreshController));

authRouter.post("/logout", ctrlWrapper(signoutController))

export default authRouter;