import express from 'express';
import { createUser, getUserByEmail } from '../models/users';
import { random, hashPassword, generateSessionToken, hashSessionToken } from '../helpers';

export const createUserByAdmin = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password, username, role, isAdmin } = req.body;

        // Check if the required fields are provided
        if (!email || !password || !username || !isAdmin) {
            return res.status(400).json({ message: 'Username, email, and password are required.' });
        }

        // Check if the user already exists
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists.' });
        }

        // Hash the password and generate session token
        const hashedPassword = await hashPassword(password);
        const salt = random();
        const sessionToken = generateSessionToken(salt, username);

        // Create the new user
        const newUser = await createUser({
            email,
            username,
            authentication: {
                password: hashedPassword,
                salt,
                sessionToken: hashSessionToken(sessionToken),
            },
            isAdmin,
            role: role || 'member', // Default role is 'member' if not provided
        });

        // Return the created user details
        return res.status(201).json(newUser);
    } catch (error) {
        console.error('Error in createUserByAdmin:', error);
        return res.status(500).json({ message: 'Internal Server Error: Could not create user.' });
    }
};
