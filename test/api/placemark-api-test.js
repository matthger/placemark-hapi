import { assert } from "chai";
import { assertSubset } from "../test-utils.js";
import { placemarkService } from "./placemark-service.js";
import {brandenburgerTor, maggie, sightseeing, testPlacemarks, monument, maggieCredentials} from "../fixtures.js";

suite("Placemark API tests", () => {
    let user = null;
    let sights = null;

    setup(async () => {
        await placemarkService.clearAuth();
        user = await placemarkService.createUser(maggie);
        await placemarkService.authenticate(maggieCredentials);
        await placemarkService.deleteAllCategories();
        await placemarkService.deleteAllPlacemarks();
        await placemarkService.deleteAllUsers();
        user = await placemarkService.createUser(maggie);
        await placemarkService.authenticate(maggieCredentials);
        sightseeing.user = user._id;
        monument.user = user._id;
        sights = await placemarkService.createCategory(sightseeing);
    });

    teardown(async () => {});

    test("create placemark", async () => {
        const returnedPlacemark = await placemarkService.createPlacemark(sights._id, brandenburgerTor);
        assertSubset(brandenburgerTor, returnedPlacemark);
    });

    test("create multiple placemarks", async () => {
        let category = await placemarkService.createCategory(monument);
        for (let i = 0; i < testPlacemarks.length; i += 1) {
            // eslint-disable-next-line no-await-in-loop
            await placemarkService.createPlacemark(category._id, testPlacemarks[i]);
        }
        const returnedPlacemarks = await placemarkService.getAllPlacemarks();
        assert.equal(returnedPlacemarks.length, testPlacemarks.length);
        for (let i = 0; i < returnedPlacemarks.length; i += 1) {
            // eslint-disable-next-line no-await-in-loop
            const placemark = await placemarkService.getPlacemark(returnedPlacemarks[i]._id);
            assertSubset(placemark, returnedPlacemarks[i]);
        }
    });

    test("delete Placemark", async () => {
        for (let i = 0; i < testPlacemarks.length; i += 1) {
            // eslint-disable-next-line no-await-in-loop
            await placemarkService.createPlacemark(sights._id, testPlacemarks[i]);
        }
        let returnedPlacemarks = await placemarkService.getAllPlacemarks();
        assert.equal(returnedPlacemarks.length, testPlacemarks.length);
        for (let i = 0; i < returnedPlacemarks.length; i += 1) {
            // eslint-disable-next-line no-await-in-loop
            await placemarkService.deletePlacemark(returnedPlacemarks[i]._id);
        }
        returnedPlacemarks = await placemarkService.getAllPlacemarks();
        assert.equal(returnedPlacemarks.length, 0);
    });

    test("test denormalised category", async () => {
        for (let i = 0; i < testPlacemarks.length; i += 1) {
            // eslint-disable-next-line no-await-in-loop
            await placemarkService.createPlacemark(sights._id, testPlacemarks[i]);
        }
        const returnedCategory = await placemarkService.getCategory(sights._id);
        assert.equal(returnedCategory.placemarks.length, testPlacemarks.length);
        for (let i = 0; i < testPlacemarks.length; i += 1) {
            assertSubset(testPlacemarks[i], returnedCategory.placemarks[i]);
        }
    });
});
