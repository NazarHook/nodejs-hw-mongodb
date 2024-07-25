import createHttpError from "http-errors";
import { signup, findUser } from "../services/auth-services.js";
import { compareHash } from "../utils/hashValue.js";
import { createSession, findSession, deleteSession } from "../services/session-services.js";

const setupResponseSession = (res, {refreshToken, refreshTokenValidUntil, _id})=> {
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        expires: refreshTokenValidUntil,
    });

    res.cookie("sessionId", _id, {
        httpOnly: true,
        expires: refreshTokenValidUntil,
    });
}

export const signUpController = async(req, res) => {
const {email} = req.body

const user = await findUser({email})
console.log(user);
if (user) {
    throw createHttpError(409, 'Email in use')
}
const newUser = await signup(req.body)
    const data = {
        name: newUser.name,
        email: newUser.email
    }
    res.status(201).json({
        status: 201,
        message: 'Successfully registered a user!',
        data
    })
}
export const signInController = async(req, res) => {
    const {email, password} = req.body
const user = await findUser({email})
if (!user) {
    throw createHttpError(404, 'Email not found')
}
const passwordCompare = compareHash(password, user.password)
if (!password) {
    throw createHttpError('Password invalid')
}
const session = await createSession(user._id)
setupResponseSession(res, session)
res.json({
    status: 200,
    message: "User signin successfully",
    data: {
        accessToken: session.accessToken
    }
});
}

export const refreshController = async(req, res)=> {
    const {refreshToken, sessionId} = req.cookies;
    const currentSession = await findSession({_id: sessionId, refreshToken});

    if(!currentSession) {
        throw createHttpError(401, "Session not found");
    }

    const refreshTokenExpired = new Date() > new Date(currentSession.refreshTokenValidUntil);
    if(refreshTokenExpired) {
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
}

export const signoutController = async(req, res)=> {
    const {sessionId} = req.cookies;
    console.log(req.cookies);
    if(!sessionId) {
        throw createHttpError(401, "Session not found");
    }

    await deleteSession({_id: sessionId});

    res.clearCookie("sessionId");
    res.clearCookie("refreshToken");

    res.status(204).send();
}