import { db } from "../models/db.js";
import {imageStore} from "../models/image-store.js";
export const categoryController = {
    index: {
        handler: async function (request, h) {
            let categories = await db.categoryStore.getUserCategories(request.auth.credentials._id);
            return h.view("Categories", {title: "Placemark - My categories", categories: categories});
        },
    },
    delete: {
        handler: async function (request, h) {
            await db.categoryStore.deleteCategoryById(request.params.id);
            return h.redirect("/categories");
        },
    },
    addCategory: {
        handler: async function (request, h) {
            let category = request.payload;
            category.user = request.auth.credentials._id;
            await db.categoryStore.addCategory(category);
            return h.redirect("/categories");
        },
    },
    editCategory: {
        handler: async function (request, h) {
            let category = request.payload;
            category._id = request.params.id;
            await db.categoryStore.editCategory(category);
            return h.redirect("/categories");
        },
    },
    uploadImage: {
        handler: async function (request, h) {
            try {
                const category = await db.categoryStore.getCategoryById(request.params.id);
                const file = request.payload.imagefile;
                if (Object.keys(file).length > 0) {
                    const url = await imageStore.uploadImage(request.payload.imagefile);
                    category.img = url;
                    await db.categoryStore.editCategory(category);
                }
                return h.redirect(`/categories`);
            } catch (err) {
                console.log(err);
                return h.redirect(`/categories`);
            }
        },
        payload: {
            multipart: true,
            output: "data",
            maxBytes: 209715200,
            parse: true,
        },
    },
    deleteImage: {
        handler: async function (request, h) {
            try {
                const category = await db.categoryStore.getCategoryById(request.params.id);
                category.img = "";
                await db.categoryStore.editCategory(category);
                return h.redirect(`/categories`);
            } catch (err) {
                console.log(err);
                return h.redirect(`/categories`);
            }
        },
    },
};