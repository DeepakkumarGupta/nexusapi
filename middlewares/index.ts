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
        res.sendStatus(500); // Internal Server Error
    }
};