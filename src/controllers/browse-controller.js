import { db } from "../models/db.js";
export const browseController = {
    index: {
        handler: async function (request, h) {
            let myCategories = await db.categoryStore.getUserCategories(request.auth.credentials._id);
            let placemarks = await db.placemarkStore.getAllPlacemarks();
            placemarks = placemarks.filter(placemark => placemark.category.user._id.toString() !== request.auth.credentials._id.toString());
            return h.view("Browse", {title: "Placemark - Browse", placemarks: placemarks, myCategories: myCategories});
        },
    },
};