import express from 'express'
import { deleteUserById, getUserById, getUsers, updateUserById } from '../models/users'


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


export const dummyUserSayHi = async (req: express.Request, res: express.Response) => {
    try {
        res.send('Hi HI HELLIOO');
        res.status(200);
    } catch (error) {
        console.log(error)
        return res.sendStatus(400);

    }
}

