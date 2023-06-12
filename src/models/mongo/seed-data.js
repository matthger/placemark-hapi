export const seedData = {
    users: {
        _model: "User",
        matthias: {
            firstName: "Matthias",
            lastName: "Gerhard",
            email: "matthias@gerhard.com",
            password: "secret",
            isAdmin: true
        },
        homer: {
            firstName: "Homer",
            lastName: "Simpson",
            email: "homer@simpson.com",
            password: "secret",
            isAdmin: true
        },
        marge: {
            firstName: "Marge",
            lastName: "Simpson",
            email: "marge@simpson.com",
            password: "secret",
            isAdmin: false
        },
        bart: {
            firstName: "Bart",
            lastName: "Simpson",
            email: "bart@simpson.com",
            password: "secret",
            isAdmin: false
        },
    },
    categories: {
        _model: "Category",
        sightseeing: {
            name: "Sightseeing",
            description: "Sightseeing in Germany",
            user: "->users.matthias",
            img: "https://res.cloudinary.com/dlja8qcnw/image/upload/v1686510441/ziifl4tyesle5layx97n.jpg",
        },
        shopping: {
            name: "Shopping",
            description: "Shopping in Germany",
            user: "->users.homer",
            img: "https://res.cloudinary.com/dlja8qcnw/image/upload/v1686508188/eyc3ev8buogzbaeguypn.png",
        },
    },
    placemarks: {
        _model: "Placemark",
        allianzArena: {
            name: "Allianz Arena",
            description: "Allianz Arena in Munich",
            lat: "48.218775",
            lng: "11.624753",
            img: "https://res.cloudinary.com/dlja8qcnw/image/upload/v1686508020/whasv8rpodfj7dvqyshe.jpg",
            category: "->categories.sightseeing",
        },
        neuschwanstein: {
            name: "Schloss Neuschwanstein",
            description: "Schloss Neuschwanstein in Bavaria",
            lat: "47.557574",
            lng: "10.749800",
            img: "https://res.cloudinary.com/dlja8qcnw/image/upload/v1686508103/zr1znnsaopdpcufwpuos.jpg",
            category: "->categories.sightseeing",
        },
        koelnerDom: {
            name: "Kölner Dom",
            description: "Kölner Dom in Cologne",
            lat: "50.941278",
            lng: "6.958281",
            img: "https://res.cloudinary.com/dlja8qcnw/image/upload/v1686508093/ib0eqgpkxxlekjyudrgg.jpg",
            category: "->categories.sightseeing",
        },
        kadewe: {
            name: "KaDeWe",
            description: "KaDeWe in Berlin",
            lat: "52.502778",
            lng: "13.341944",
            img: "https://res.cloudinary.com/dlja8qcnw/image/upload/v1686508170/fwqt2z0jae4ij6blyi33.jpg",
            category: "->categories.shopping",
            user: "->users.homer"
        }
    },
};