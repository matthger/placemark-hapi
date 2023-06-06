import { db } from "../models/db.js";
export const userController = {
    index: {
        handler: async function (request, h) {
            let categories = await db.categoryStore.getUserCategories(request.auth.credentials._id);
            let placemarks = await db.placemarkStore.getPlacemarksByUserId(request.auth.credentials._id);
            return h.view("User", {title: "Placemark - Your profile", user: request.auth.credentials, categories: categories.length, placemarks: placemarks.length});
        },
    },
};