import express from 'express';
import { deleteUser, dummyUserSayHi, getAllUsers, getLoggedInUserInfo, getUserCount, updateUser } from '../controllers/users';
import { createUserByAdmin } from '../controllers/admin';
import { isAuthenticated, isOwner, isAdmin } from '../middlewares';

export default (router: express.Router) => {
    router.get('/admin/users', isAuthenticated, isAdmin, getAllUsers)
    router.delete('/user/:id', isAuthenticated, isOwner, deleteUser)
    router.patch('/user/:id', isAuthenticated, isOwner, updateUser)
    router.patch('/admin/user-update/:id', isAuthenticated, isAdmin, updateUser)
    router.get("/sayhi", isAuthenticated, isAdmin, dummyUserSayHi)
    router.post('/admin/create-user', isAuthenticated, isAdmin, createUserByAdmin);
    router.delete('/admin/user-delete/:id', isAuthenticated, isAdmin, deleteUser)
    router.get('/user', isAuthenticated, getLoggedInUserInfo);
    router.get('/admin/usercount', isAuthenticated, isAdmin, getUserCount);


}

