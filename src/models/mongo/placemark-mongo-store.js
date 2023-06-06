import { Placemark } from "./placemark.js";
import {db} from "../db.js";

export const placemarkMongoStore = {
    async getAllPlacemarks() {
        const placemarks = await Placemark.find().lean();
        return placemarks;
    },

    async getPlacemarkById(id) {
        if (id) {
            const placemark = await Placemark.findOne({ _id: id }).lean();
            return placemark;
        }
        return null;
    },

    async getPlacemarksByCategoryId(id) {
        const placemarks = await Placemark.find({ categoryid: id }).lean();
        return placemarks;
    },

    async getPlacemarksByUserId(id) {
        const userCategories = await db.categoryStore.getUserCategories(id);
        let placemarks = [];
        for (let i = 0; i < userCategories.length; i++) {
            let categoryPlacemarks = await this.getPlacemarksByCategoryId(userCategories[i]._id);
            if (categoryPlacemarks.length > 0) {
                placemarks.push(categoryPlacemarks);
            }
        }
        return placemarks;
    },

    async addPlacemark(categoryId, placemark) {
        placemark.categoryid = categoryId;
        const newPlacemark = new Placemark(placemark);
        const placemarkObj = await newPlacemark.save();
        return this.getPlacemarkById(placemarkObj._id);
    },

    async deletePlacemarkById(id) {
        try {
            await Placemark.deleteOne({ _id: id });
        } catch (error) {
            console.log("bad id");
        }
    },

    async deleteAll() {
        await Placemark.deleteMany({});
    },
};
