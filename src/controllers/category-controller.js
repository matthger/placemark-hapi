import { db } from "../models/db.js";
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
};