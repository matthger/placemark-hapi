import Mongoose from "mongoose";

const { Schema } = Mongoose;

const categorySchema = new Schema({
    name: String,
    description: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    img: { type: String, default: '' }
});

export const Category = Mongoose.model("Category", categorySchema);
