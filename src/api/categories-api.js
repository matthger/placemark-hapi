import Boom from "@hapi/boom";
import { db } from "../models/db.js";
import {validationError} from "./logger.js";
import {CategoryArraySpec, CategorySpec, CategorySpecPlus, IdSpec} from "../models/joi-schema.js";
import {imageStore} from "../models/image-store.js";

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

    findUserCategories: {
        auth: {
            strategy: "jwt",
        },
        handler: async function (request, h) {
            try {
                const categories = await db.categoryStore.getUserCategories(request.params.id);
                return categories;
            } catch (err) {
                return Boom.serverUnavailable("Database Error");
            }
        },
        tags: ["api"],
        response: { schema: CategoryArraySpec, failAction: validationError },
        description: "Get all categories from a user",
        notes: "Returns all categories from a user",
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

    update: {
        auth: {
            strategy: "jwt",
        },
        handler: async function (request, h) {
            try {
                let category = request.payload;
                category._id = request.params.id;
                let categoryToUpdate = await db.categoryStore.getCategoryById(request.params.id);
                if (!categoryToUpdate) {
                    return Boom.notFound("No Category with this id");
                }
                return await db.categoryStore.editCategory(category);
            } catch (err) {
                return Boom.serverUnavailable("No Category with this id");
            }
        },
        tags: ["api"],
        description: "Edit a category",
        notes: "Returns the edited category",
        validate: { payload: CategorySpec, failAction: validationError },
        response: { schema: CategorySpecPlus, failAction: validationError },
    },

    uploadImage: {
        auth: {
            strategy: "jwt",
        },
        handler: async function (request, h) {
            try {
                const category = await db.categoryStore.getCategoryById(request.params.id);
                const file = request.payload.imagefile;
                if (Object.keys(file).length > 0) {
                    const url = await imageStore.uploadImage(request.payload.imagefile);
                    category.img = url;
                    let res = await db.categoryStore.editCategory(category);
                    return h.response(res).code(201);
                }
            } catch (err) {
                return Boom.serverUnavailable("No Category with this id");
            }
        },
        payload: {
            multipart: true,
            output: "data",
            maxBytes: 209715200,
            parse: true,
        },
        tags: ["api"],
        description: "Adds an image to a category",
        notes: "Returns the edited category",
    },

    deleteImage: {
        auth: {
            strategy: "jwt",
        },
        handler: async function (request, h) {
            try {
                const category = await db.categoryStore.getCategoryById(request.params.id);
                category.img = "";
                let res = await db.categoryStore.editCategory(category);
                return h.response(res).code(201);
            } catch (err) {
                return Boom.serverUnavailable("No Category with this id");
            }
        },
        tags: ["api"],
        description: "Deletes an image of a category",
        notes: "Returns the edited category",
    }
};
