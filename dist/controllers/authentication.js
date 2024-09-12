"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = exports.register = void 0;
const users_1 = require("../models/users");
const helpers_1 = require("../helpers");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, username } = req.body;
        if (!email || !password || !username) {
            return res.sendStatus(400); // Bad Request
        }
        const existingUser = yield (0, users_1.getUserByEmail)(email);
        if (existingUser) {
            return res.sendStatus(400); // Bad Request (User already exists)
        }
        const hashedPassword = yield (0, helpers_1.hashPassword)(password);
        const salt = (0, helpers_1.random)();
        const sessionToken = (0, helpers_1.generateSessionToken)(salt, username);
        const user = yield (0, users_1.createUser)({
            email,
            username,
            authentication: {
                password: hashedPassword,
                salt,
                sessionToken: (0, helpers_1.hashSessionToken)(sessionToken),
            },
        });
        res.cookie('DEEP-DEEP', sessionToken, {
            httpOnly: true,
            secure: true,
            maxAge: 24 * 60 * 60 * 1000, // Token expires after 1 day
        });
        return res.status(200).json(user).end();
    }
    catch (error) {
        console.error(error);
        return res.sendStatus(400); // Bad Request
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.sendStatus(400); // Bad Request
        }
        const user = yield (0, users_1.getUserByEmail)(email).select('+authentication.password');
        if (!user || !user.authentication) {
            return res.sendStatus(400); // Bad Request (User not found)
        }
        const isPasswordValid = yield (0, helpers_1.comparePassword)(password, user.authentication.password);
        if (!isPasswordValid) {
            return res.sendStatus(403); // Forbidden
        }
        const newSalt = (0, helpers_1.random)(); // Generate a new salt for each login
        const sessionToken = (0, helpers_1.generateSessionToken)(newSalt, user.username);
        const hashedSessionToken = (0, helpers_1.hashSessionToken)(sessionToken);
        user.authentication.sessionToken = hashedSessionToken;
        yield user.save();
        res.cookie('DEEP-DEEP', hashedSessionToken, {
            httpOnly: true,
            secure: true,
            maxAge: 24 * 60 * 60 * 1000, // Token expires after 1 day
        });
        return res.status(200).json(user).end();
    }
    catch (error) {
        console.error(error);
        return res.sendStatus(400); // Bad Request
    }
});
exports.login = login;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sessionToken = req.cookies['DEEP-DEEP'];
        if (!sessionToken) {
            return res.sendStatus(401); // Unauthorized
        }
        const user = yield (0, users_1.getUserBySessionToken)(sessionToken);
        if (!user) {
            return res.sendStatus(401); // Unauthorized
        }
        if (!user.authentication) {
            return res.sendStatus(401);
        }
        user.authentication.sessionToken = null; // Expire the session token
        yield user.save();
        res.clearCookie('DEEP-DEEP'); // Clear the cookie
        return res.sendStatus(200); // OK
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400); // Bad Request
    }
});
exports.logout = logout;
