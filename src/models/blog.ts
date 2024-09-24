import mongoose from 'mongoose';

const BlogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    author: { type: String, required: true }, // Username of the logged-in user
    authorImage: { type: String, default: "" }, // Optional field
    content: { type: String, required: true },
    excerpt: { type: String, required: true },
    image: { type: String, default: "" },
    likes: { type: Number, default: 0 },
    date: { type: Date, default: Date.now },
    shares: {
        type: Number,
        default: 0,
    },
});

export const BlogModel = mongoose.model('Blog', BlogSchema);
