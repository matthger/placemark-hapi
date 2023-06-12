import { categoryApi } from "./api/categories-api.js";
import { userApi } from "./api/user-api.js";
import { placemarkApi } from "./api/placemark-api.js";

export const apiRoutes = [
    { method: "GET", path: "/api/users", config: userApi.find },
    { method: "POST", path: "/api/users", config: userApi.create },
    { method: "POST", path: "/api/password/{id}", config: userApi.changePassword },
    { method: "DELETE", path: "/api/users", config: userApi.deleteAll },
    { method: "DELETE", path: "/api/users/{id}", config: userApi.delete },
    { method: "GET", path: "/api/users/{id}", config: userApi.findOne },
    { method: "POST", path: "/api/users/{id}/makeadmin", config: userApi.makeAdmin },
    { method: "POST", path: "/api/users/{id}/removeadmin", config: userApi.removeAdmin },

    { method: "POST", path: "/api/categories", config: categoryApi.create },
    { method: "DELETE", path: "/api/categories", config: categoryApi.deleteAll },
    { method: "GET", path: "/api/categories", config: categoryApi.find },
    { method: "GET", path: "/api/categories/user/{id}", config: categoryApi.findUserCategories },
    { method: "GET", path: "/api/categories/{id}", config: categoryApi.findOne },
    { method: "DELETE", path: "/api/categories/{id}", config: categoryApi.deleteOne },
    { method: "PUT", path: "/api/categories/{id}", config: categoryApi.update },
    { method: "POST", path: "/api/categories/{id}/uploadimage", config: categoryApi.uploadImage },
    { method: "DELETE", path: "/api/categories/{id}/deleteimage", config: categoryApi.deleteImage },

    { method: "GET", path: "/api/placemarks", config: placemarkApi.find },
    { method: "GET", path: "/api/placemarks/{id}", config: placemarkApi.findOne },
    { method: "POST", path: "/api/placemarks", config: placemarkApi.create },
    { method: "DELETE", path: "/api/placemarks", config: placemarkApi.deleteAll },
    { method: "DELETE", path: "/api/placemarks/{id}", config: placemarkApi.deleteOne },
    { method: "PUT", path: "/api/placemarks/{id}", config: placemarkApi.update },
    { method: "POST", path: "/api/placemarks/{id}/uploadimage", config: placemarkApi.uploadImage },
    { method: "DELETE", path: "/api/placemarks/{id}/deleteimage", config: placemarkApi.deleteImage },

    { method: "POST", path: "/api/users/authenticate", config: userApi.authenticate },

    { method: "POST", path: "/api/admin/login", config: userApi.adminLogin },
];