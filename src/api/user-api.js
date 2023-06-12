import Boom from "@hapi/boom";
import { db } from "../models/db.js";
import {createToken} from "./jwt-utils.js";
import {validationError} from "./logger.js";
import {
    IdSpec,
    JwtAuth,
    PasswordSpec,
    UserArray,
    UserCredentialsSpec,
    UserSpec,
    UserSpecPlus
} from "../models/joi-schema.js";

export const userApi = {
    find: {
        auth: {
            strategy: "jwt",
        },
        handler: async function (request, h) {
            try {
                const users = await db.userStore.getAllUsers();
                return users;
            } catch (err) {
                return Boom.serverUnavailable("Database Error");
            }
        },
        tags: ["api"],
        description: "Get all users",
        notes: "Returns details of all users",
        response: { schema: UserArray, failAction: validationError },
    },

    findOne: {
        auth: {
            strategy: "jwt",
        },
        handler: async function (request, h) {
            try {
                const user = await db.userStore.getUserById(request.params.id);
                if (!user) {
                    return Boom.notFound("No User with this id");
                }
                return user;
            } catch (err) {
                return Boom.serverUnavailable("No User with this id");
            }
        },
        tags: ["api"],
        description: "Get a specific user",
        notes: "Returns user details",
        validate: { params: { id: IdSpec }, failAction: validationError },
        response: { schema: UserSpecPlus, failAction: validationError },
    },

    create: {
        auth: false,
        handler: async function (request, h) {
            try {
                const user = await db.userStore.addUser(request.payload);
                if (user) {
                    return h.response(user).code(201);
                }
                return Boom.badImplementation("error creating user");
            } catch (err) {
                return Boom.serverUnavailable("Database Error");
            }
        },
        tags: ["api"],
        description: "Create a user",
        notes: "Returns the newly created user",
        validate: { payload: UserSpec, failAction: validationError },
        response: { schema: UserSpecPlus, failAction: validationError },
    },

    changePassword: {
        auth: {
            strategy: "jwt",
        },
        handler: async function (request, h) {
            try {
                const userEdit = request.payload;
                const user = await db.userStore.getUserById(request.auth.credentials._id);
                let errorMessage = "";
                switch (user.password) {
                    case userEdit.newPassword:
                        errorMessage = "New password cannot be the same as the old one!";
                        return h.response("New password cannot be the same as the old one!").code(201);
                    case userEdit.currentPassword:
                        user.password = userEdit.newPassword;
                        let editedUser = await db.userStore.editUser(user);
                        return h.response(editedUser).code(201);
                    default:
                        return h.response("Wrong current password!").code(201);
                }
            } catch (err) {
                return Boom.serverUnavailable("Database Error");
            }
        },
        tags: ["api"],
        description: "Change user password",
        notes: "Returns the edited user",
        validate: { payload: PasswordSpec, failAction: validationError },
    },

    deleteAll: {
        auth: {
            strategy: "jwt",
        },
        handler: async function (request, h) {
            try {
                await db.userStore.deleteAll();
                return h.response().code(204);
            } catch (err) {
                return Boom.serverUnavailable("Database Error");
            }
        },
        tags: ["api"],
        description: "Delete all users",
        notes: "All users removed from Placemark",
    },

    delete: {
        auth: {
            strategy: "jwt",
        },
        handler: async function (request, h) {
            try {
                await db.userStore.deleteUserById(request.params.id);
                return h.response().code(204);
            } catch (err) {
                return Boom.serverUnavailable("Database Error");
            }
        }
    },

    authenticate: {
        auth: false,
        handler: async function (request, h) {
            try {
                const user = await db.userStore.getUserByEmail(request.payload.email);
                if (!user) {
                    return Boom.unauthorized("User not found");
                }
                if (user.password !== request.payload.password) {
                    return Boom.unauthorized("Invalid password");
                }
                const token = createToken(user);
                return h.response({ success: true, token: token, _id: user._id, firstName: user.firstName, lastName: user.lastName }).code(201);
            } catch (err) {
                return Boom.serverUnavailable("Database Error");
            }
        },
        tags: ["api"],
        description: "Authenticate a user",
        notes: "If user has valid email/password, create and return a JWT token",
        validate: { payload: UserCredentialsSpec, failAction: validationError },
        response: { schema: JwtAuth, failAction: validationError },
    },

    adminLogin: {
        auth: false,
        handler: async function (request, h) {
            try {
                const user = await db.userStore.getUserByEmail(request.payload.email);
                if (!user) {
                    return Boom.unauthorized("User not found!");
                }
                if (user.password !== request.payload.password) {
                    return Boom.unauthorized("Invalid password!");
                }
                if (!user.isAdmin) {
                    return Boom.unauthorized("User is not an admin");
                }
                const token = createToken(user);
                return h.response({ success: true, token: token, _id: user._id, firstName: user.firstName, lastName: user.lastName }).code(201);
            } catch (err) {
                return Boom.serverUnavailable("Database Error");
            }
        },
        tags: ["api"],
        description: "Authenticate an admin user",
        notes: "If user has valid email/password and is an admin, create and return a JWT token",
        validate: { payload: UserCredentialsSpec, failAction: validationError },
        response: { schema: JwtAuth, failAction: validationError },
    },

    makeAdmin: {
        auth: {
            strategy: "jwt",
        },
        handler: async function (request, h) {
            try {
                const user = await db.userStore.getUserById(request.params.id);
                if (!user) {
                    return Boom.notFound("No User with this id");
                }
                user.isAdmin = true;
                const editedUser = await db.userStore.editUser(user);
                return h.response(editedUser).code(201);
            } catch (err) {
                return Boom.serverUnavailable("Database Error");
            }
        },
        tags: ["api"],
        description: "Make a user an admin",
        notes: "Returns the edited user",
        response: { schema: UserSpecPlus, failAction: validationError },
    },

    removeAdmin: {
        auth: {
            strategy: "jwt",
        },
        handler: async function (request, h) {
            try {
                const user = await db.userStore.getUserById(request.params.id);
                if (!user) {
                    return Boom.notFound("No User with this id");
                }
                user.isAdmin = false;
                const editedUser = await db.userStore.editUser(user);
                return h.response(editedUser).code(201);
            } catch (err) {
                return Boom.serverUnavailable("Database Error");
            }
        },
        tags: ["api"],
        description: "Remove admin status from a user",
        notes: "Returns the edited user",
        response: { schema: UserSpecPlus, failAction: validationError },
    }
};
