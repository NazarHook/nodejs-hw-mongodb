import { Router } from "express";
import ctrlWrapper from "../utils/ctrlWrapper.js";
import validateBody from "../utils/validateBody.js";
import { userSignupSchema, userSigninSchema, userEmailSchema, resetPasswordSchema } from "../validation/user-schemas.js";
import { signUpController, signInController, signoutController, refreshController,verifyController, sendResetEmailController, resetPasswordController } from "../controllers/auth-controllers.js";

const authRouter = Router();

authRouter.post("/register", validateBody(userSignupSchema), ctrlWrapper(signUpController));
authRouter.get("/verify", ctrlWrapper(verifyController));
authRouter.post("/login", validateBody(userSigninSchema), ctrlWrapper(signInController));
authRouter.post("/refresh", ctrlWrapper(refreshController));
authRouter.post("/logout", ctrlWrapper(signoutController));
authRouter.post("/send-reset-email", validateBody(userEmailSchema), ctrlWrapper(sendResetEmailController));
authRouter.post("/reset-pwd", validateBody(resetPasswordSchema), ctrlWrapper(resetPasswordController));

export default authRouter;
