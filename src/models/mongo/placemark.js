import Mongoose from "mongoose";

const { Schema } = Mongoose;

const placemarkSchema = new Schema({
    name: String,
    description: String,
    lat: String,
    lng: String,
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
    },
    img: { type: String, default: '' }
});

export const Placemark = Mongoose.model("Placemark", placemarkSchema);
