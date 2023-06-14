import { db } from "../models/db.js";
import {weatherService} from "../services/weather-service.js";
export const browseController = {
    index: {
        handler: async function (request, h) {
            let users = await db.userStore.getAllUsers();
            let myCategories = await db.categoryStore.getUserCategories(request.auth.credentials._id);
            let placemarks = await db.placemarkStore.getAllPlacemarks();
            placemarks = placemarks.filter(placemark => placemark.category.user._id.toString() !== request.auth.credentials._id.toString());
            placemarks = await weatherService.getWeatherInfos(placemarks);
            placemarks.forEach(placemark => {
                let user = users.filter(user => user._id.toString() === placemark.category.user.toString());
                placemark.category.user = user[0];
            });
            return h.view("Browse", {title: "Placemark - Browse", placemarks: placemarks, myCategories: myCategories});
        },
    },
};