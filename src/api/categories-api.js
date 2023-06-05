import Boom from "@hapi/boom";
import { db } from "../models/db.js";
import {validationError} from "./logger.js";
import {CategoryArraySpec, CategorySpec, CategorySpecPlus, IdSpec} from "../models/joi-schema.js";

export const categoryApi = {
    find: {
        auth: {
            strategy: "jwt",
        },
        handler: async function (request, h) {
            try {
                const categories = await db.categoryStore.getAllCategories();
                return categories;
            } catch (err) {
                return Boom.serverUnavailable("Database Error");
            }
        },
        tags: ["api"],
        response: { schema: CategoryArraySpec, failAction: validationError },
        description: "Get all categories",
        notes: "Returns all categories",
    },

    findOne: {
        auth: {
            strategy: "jwt",
        },
        handler: async function (request, h) {
            try {
                const category = await db.categoryStore.getCategoryById(request.params.id);
                if (!category) {
                    return Boom.notFound("No Category with this id");
                }
                return category;
            } catch (err) {
                return Boom.serverUnavailable("No Category with this id");
            }
        },
        tags: ["api"],
        description: "Find a category",
        notes: "Returns a category",
        validate: { params: { id: IdSpec }, failAction: validationError },
        response: { schema: CategorySpecPlus, failAction: validationError },
    },

    create: {
        auth: {
            strategy: "jwt",
        },
        handler: async function (request, h) {
            try {
                const category = await db.categoryStore.addCategory(request.payload);
                if (category) {
                    return h.response(category).code(201);
                }
                return Boom.badImplementation("error creating category");
            } catch (err) {
                return Boom.serverUnavailable("Database Error");
            }
        },
        tags: ["api"],
        description: "Create a category",
        notes: "Returns the newly created category",
        validate: { payload: CategorySpec, failAction: validationError },
        response: { schema: CategorySpecPlus, failAction: validationError },
    },

    deleteOne: {
        auth: {
            strategy: "jwt",
        },
        handler: async function (request, h) {
            try {
                const category = await db.categoryStore.getCategoryById(request.params.id);
                if (!category) {
                    return Boom.notFound("No Category with this id");
                }
                await db.categoryStore.deleteCategoryById(category._id);
                return h.response().code(204);
            } catch (err) {
                return Boom.serverUnavailable("No Category with this id");
            }
        },
        tags: ["api"],
        description: "Delete specific category",
        notes: "specific category removed from Placemark",
        validate: { params: { id: IdSpec }, failAction: validationError },
    },

    deleteAll: {
        auth: {
            strategy: "jwt",
        },
        handler: async function (request, h) {
            try {
                await db.categoryStore.deleteAll();
                return h.response().code(204);
            } catch (err) {
                return Boom.serverUnavailable("Database Error");
            }
        },
        tags: ["api"],
        description: "Delete all categories",
    },
};
