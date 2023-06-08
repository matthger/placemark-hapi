import { accountsController } from "./controllers/accounts-controller.js";
import { userController } from "./controllers/user-controller.js";
import {categoryController} from "./controllers/category-controller.js";
import {placemarksController} from "./controllers/placemarks-controller.js";
import {aboutController} from "./controllers/about-controller.js";
import {browseController} from "./controllers/browse-controller.js";
import {adminController} from "./controllers/admin-controller.js";

export const webRoutes = [
    { method: "GET", path: "/", config: accountsController.index },
    { method: "GET", path: "/signup", config: accountsController.showSignup },
    { method: "GET", path: "/login", config: accountsController.showLogin },
    { method: "GET", path: "/logout", config: accountsController.logout },
    { method: "POST", path: "/signup", config: accountsController.signup },
    { method: "POST", path: "/login", config: accountsController.login },

    { method: "GET", path: "/user", config: userController.index },
    { method: "GET", path: "/user/delete/{id}", config: userController.deleteAccount },
    { method: "GET", path: "/password", config: userController.password },
    { method: "POST", path: "/password", config: userController.changePassword },

    { method: "GET", path: "/admin", config: adminController.index },
    { method: "POST", path: "/admin/login", config: adminController.adminLogin },
    { method: "GET", path: "/admin/logout", config: adminController.adminLogout },
    { method: "GET", path: "/admin/dashboard", config: adminController.adminDashboard },
    { method: "GET", path: "/admin/dashboard/makeAdmin/{id}", config: adminController.makeAdmin },
    { method: "GET", path: "/admin/dashboard/removeAdmin/{id}", config: adminController.removeAdmin },
    { method: "GET", path: "/admin/dashboard/deleteUser/{id}", config: adminController.deleteUser },

    { method: "GET", path: "/categories", config: categoryController.index },
    { method: "POST", path: "/categories/edit/{id}", config: categoryController.editCategory },
    { method: "POST", path: "/categories/delete/{id}", config: categoryController.delete },
    { method: "POST", path: "/categories", config: categoryController.addCategory },
    { method: "POST", path: "/categories/{id}/uploadimage", config: categoryController.uploadImage },
    { method: "POST", path: "/categories/{id}/deleteimage", config: categoryController.deleteImage },

    { method: "GET", path: "/placemarks", config: placemarksController.index },
    { method: "POST", path: "/placemarks/edit/{id}", config: placemarksController.editPlacemark },
    { method: "POST", path: "/placemarks/delete/{id}", config: placemarksController.delete },
    { method: "POST", path: "/placemarks", config: placemarksController.addPlacemark },
    { method: "GET", path: "/placemarks/filter/{id}", config: placemarksController.filter },
    { method: "POST", path: "/placemarks/{id}/uploadimage", config: placemarksController.uploadImage },
    { method: "POST", path: "/placemarks/{id}/deleteimage", config: placemarksController.deleteImage },

    { method: "GET", path: "/browse", config: browseController.index },

    { method: "GET", path: "/about", config: aboutController.index },

    {
        method: "GET",
        path: "/{param*}",
        handler: {
            directory: {
                path: "./public",
            },
        },
        options: { auth: false },
    },
];
