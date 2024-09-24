import express from 'express';
import { BlogModel } from '../models/blog';
import slugify from 'slugify'; // Install this package: npm install slugify

// Create/Publish Blog
export const createBlog = async (req: express.Request, res: express.Response) => {
    try {
        const { title, content, excerpt, image } = req.body;

        if (!title || !content || !excerpt) {
            return res.status(400).json({ message: 'Title, content, and excerpt are required.' });
        }

        const slug = slugify(title, { lower: true });
        const author = (req as any).identity.username; // Assuming identity is set by isAuthenticated middleware
        const authorImage = (req as any).identity.authorImage || ''; // Optional, can default to empty

        const blogPost = new BlogModel({
            title,
            slug,
            author,
            authorImage,
            content,
            excerpt,
            image,
        });

        await blogPost.save();

        return res.status(201).json(blogPost);
    } catch (error) {
        console.error('Error creating blog post:', error);
        return res.sendStatus(500); // Internal Server Error
    }
};

// Delete Blog
export const deleteBlog = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        const blogPost = await BlogModel.findByIdAndDelete(id);

        if (!blogPost) {
            return res.status(404).json({ message: 'Blog post not found.' });
        }

        return res.status(200).json({ message: 'Blog post deleted successfully.' });
    } catch (error) {
        console.error('Error deleting blog post:', error);
        return res.sendStatus(500); // Internal Server Error
    }
};

// Update Blog
export const updateBlog = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        const { title, content, excerpt, image } = req.body;

        const blogPost = await BlogModel.findById(id);

        if (!blogPost) {
            return res.status(404).json({ message: 'Blog post not found.' });
        }

        blogPost.title = title || blogPost.title;
        blogPost.slug = slugify(blogPost.title, { lower: true }); // Automatically update slug based on title
        blogPost.content = content || blogPost.content;
        blogPost.excerpt = excerpt || blogPost.excerpt;
        blogPost.image = image || blogPost.image;

        await blogPost.save();

        return res.status(200).json(blogPost);
    } catch (error) {
        console.error('Error updating blog post:', error);
        return res.sendStatus(500); // Internal Server Error
    }
};

// Get all blogs
export const getAllBlogs = async (req: express.Request, res: express.Response) => {
    try {
        const blogs = await BlogModel.find().sort({ date: -1 });
        return res.status(200).json(blogs);
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
};

// Get a blog by slug
export const getBlogBySlug = async (req: express.Request, res: express.Response) => {
    try {
        const { slug } = req.params;
        const blog = await BlogModel.findOne({ slug });

        if (!blog) {
            return res.sendStatus(404); // Blog not found
        }

        return res.status(200).json(blog);
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
};




// Get a blog by slug
export const bloglike = async (req: express.Request, res: express.Response) => {
    const { slug } = req.params;

    try {
        // Find the post by slug
        const post = await BlogModel.findOne({ slug });
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Increment the likes count
        post.likes += 1;
        await post.save();

        return res.status(200).json({ message: 'Post liked successfully', likes: post.likes });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};




// Get a blog by slug
export const blogShares = async (req: express.Request, res: express.Response) => {
    try {
        const blog = await BlogModel.findOneAndUpdate(
            { slug: req.params.slug },
            { $inc: { shares: 1 } }, // Increment the share count
            { new: true }
        );

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        res.status(200).json(blog);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
