"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authentication_1 = require("../controllers/authentication");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
// Rate limiter for registration
const registerRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 registration attempts per 15 minutes
    message: 'Too many registration attempts, please try again later.',
});
// Rate limiter for login
const loginRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login attempts per 15 minutes
    message: 'Too many login attempts, please try again later.',
});
exports.default = (router) => {
    // Registration route with rate limiter
    router.post('/auth/register', registerRateLimiter, authentication_1.register);
    // Login route with rate limiter
    router.post('/auth/login', loginRateLimiter, authentication_1.login);
    router.post('/auth/logout', authentication_1.logout);
};
