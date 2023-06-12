import { db } from "../models/db.js";
export const adminController = {
    index: {
        auth : {
            strategy : 'session',
            mode     : 'optional'
        },
        handler: async function (request, h) {
            if (request.auth.isAuthenticated && request.auth.credentials.isAdmin === true) {
                return h.redirect("/admin/dashboard");
            }
            return h.view("Admin", {title: "Placemark - Admin Login", dashboard: false});
        },
    },
    adminLogin: {
        auth: false,
        handler: async function (request, h) {
            const { email, password } = request.payload;
            const user = await db.userStore.getUserByEmail(email);
            let errorMessage = "";
            if (!user || user.password !== password) {
                errorMessage = (!user) ?  "User not found!" : "Wrong credentials!";
                return h.view("Login", { title: "Login to Placemark Admin", isError: true, errorMessage: errorMessage });
            } else if (user.isAdmin !== true) {
                errorMessage = "You are not an admin!";
                return h.view("Admin", { title: "Login to Placemark Admin", isError: true, errorMessage: errorMessage });
            }
            request.cookieAuth.set({ id: user._id });
            return h.redirect("/admin/dashboard");
        },
    },
    adminDashboard: {
        handler: async function (request, h) {
            let editUser = null;
            let users = await db.userStore.getAllUsers();
            users = users.filter(user => user._id.toString() !== request.auth.credentials._id.toString());
            let placemarks = await db.placemarkStore.getAllPlacemarks();
            placemarks = placemarks.length;
            let categories = await db.categoryStore.getAllCategories();
            categories = categories.length;
            if (request.query.editUser) {
                editUser = await db.userStore.getUserById(request.query.editUser);
            }
            return h.view("Admin", {title: "Placemark - Admin Dashboard", dashboard: true, loggedIn: true, users: users, placemarks: placemarks, categories: categories, editUser: editUser, user: request.auth.credentials });
        },
    },
    adminLogout: {
        handler: function (request, h) {
            request.cookieAuth.clear();
            return h.redirect("/admin");
        },
    },
    makeAdmin: {
        handler: async function (request, h) {
            let user = await db.userStore.getUserById(request.params.id);
            user.isAdmin = true;
            await db.userStore.editUser(user);
            return h.redirect("/admin/dashboard?editUser=" + user._id + "#userManager");
        },
    },
    removeAdmin: {
        handler: async function (request, h) {
            let user = await db.userStore.getUserById(request.params.id);
            user.isAdmin = false;
            await db.userStore.editUser(user);
            return h.redirect("/admin/dashboard?editUser=" + user._id + "#userManager");
        },
    },
    deleteUser: {
        handler: async function (request, h) {
            await db.userStore.deleteUserById(request.params.id);
            await db.categoryStore.deleteCategoriesByUserId(request.params.id);
            await db.placemarkStore.deletePlacemarksByUserId(request.params.id);
            return h.redirect("/admin/dashboard#userManager");
        },
    },
};