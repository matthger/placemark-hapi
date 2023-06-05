import { placemarkMongoStore } from "./mongo/placemark-mongo-store.js";
import { categoryMongoStore } from "./mongo/category-mongo-store.js";
import { userMongoStore } from "./mongo/user-mongo-store.js";
import { connectMongo } from "./mongo/connect.js";

export const db = {
    placemarkStore: null,
    categoryStore: null,
    userMongoStore: null,

    init(storeType) {
        switch (storeType) {
            case "mongo":
                this.placemarkStore = placemarkMongoStore;
                this.categoryStore = categoryMongoStore;
                this.userStore = userMongoStore;
                connectMongo();
                break;
            default:
        }
    },
};
