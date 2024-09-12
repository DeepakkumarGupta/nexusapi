import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import router from './router'; // Import the router from index.ts

// Load environment variables from .env file
dotenv.config({ path: './.env' });

const app = express();
const port = process.env.PORT || 5000;
const mongoUri = process.env.MONGO_URI as string;

// Middleware
app.use(cors({
  credentials: true,
}));

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());

// Database connection
mongoose.Promise = Promise;
mongoose.connect(mongoUri).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.log('Error connecting to MongoDB:', error);
});

// Home route with a message
app.get('/', (req, res) => {
  res.send('API is working!');
});

// Use the router
app.use('/', router()); // Ensure the router is used with a base path

// Start the server
http.createServer(app).listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
