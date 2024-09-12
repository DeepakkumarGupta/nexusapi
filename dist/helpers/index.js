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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSessionToken = exports.comparePassword = exports.hashPassword = exports.hashSessionToken = exports.random = void 0;
const crypto_1 = __importDefault(require("crypto"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const secret = 'DEEP-DEEP';
const saltRounds = 10; // Number of salt rounds for bcrypt
// Generates a random salt for session tokens
const random = () => crypto_1.default.randomBytes(32).toString('hex');
exports.random = random;
// Hashes the session token with a secret
const hashSessionToken = (sessionToken) => {
    return crypto_1.default.createHash('sha256').update(sessionToken).digest('hex');
};
exports.hashSessionToken = hashSessionToken;
// Password hashing using bcrypt
const hashPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    const salt = yield bcrypt_1.default.genSalt(saltRounds);
    return bcrypt_1.default.hash(password, salt);
});
exports.hashPassword = hashPassword;
// Password comparison using bcrypt
const comparePassword = (password, hashedPassword) => __awaiter(void 0, void 0, void 0, function* () {
    return bcrypt_1.default.compare(password, hashedPassword);
});
exports.comparePassword = comparePassword;
// Generates an HMAC hash for session token
const generateSessionToken = (salt, userId) => {
    return crypto_1.default.createHmac('sha256', salt + userId).update(secret).digest('hex');
};
exports.generateSessionToken = generateSessionToken;
