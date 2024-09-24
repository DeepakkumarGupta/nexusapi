// import mongoose from 'mongoose';

// const BlogSchema = new mongoose.Schema({
//     title: { type: String, required: true },
//     slug: { type: String, required: true, unique: true },
//     author: { type: String, required: true },
//     authorImage: { type: String, default: null },
//     content: { type: String, required: true },
//     excerpt: { type: String, required: true },
//     image: { type: String, default: null },
//     likes: { type: Number, default: 0 },
//     date: { type: Date, default: Date.now },
// });

// // Pre-save hook to automatically generate slug based on the title
// BlogSchema.pre('save', function (next) {
//     if (this.isModified('title')) {
//         this.slug = this.title.toLowerCase().replace(/\s+/g, '-');
//     }
//     next();
// });

// export const BlogModel = mongoose.model('Blog', BlogSchema);


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
