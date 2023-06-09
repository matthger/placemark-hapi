import { Category } from "./category.js";
import {placemarkMongoStore} from "./placemark-mongo-store.js";
import Joi from "joi";

export const categoryMongoStore = {
    async getAllCategories() {
        let categories = await Category.find().lean();
        categories = this.sortCategories(categories);
        return categories;
    },

    async getCategoryById(id) {
        if (id) {
            const category = await Category.findOne({ _id: id }).lean();
            if (category) {
                category.placemarks = await placemarkMongoStore.getPlacemarksByCategoryId(category._id);
            }
            return category;
        }
        return null;
    },

    async getUserCategories(id) {
        let categories = await Category.find({ user: id }).lean();
        for (let i = 0; i < categories.length; i++) {
            categories[i].placemarks = await placemarkMongoStore.getPlacemarksByCategoryId(categories[i]._id);
        }
        categories = this.sortCategories(categories);
        return categories;
    },

    sortCategories(categories) {
        categories.sort((a,b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
        return categories;
    },

    async addCategory(category) {
        const newCategory = new Category(category);
        await newCategory.save();
        let response = await this.getCategoryById(newCategory._id);
        delete response.placemarks;
        return response;
    },

    async editCategory(category) {
        await Category.updateOne({ _id: category._id }, { name: category.name, description: category.description, img: category.img });
        return this.getCategoryById(category._id);
    },

    async deleteCategoryById(id) {
        try {
            let placemarks = await placemarkMongoStore.getPlacemarksByCategoryId(id);
            for (let i = 0; i < placemarks.length; i++) {
                await placemarkMongoStore.deletePlacemarkById(placemarks[i]._id);
            }
            await Category.deleteOne({ _id: id });
        } catch (error) {
            console.log("bad id");
        }
    },

    async deleteCategoriesByUserId(id) {
        try {
            let categories = await this.getUserCategories(id);
            for (let i = 0; i < categories.length; i++) {
                await this.deleteCategoryById(categories[i]._id);
            }
        } catch (error) {
            console.log("bad id");
        }
    },

    async deleteAll() {
        await Category.deleteMany({});
    },
};