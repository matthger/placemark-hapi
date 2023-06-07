import { db } from "../models/db.js";

export const accountsController = {
    index: {
        auth: false,
        handler: function (request, h) {
            return h.view("Main", { title: "Welcome to Placemark" });
        },
    },
    showSignup: {
        auth: false,
        handler: function (request, h) {
            return h.view("Signup", { title: "Sign up for Placemark", accCreated: null });
        },
    },
    signup: {
        auth: false,
        handler: async function (request, h) {
            const user = request.payload;
            let accCreated = false;
            if (await db.userStore.addUser(user) !== null) accCreated = true;
            return h.view("Signup", { title: "Sign up for Placemark", accCreated: accCreated });
        },
    },
    showLogin: {
        auth: false,
        handler: function (request, h) {
            return h.view("Login", { title: "Login to Placemark", isError: false });
        },
    },
    login: {
        auth: false,
        handler: async function (request, h) {
            const { email, password } = request.payload;
            const user = await db.userStore.getUserByEmail(email);
            if (!user || user.password !== password) {
                let errorMessage = "";
                errorMessage = (!user) ?  "User not found!" : "Wrong credentials!";
                return h.view("Login", { title: "Login to Placemark", isError: true, errorMessage: errorMessage });
            }
            request.cookieAuth.set({ id: user._id });
            return h.redirect("/user");
        },
    },
    logout: {
        handler: function (request, h) {
            request.cookieAuth.clear();
            return h.redirect("/");
        },
    },

    async validate(request, session) {
        const user = await db.userStore.getUserById(session.id);
        if (!user) {
            return { isValid: false };
        }
        return { isValid: true, credentials: user };
    },
};
