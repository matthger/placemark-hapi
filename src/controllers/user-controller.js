import { db } from "../models/db.js";
export const userController = {
    index: {
        handler: async function (request, h) {
            let categories = await db.categoryStore.getUserCategories(request.auth.credentials._id);
            let placemarks = await db.placemarkStore.getPlacemarksByUserId(request.auth.credentials._id);
            return h.view("User", {title: "Placemark - My profile", user: request.auth.credentials, categories: categories.length, placemarks: placemarks.length});
        },
    },
    password: {
        handler: async function (request, h) {
            return h.view("Password", {title: "Placemark - Change password", passChanged: null});
        },
    },
    changePassword: {
        handler: async function (request, h) {
            const userEdit = request.payload;
            const user = await db.userStore.getUserById(request.auth.credentials._id);
            let passChanged = true;
            let errorMessage = "";
            switch (user.password) {
                case userEdit.newPassword:
                    errorMessage = "New password cannot be the same as the old one!";
                    passChanged = false;
                    break;
                case userEdit.currentPassword:
                    user.password = userEdit.newPassword;
                    await db.userStore.editUser(user);
                    break;
                default:
                    errorMessage = "Wrong current password!";
                    passChanged = false;
                    break;
            }
            return h.view("Password", {title: "Placemark - Change password", passChanged: passChanged, errorMessage: errorMessage});
        },
    },
};