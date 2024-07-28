import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import fs from "node:fs/promises";
import handlebars from "handlebars";
import path from "node:path";
import { signup, findUser, updateUser } from "../services/auth-services.js";
import { createSession, findSession, deleteSession } from "../services/session-services.js";
import sendMail from "../utils/sendMail.js";

import { compareHash } from "../utils/hashValue.js";
import { TEMPLATES_DIR } from "../constants/index.js";

import dotenv from 'dotenv'
dotenv.config()
const app_domain = process.env.APP_DOMAIN;
const jwt_secret = process.env.JWT_SECRET;
const verifyEmailPath = path.join(TEMPLATES_DIR, "verify-email.html");

const setupResponseSession = (res, { refreshToken, refreshTokenValidUntil, _id }) => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    expires: refreshTokenValidUntil,
  });

  res.cookie("sessionId", _id, {
    httpOnly: true,
    expires: refreshTokenValidUntil,
  });
};

export const signUpController = async (req, res) => {
  const { email } = req.body;
  const user = await findUser({ email });
  if (user) {
    throw createHttpError(409, 'Email in use');
  }
  const newUser = await signup(req.body);
  const payload = {
    id: newUser._id,
    email,
};

const token = jwt.sign(payload, jwt_secret);

const emailTemplateSource = await fs.readFile(verifyEmailPath, "utf-8");
const emailTemplate = handlebars.compile(emailTemplateSource);
const html = emailTemplate({
    project_name: "My movies",
    app_domain,
    token,
});

const verifyEmail = {
    subject: "Verify email",
    to: email,
    html,
};

await sendMail(verifyEmail);

  const data = {
    name: newUser.name,
    email: newUser.email,
  };
  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data,
  });
};
export const verifyController = async(req, res)=> {
    const {token} = req.query;
    try {
        const {id, email} = jwt.verify(token, jwt_secret);
        const user = await findUser({_id: id, email});
        if(!user) {
            throw createHttpError(404, "User not found");
        }

        await updateUser({_id: id}, {verify: true});

        res.json({
            status: 200,
            message: "Email verify successfully",
        })
    }
    catch(error) {
        throw createHttpError(401, error.message);
    }
}
export const signInController = async (req, res) => {
  const { email, password } = req.body;
  const user = await findUser({ email });
  if (!user) {
    throw createHttpError(404, 'Email not found');
  }
  const passwordCompare = compareHash(password, user.password);
  if (!passwordCompare) {
    throw createHttpError(401, 'Password invalid');
  }
  const session = await createSession(user._id);
  setupResponseSession(res, session);
  res.json({
    status: 200,
    message: "User signin successfully",
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const refreshController = async (req, res) => {
  const { refreshToken, sessionId } = req.cookies;
  const currentSession = await findSession({ _id: sessionId, refreshToken });

  if (!currentSession) {
    throw createHttpError(401, "Session not found");
  }

  const refreshTokenExpired = new Date() > new Date(currentSession.refreshTokenValidUntil);
  if (refreshTokenExpired) {
    throw createHttpError(401, "Session expired");
  }

  const newSession = await createSession(currentSession.userId);

  setupResponseSession(res, newSession);

  res.json({
    status: 200,
    message: "User signin successfully",
    data: {
      accessToken: newSession.accessToken,
    }
  });
};

export const signoutController = async (req, res) => {
  const { sessionId } = req.cookies;
  if (!sessionId) {
    throw createHttpError(401, "Session not found");
  }

  await deleteSession({ _id: sessionId });

  res.clearCookie("sessionId");
  res.clearCookie("refreshToken");

  res.status(204).send();
};

export const sendResetEmailController = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await findUser({ email });

        if (!user) {
            throw createHttpError(404, "User not found!");
        }

        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "5m" });

        const resetPasswordLink = `${process.env.APP_DOMAIN}/reset-password?token=${token}`;

        await sendMail({
            to: email,
            subject: "Password Reset",
            html: `<p>To reset your password, click <a href="${resetPasswordLink}">here</a>.</p>`,
        });

        res.status(200).json({
            status: 200,
            message: `Reset password email has been successfully sent to ${email}.`,
            data: {},
        });
    } catch (error) {
        console.error(error); 
        res.status(500).json({
            status: 500,
            message: error.message,
        });
    }
};

export const resetPasswordController = async (req, res) => {
  const { token, password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await findUser({ email: decoded.email });

    if (!user) {
      throw createHttpError(404, "User not found!");
    }

    await updateUser(user._id, { password });
    await deleteSession({ userId: user._id });

    res.json({
      status: 200,
      message: "Password has been successfully reset.",
      data: {},
    });
  } catch (error) {
    throw createHttpError(401, "Token is expired or invalid.");
  }
};
