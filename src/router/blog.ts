import express from 'express';
import { createBlog, updateBlog, deleteBlog, getAllBlogs, getBlogBySlug, bloglike, blogShares, getBlogsByAuthor, getBlogById } from '../controllers/blog';
import { isAuthenticated, isOwner } from '../middlewares';

const router = express.Router();

export default (router: express.Router) => {
    router.post('/blog/post', isAuthenticated, createBlog);
    router.put('/blog/edit/:id', isAuthenticated, updateBlog);
    router.delete('/blog/delete/:id', isAuthenticated, deleteBlog);
    router.get('/blogs/:id', getBlogById);
    // Route to get all blogs
    router.get('/blogs', getAllBlogs);
    // Route to get a blog by its slug
    router.get('/blog/:slug', getBlogBySlug);
    // Route to like the blog post by sslug
    router.put('/blog/:slug/like', bloglike);
    router.put('/blog/:slug/shares', blogShares)
    router.get("/blogsbyauthor/:username", getBlogsByAuthor)
};


