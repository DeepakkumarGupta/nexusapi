import express from 'express'
import { deleteUserById, UserModel, getUserById, getUsers, updateUserById } from '../models/users'


export const getAllUsers = async (req: express.Request, res: express.Response) => {
    try {
        const users = await getUsers();

        return res.status(200).json(users);
    } catch (error) {
        console.log(error)
        return res.sendStatus(400)

    }
}


export const deleteUser = async (req: express.Request, res: express.Response) => {
    try {

        const { id } = req.params;
        const deletedUser = await deleteUserById(id)
        return res.status(200).json(deletedUser)

    } catch (error) {
        console.log(error)
        return res.sendStatus(400)



    }
}
export const updateUser = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };

        // Remove password field from the update data if it exists
        if (updateData.password) {
            delete updateData.password;
        }

        const user = await getUserById(id);
        if (!user) {
            return res.sendStatus(404); // User not found
        }

        // Update the user with the remaining fields in the request body
        const updatedUser = await updateUserById(id, updateData);

        return res.status(200).json(updatedUser).end();
    } catch (error) {
        console.error('Error in updating user:', error);
        return res.sendStatus(400); // Bad Request
    }
};


// Controller to get the logged-in user's information
export const getLoggedInUserInfo = async (req: express.Request, res: express.Response) => {
    try {
        const loggedInUserId = (req as any).identity.userId; // Assuming identity is set by isAuthenticated middleware

        if (!loggedInUserId) {
            return res.status(401).json({ message: 'Unauthorized: No user is logged in' }); // Not logged in
        }

        // Fetch user data using the userId
        const user = await getUserById(loggedInUserId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' }); // User not found
        }

        // Respond with the user's info (exclude sensitive data like password)
        return res.status(200).json({
            username: user.username,
            email: user.email,
            roles: user.role,
            // Add any other fields that you want to include
        });
    } catch (error) {
        console.error('Error fetching logged-in user info:', error);
        return res.sendStatus(500); // Internal server error
    }
};

export const dummyUserSayHi = async (req: express.Request, res: express.Response) => {
    try {
        res.send('Hi HI HELLIOO');
        res.status(200);
    } catch (error) {
        console.log(error)
        return res.sendStatus(400);

    }
}

export const getUserCount = async (req: express.Request, res: express.Response) => {
    try {
        // Get the count of users in the database
        const userCount = await UserModel.countDocuments();

        // Return the count as a response
        return res.status(200).json({ count: userCount });
    } catch (error) {
        console.error('Error fetching user count:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
