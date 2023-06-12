import Boom from "@hapi/boom";
import { db } from "../models/db.js";
import {
    CategorySpec,
    CategorySpecPlus,
    IdSpec,
    PlacemarkArraySpec,
    PlacemarkSpec,
    PlacemarkSpecPlus
} from "../models/joi-schema.js";
import {validationError} from "./logger.js";
import {weatherService} from "../services/weather-service.js";
import {imageStore} from "../models/image-store.js";

export const placemarkApi = {
    find: {
        auth: {
            strategy: "jwt",
        },
        handler: async function (request, h) {
            try {
                let placemarks = await db.placemarkStore.getAllPlacemarks();
                placemarks = await weatherService.getWeatherInfos(placemarks);
                return placemarks;
            } catch (err) {
                return Boom.serverUnavailable("Database Error");
            }
        },
        tags: ["api"],
        response: { schema: PlacemarkArraySpec, failAction: validationError },
        description: "Get all placemarks",
        notes: "Returns all placemarks",
    },

    findOne: {
        auth: {
            strategy: "jwt",
        },
        async handler(request) {
            try {
                const placemark = await db.placemarkStore.getPlacemarkById(request.params.id);
                if (!placemark) {
                    return Boom.notFound("No placemark with this id");
                }
                return placemark;
            } catch (err) {
                return Boom.serverUnavailable("No placemark with this id");
            }
        },
        tags: ["api"],
        description: "Find a placemark",
        notes: "Returns a placemark",
        validate: { params: { id: IdSpec }, failAction: validationError },
        response: { schema: PlacemarkSpecPlus, failAction: validationError },
    },

    create: {
        auth: {
            strategy: "jwt",
        },
        handler: async function (request, h) {
            try {
                const placemark = await db.placemarkStore.addPlacemark(request.payload);
                if (placemark) {
                    return h.response(placemark).code(201);
                }
                return Boom.badImplementation("error creating placemark");
            } catch (err) {
                return Boom.serverUnavailable("Database Error");
            }
        },
        tags: ["api"],
        description: "Create a placemark",
        notes: "Returns the newly created placemark",
        validate: { payload: PlacemarkSpec, failAction: validationError },
        response: { schema: PlacemarkSpecPlus, failAction: validationError },
    },

    deleteAll: {
        auth: {
            strategy: "jwt",
        },
        handler: async function (request, h) {
            try {
                await db.placemarkStore.deleteAll();
                return h.response().code(204);
            } catch (err) {
                return Boom.serverUnavailable("Database Error");
            }
        },
        tags: ["api"],
        description: "Delete all placemarks",
    },

    deleteOne: {
        auth: {
            strategy: "jwt",
        },
        handler: async function (request, h) {
            try {
                const placemark = await db.placemarkStore.getPlacemarkById(request.params.id);
                if (!placemark) {
                    return Boom.notFound("No Placemark with this id");
                }
                await db.placemarkStore.deletePlacemarkById(placemark._id);
                return h.response().code(204);
            } catch (err) {
                return Boom.serverUnavailable("No Placemark with this id");
            }
        },
        tags: ["api"],
        description: "Delete a placemark",
        validate: { params: { id: IdSpec }, failAction: validationError },
    },

    update: {
        auth: {
            strategy: "jwt",
        },
        handler: async function (request, h) {
            try {
                let placemark = request.payload;
                placemark._id = request.params.id;
                let placemarkToUpdate = await db.placemarkStore.getPlacemarkById(request.params.id);
                if (!placemarkToUpdate) {
                    return Boom.notFound("No Placemark with this id");
                }
                return await db.placemarkStore.editPlacemark(placemark);
            } catch (err) {
                return Boom.serverUnavailable("No Placemark with this id");
            }
        },
        tags: ["api"],
        description: "Edit a placemark",
        notes: "Returns the edited placemark",
        validate: { payload: PlacemarkSpec, failAction: validationError },
        response: { schema: PlacemarkSpecPlus, failAction: validationError },
    },

    uploadImage: {
        auth: {
            strategy: "jwt",
        },
        handler: async function (request, h) {
            try {
                const placemark = await db.placemarkStore.getPlacemarkById(request.params.id);
                const file = request.payload.imagefile;
                if (Object.keys(file).length > 0) {
                    const url = await imageStore.uploadImage(request.payload.imagefile);
                    placemark.img = url;
                    let res = await db.placemarkStore.editPlacemark(placemark);
                    return h.response(res).code(201);
                }
            } catch (err) {
                return Boom.serverUnavailable("No Placemark with this id");
            }
        },
        payload: {
            multipart: true,
            output: "data",
            maxBytes: 209715200,
            parse: true,
        },
        tags: ["api"],
        description: "Adds an image to a placemark",
        notes: "Returns the edited placemark",
    },

    deleteImage: {
        auth: {
            strategy: "jwt",
        },
        handler: async function (request, h) {
            try {
                const placemark = await db.placemarkStore.getPlacemarkById(request.params.id);
                placemark.img = "";
                let res = await db.placemarkStore.editPlacemark(placemark);
                return h.response(res).code(201);
            } catch (err) {
                return Boom.serverUnavailable("No Placemark with this id");
            }
        },
        tags: ["api"],
        description: "Deletes an image of a placemark",
        notes: "Returns the edited placemark",
    }
};
