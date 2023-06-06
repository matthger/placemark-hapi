import { assert } from "chai";
import { EventEmitter } from "events";
import { db } from "../../src/models/db.js";
import {maggie, sightseeing, testCategories} from "../fixtures.js";
import { assertSubset } from "../test-utils.js";

EventEmitter.setMaxListeners(25);

suite("Category Model tests", () => {

    let user = null;

    setup(async () => {
        db.init("mongo");
        await db.categoryStore.deleteAll();
        user = await db.userStore.addUser(maggie);
        sightseeing.user = user._id;
        for (let i = 0; i < testCategories.length; i++) {
            // eslint-disable-next-line no-await-in-loop
            testCategories[i].user = user._id;
            await db.categoryStore.addCategory(testCategories[i]);
        }
    });

    test("create a category", async () => {
        const newCategory = await db.categoryStore.addCategory(sightseeing);
        assertSubset(sightseeing, newCategory);
        assert.isDefined(newCategory._id);
    });

    test("delete all categorys", async () => {
        let returnedCategories = await db.categoryStore.getAllCategories();
        assertSubset(returnedCategories.length, testCategories.length);
        await db.categoryStore.deleteAll();
        returnedCategories = await db.categoryStore.getAllCategories();
        assertSubset(returnedCategories.length, 0);
    });

    test("get a category - success", async () => {
        const category = await db.categoryStore.addCategory(sightseeing);
        const returnedCategory1 = await db.categoryStore.getCategoryById(category._id);
        assertSubset(sightseeing, returnedCategory1);
    });

    test("delete one category - success", async () => {
        const id = testCategories[0]._id;
        await db.categoryStore.deleteCategoryById(id);
        const returnedCategories = await db.categoryStore.getAllCategories();
        assertSubset(returnedCategories.length, testCategories.length - 1);
        const deletedCategory = await db.categoryStore.getCategoryById(id);
        assert.isNull(deletedCategory);
    });

    test("get a category - bad params", async () => {
        assert.isNull(await db.categoryStore.getCategoryById(""));
        assert.isNull(await db.categoryStore.getCategoryById());
    });

    test("delete one category - fail", async () => {
        await db.categoryStore.deleteCategoryById("bad-id");
        const allCategories = await db.categoryStore.getAllCategories();
        assertSubset(testCategories.length, allCategories.length);
    });
});
