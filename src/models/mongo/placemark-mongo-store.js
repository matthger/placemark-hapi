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
        const placemarks = await Placemark.find({ category: id }).populate("category").lean();
        return placemarks;
    },

    async getPlacemarksByUserId(id) {
        const userCategories = await db.categoryStore.getUserCategories(id);
        let placemarks = [];
        for (let i = 0; i < userCategories.length; i++) {
            let categoryPlacemarks = await this.getPlacemarksByCategoryId(userCategories[i]._id);
            if (categoryPlacemarks.length > 0) {
                for (let j = 0; j < categoryPlacemarks.length; j++) {
                    placemarks.push(categoryPlacemarks[j]);
                }
            }
        }
        placemarks.sort((a,b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
        return placemarks;
    },

    async addPlacemark(placemark) {
        const newPlacemark = new Placemark(placemark);
        const placemarkObj = await newPlacemark.save();
        return this.getPlacemarkById(placemarkObj._id);
    },

    async editPlacemark (placemark) {
        await Placemark.updateOne({ _id: placemark._id }, { name: placemark.name, description: placemark.description, lat: placemark.lat, lng: placemark.lng, category: placemark.category });
        return this.getPlacemarkById(placemark._id);
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
