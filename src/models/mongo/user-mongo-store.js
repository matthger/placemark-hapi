import { User } from "./user.js";

export const userMongoStore = {
    async getAllUsers() {
        let users = await User.find().lean();
        users = this.sortUsers(users);
        return users;
    },

    sortUsers(users) {
        users.sort((a,b) => (a.lastName.toLowerCase() > b.lastName.toLowerCase()) ? 1 : ((b.lastName.toLowerCase() > a.lastName.toLowerCase()) ? -1 : 0));
        return users;
    },

    async getUserById(id) {
        if (id) {
            const user = await User.findOne({ _id: id }).lean();
            return user;
        }
        return null;
    },

    async addUser(user) {
        const newUser = new User(user);
        if (await this.getUserByEmail(user.email)) {
            return null;
        }
        const userObj = await newUser.save();
        const returnedUser = await this.getUserById(userObj._id);
        return returnedUser;
    },

    async editUser(user) {
        await User.updateOne({ _id: user._id }, { name: user.name, email: user.email, password: user.password, isAdmin: user.isAdmin });
        return this.getUserById(user._id);
    },

    async getUserByEmail(email) {
        const user = await User.findOne({ email: email }).lean();
        return user;
    },

    async deleteUserById(id) {
        try {
            await User.deleteOne({ _id: id });
        } catch (error) {
            console.log("bad id");
        }
    },

    async deleteAll() {
        await User.deleteMany({});
    },
};
