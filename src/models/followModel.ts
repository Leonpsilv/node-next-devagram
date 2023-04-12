import mongoose, {Schema} from "mongoose";

const followSchema = new Schema({
    userId: {type: String, required: true},
    userIdFollowed: {type: String, required: true},
})

export const FollowModel = (mongoose.models.followers ||
        mongoose.model('followers', followSchema))

    