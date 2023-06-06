import { accountsController } from "./controllers/accounts-controller.js";
import { userController } from "./controllers/user-controller.js";
import {categoryController} from "./controllers/category-controller.js";
import {placemarksController} from "./controllers/placemarks-controller.js";
import {aboutController} from "./controllers/about-controller.js";
import {browseController} from "./controllers/browse-controller.js";

export const webRoutes = [
    { method: "GET", path: "/", config: accountsController.index },
    { method: "GET", path: "/signup", config: accountsController.showSignup },
    { method: "GET", path: "/login", config: accountsController.showLogin },
    { method: "GET", path: "/logout", config: accountsController.logout },
    { method: "POST", path: "/register", config: accountsController.signup },
    { method: "POST", path: "/authenticate", config: accountsController.login },

    { method: "GET", path: "/user", config: userController.index },

    { method: "GET", path: "/categories", config: categoryController.index },
    { method: "POST", path: "/categories/edit/{id}", config: categoryController.editCategory },
    { method: "POST", path: "/categories/delete/{id}", config: categoryController.delete },
    { method: "POST", path: "/categories", config: categoryController.addCategory },

    { method: "GET", path: "/placemarks", config: placemarksController.index },
    { method: "POST", path: "/placemarks/edit/{id}", config: placemarksController.editPlacemark },
    { method: "POST", path: "/placemarks/delete/{id}", config: placemarksController.delete },
    { method: "POST", path: "/placemarks", config: placemarksController.addPlacemark },
    { method: "GET", path: "/placemarks/filter/{id}", config: placemarksController.filter },

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
