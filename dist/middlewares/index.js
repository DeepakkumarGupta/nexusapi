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
exports.isAuthenticated = exports.isOwner = void 0;
const users_1 = require("../models/users");
const isOwner = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const currentUserId = (_a = req.identity) === null || _a === void 0 ? void 0 : _a._id;
        if (!currentUserId) {
            console.log("Current user not found");
            return res.sendStatus(403);
        }
        const user = yield (0, users_1.getUserById)(id);
        if (!user || user._id.toString() !== currentUserId.toString()) {
            console.log("User does not match");
            return res.sendStatus(403);
        }
        next();
    }
    catch (error) {
        console.error(error);
        return res.sendStatus(400);
    }
});
exports.isOwner = isOwner;
const isAuthenticated = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sessionToken = req.cookies['DEEP-DEEP'];
        console.log('Session Token:', sessionToken);
        if (!sessionToken) {
            return res.sendStatus(401); // Unauthorized
        }
        const existingUser = yield (0, users_1.getUserBySessionToken)(sessionToken);
        console.log('Existing User:', existingUser);
        if (!existingUser) {
            return res.sendStatus(401); // Unauthorized
        }
        req.identity = existingUser;
        return next();
    }
    catch (error) {
        console.error('Error in isAuthenticated middleware:', error);
        res.sendStatus(500); // Internal Server Error
    }
});
exports.isAuthenticated = isAuthenticated;
