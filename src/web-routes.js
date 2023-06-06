import { accountsController } from "./controllers/accounts-controller.js";
import { userController } from "./controllers/user-controller.js";
import {categoryController} from "./controllers/category-controller.js";

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
