import mongoose, {Schema} from "mongoose";

const postSchema = new Schema({
    userId: {type: String, required: true},
    description: {type: String, required: true},
    image: {type: String, required: true},
    date: {type: Date, required: true},
    likes: {type: Array, required: true, default: []},
    comments: {type: Array, required: true, default: []}
})

export const PostModel = (mongoose.models.posts ||
        mongoose.model('posts', postSchema))

    