import { assert } from "chai";
import { db } from "../../src/models/db.js";
import {brandenburgerTor, testPlacemarks, sightseeing, europaPark, monument, maggie} from "../fixtures.js";
import { assertSubset } from "../test-utils.js";

suite("Placemark Model tests", () => {

    let sightseeingList = {};
    let user = {};

    setup(async () => {
        db.init("mongo");
        await db.placemarkStore.deleteAll();
        await db.categoryStore.deleteAll();
        await db.userStore.deleteAll();
        user = await db.userStore.addUser(maggie);
        sightseeing.user = user._id;
        sightseeingList = await db.categoryStore.addCategory(sightseeing);
        for (let i = 0; i < testPlacemarks.length; i++) {
            // eslint-disable-next-line no-await-in-loop
            testPlacemarks[i].category = sightseeingList._id;
            testPlacemarks[i] = await db.placemarkStore.addPlacemark(testPlacemarks[i]);
        }
    });

    test("create a placemark", async () => {
        const monumentList = await db.categoryStore.addCategory(monument);
        brandenburgerTor.category = monumentList._id;
        const newPlacemark = await db.placemarkStore.addPlacemark(brandenburgerTor);
        assertSubset(brandenburgerTor, newPlacemark);
        assert.isDefined(newPlacemark._id);
    });

    test("delete all placemarks", async () => {
        let returnedPlacemarks = await db.placemarkStore.getAllPlacemarks();
        assertSubset(returnedPlacemarks.length, testPlacemarks.length);
        await db.placemarkStore.deleteAll();
        returnedPlacemarks = await db.placemarkStore.getAllPlacemarks();
        assertSubset(returnedPlacemarks.length, 0);
    });

    test("get multiple placemarks", async () => {
        const placemarks = await db.placemarkStore.getPlacemarksByCategoryId(sightseeingList._id);
        assert.equal(placemarks.length, testPlacemarks.length)
    });

    test("get a placemark - success", async () => {
        europaPark.category = sightseeingList._id;
        const placemark = await db.placemarkStore.addPlacemark(europaPark);
        const returnedPlacemark1 = await db.placemarkStore.getPlacemarkById(placemark._id);
        assertSubset(placemark, returnedPlacemark1);
    });

    test("delete one placemark - success", async () => {
        await db.placemarkStore.deletePlacemarkById(testPlacemarks[0]._id);
        const returnedPlacemarks = await db.placemarkStore.getAllPlacemarks();
        assertSubset(returnedPlacemarks.length, testPlacemarks.length - 1);
        const deletedPlacemark = await db.placemarkStore.getPlacemarkById(testPlacemarks[0]._id);
        assert.isNull(deletedPlacemark);
    });

    test("get a placemark - bad params", async () => {
        assert.isNull(await db.placemarkStore.getPlacemarkById(""));
        assert.isNull(await db.placemarkStore.getPlacemarkById());
    });

    test("delete one placemark - fail", async () => {
        await db.placemarkStore.deletePlacemarkById("bad-id");
        const allPlacemarks = await db.placemarkStore.getAllPlacemarks();
        assertSubset(testPlacemarks.length, allPlacemarks.length);
    });
});
