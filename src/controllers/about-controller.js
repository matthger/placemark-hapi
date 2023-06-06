export const aboutController = {
    index: {
        auth: false,
        handler: function (request, h) {
            return h.view("About", { title: "Placemark - About" });
        },
    },
};
