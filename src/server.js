import Hapi from "@hapi/hapi";
import Inert from "@hapi/inert";
import Vision from "@hapi/vision";
import Cookie from "@hapi/cookie";
import Joi from "joi";
import HapiSwagger from "hapi-swagger";

import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import { db } from "./models/db.js";
import {apiRoutes} from "./api-routes.js";
import {validate} from "./api/jwt-utils.js";
import jwt from "hapi-auth-jwt2";
import Handlebars from "handlebars";
import {accountsController} from "./controllers/accounts-controller.js";
import {webRoutes} from "./web-routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerOptions = {
    info: {
        title: "Placemark API",
        version: "0.1",
    },
    securityDefinitions: {
        jwt: {
            type: "apiKey",
            name: "Authorization",
            in: "header"
        }
    },
    security: [{ jwt: [] }]
};

const result = dotenv.config();
if (result.error) {
    console.log(result.error.message);
}

async function init() {
    const server = Hapi.server({
        port: process.env.PORT || 4000,
        routes: { cors: true },
    });

    await server.register(Inert);
    await server.register(Vision);
    await server.register(Cookie);
    await server.register(jwt);
    server.validator(Joi);

    await server.register([
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: swaggerOptions,
        },
    ]);

    server.views({
        engines: {
            hbs: Handlebars,
        },
        relativeTo: __dirname,
        path: "./pages",
        layoutPath: "./pages",
        partialsPath: "./pages/components",
        layout: true,
        isCached: false,
    });

    server.auth.strategy("session", "cookie", {
        cookie: {
            name: process.env.cookie_name,
            password: process.env.cookie_password,
            isSecure: false,
        },
        redirectTo: "/",
        validate: accountsController.validate,
    });
    server.auth.default("session");

    server.auth.strategy("jwt", "jwt", {
        key: process.env.cookie_password,
        validate: validate,
        verifyOptions: { algorithms: ["HS256"] },
    });

    db.init("mongo");

    server.route(webRoutes);
    server.route(apiRoutes);

    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
}

process.on("unhandledRejection", (err) => {
    console.log(err);
    process.exit(1);
});

await init();
