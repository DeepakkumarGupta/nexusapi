"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = __importDefault(require("http"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const router_1 = __importDefault(require("./router")); // Import the router from index.ts
// Load environment variables from .env file
dotenv_1.default.config({ path: './.env' });
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
const mongoUri = process.env.MONGO_URI;
// Middleware
app.use((0, cors_1.default)({
    credentials: true,
}));
app.use((0, compression_1.default)());
app.use((0, cookie_parser_1.default)());
app.use(body_parser_1.default.json());
app.use(express_1.default.json());
// Database connection
mongoose_1.default.Promise = Promise;
mongoose_1.default.connect(mongoUri).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.log('Error connecting to MongoDB:', error);
});
// Home route with a message
app.get('/', (req, res) => {
    res.send('API is working!');
});
// Use the router
app.use('/', (0, router_1.default)()); // Ensure the router is used with a base path
// Start the server
http_1.default.createServer(app).listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
