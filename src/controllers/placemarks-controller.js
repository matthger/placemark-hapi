import { db } from "../models/db.js";
import {imageStore} from "../models/image-store.js";
export const placemarksController = {
    index: {
        handler: async function (request, h) {
            let categories = await db.categoryStore.getUserCategories(request.auth.credentials._id);
            let placemarks = await db.placemarkStore.getPlacemarksByUserId(request.auth.credentials._id);
            return h.view("Placemarks", {title: "Placemark - My placemarks", categories: categories, placemarks: placemarks});
        },
    },
    delete: {
        handler: async function (request, h) {
            await db.placemarkStore.deletePlacemarkById(request.params.id);
            return h.redirect("/placemarks");
        },
    },
    addPlacemark: {
        handler: async function (request, h) {
            let placemark = request.payload;
            await db.placemarkStore.addPlacemark(placemark);
            return h.redirect("/placemarks");
        },
    },
    editPlacemark: {
        handler: async function (request, h) {
            let placemark = request.payload;
            placemark._id = request.params.id;
            await db.placemarkStore.editPlacemark(placemark);
            return h.redirect("/placemarks");
        },
    },
    filter: {
        handler: async function (request, h) {
            let categories = await db.categoryStore.getUserCategories(request.auth.credentials._id);
            let placemarks = await db.placemarkStore.getPlacemarksByCategoryId(request.params.id);
            let activeCategory = await db.categoryStore.getCategoryById(request.params.id);
            return h.view("Placemarks", {title: "Placemark - My placemarks", categories: categories, placemarks: placemarks, activeCategory: activeCategory});
        },
    },
    uploadImage: {
        handler: async function (request, h) {
            try {
                const placemark = await db.placemarkStore.getPlacemarkById(request.params.id);
                const file = request.payload.imagefile;
                if (Object.keys(file).length > 0) {
                    const url = await imageStore.uploadImage(request.payload.imagefile);
                    placemark.img = url;
                    await db.placemarkStore.editPlacemark(placemark);
                }
                return h.redirect(`/placemarks`);
            } catch (err) {
                console.log(err);
                return h.redirect(`/placemarks`);
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
                const placemark = await db.placemarkStore.getPlacemarkById(request.params.id);
                placemark.img = "";
                await db.placemarkStore.editPlacemark(placemark);
                return h.redirect(`/placemarks`);
            } catch (err) {
                console.log(err);
                return h.redirect(`/placemarks`);
            }
        },
    },
};