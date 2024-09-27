import express from 'express';
import { get, merge } from 'lodash';
import { getUserBySessionToken, getUserById } from '../models/users';

export const isOwner = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const { id } = req.params;
        const currentUserId = (req as any).identity?._id;

        if (!currentUserId) {
            console.log("Current user not found");
            return res.sendStatus(403);
        }

        const user = await getUserById(id);

        if (!user || user._id.toString() !== currentUserId.toString()) {
            console.log("User does not match");
            return res.sendStatus(403);
        }

        next();
    } catch (error) {
        console.error(error);
        return res.sendStatus(400);
    }
};
export const isAuthenticated = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const sessionToken = req.cookies['DEEP-DEEP'];
        console.log('Session Token:', sessionToken);

        if (!sessionToken) {
            return res.sendStatus(401); // Unauthorized
        }

        const existingUser = await getUserBySessionToken(sessionToken);
        console.log('Existing User:', existingUser);

        if (!existingUser) {
            return res.sendStatus(401); // Unauthorized
        }

        (req as any).identity = existingUser;

        return next();
    } catch (error) {
        console.error('Error in isAuthenticated middleware:', error);
        console.log("sessionToken not found")
        res.sendStatus(500); // Internal Server Error
    }
};


export const isAdmin = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const sessionToken = req.cookies['DEEP-DEEP'];

        if (!sessionToken) {
            return res.status(401).json({ message: 'Unauthorized: No session token provided.' }); // Custom message for no token
        }

        const existingUser = await getUserBySessionToken(sessionToken);

        if (!existingUser) {
            return res.status(401).json({ message: 'Unauthorized: Invalid session token.' }); // Custom message for invalid token
        }

        if (!existingUser.isAdmin) {
            return res.status(403).json({ message: 'Forbidden: You need to be an admin to access this resource.' }); // Custom message for non-admin
        }

        (req as any).identity = existingUser;

        next();
    } catch (error) {
        console.error('Error in isAdmin middleware:', error);
        res.status(500).json({ message: 'Internal Server Error: Something went wrong.' }); // Custom message for server error
    }
};
