import Boom from "@hapi/boom";
import cryptoRandomString from "crypto-random-string";
import SHA512 from "crypto-js/sha512";
import HmacSHA512 from "crypto-js/hmac-sha512";

import connectionHelpers from "./utils/connectionHelpers";
import User from "./utils/models/User";

export default {
    name: "crud",
    version: 1,
    settings: {
        schema: "main",
        $noVersionPrefix: true,
    },
    async created() {
        try {
            await connectionHelpers["MONGO_DB"].connect();
            this.logger.info(`MongoDB connection successful`);
        } catch (error) {
            this.logger.error(`MongoDB connection error: ${error}`);
        }
    },
    actions: {
        //index action
        index() {
            return "Hello from CRUD microservices";
        },

        //creating user operation action
        async createUser({ params: userData }) {
            try {
                let userExists = await this.checkUserExistsByEmail(
                    userData.email
                );
                //  checks if typeof function is same as object and if key output is in the method
                if (typeof userExists === typeof {} && "output" in userExists) {
                    return userExists;
                }

                //  checks if user already exists
                if (userExists) {
                    return Boom.badData("[createUser] already exists");
                }

                //  encrypting the password
                userData.password_salt = SHA512(
                    cryptoRandomString(10)
                ).toString();
                userData.password_hash = HmacSHA512(
                    userData.password,
                    userData.password_salt
                ).toString();

                // delete the password
                delete userData.password;

                // creating object for user model
                let user = new User({ ...userData });

                // save the user as it is first-timer
                await user.save();

                // return email for proof
                return userData.email;
            } catch (error) {
                this.logger.error(`[createUser] error :${error}`);
                return Boom.badImplementation(
                    `[createUser] Internal Server Error :${error}`,
                    {
                        internalCode: 500,
                        message:
                            error.routine ||
                            error.message ||
                            "something went wrong",
                    }
                );
            }
        },

        // action to list all users in the DB
        async listUsers() {
            try {
                // fetching all records in the User model
                let allUsers = await User.find({});

                if (allUsers) {
                    for (let index = 0; index < allUsers.length; index++) {
                        allUsers[index] = await this.formatUserData(
                            allUsers[index]
                        );
                    }
                    return allUsers;
                }
                return Boom.notFound(`[listUsers] No models found in database`);
            } catch (error) {
                this.logger.error(`[listUsers] error : ${error}`);
                return Boom.badImplementation(
                    `[listUsers] Internal server Error : ${error}`,
                    {
                        internalCode: 500,
                        message:
                            error.routine ||
                            error.message ||
                            "something went wrong",
                    }
                );
            }
        },

        async getUser({ params: userId }) {
            try {
                let userData = await User.findById(userId);
                if (userData) {
                    return await this.formatUserData(userData);
                }
                return Boom.notFound(`[getUser] Data Not Found`);
            } catch (error) {
                this.logger.error(`[getUser] error: ${error}`);
                return Boom.badImplementation(
                    `[getUser] Internal server error: ${error}`,
                    {
                        internalCode: 500,
                        message:
                            error.rotine ||
                            error.message ||
                            "something went wrong",
                    }
                );
            }
        },

        // method to update User information
        async deleteUser({ params: userId }) {
            try {
                if (await this.checkUserExistsById(userId)) {
                    await User.deleteOne({ _id: userId });
                    return userId;
                }
                return Boom.notFound(`[deleteUser] Data Not Found`);
            } catch (error) {
                this.logger.error(`[deleteUser] error: ${error}`);
                return Boom.badImplementation(
                    `[deleteUser] Internal server error: ${error}`,
                    {
                        internalCode: 500,
                        message:
                            error.rotine ||
                            error.meassage ||
                            "something went wrong",
                    }
                );
            }
        },

        async updateUser({ params: updateData }) {
            // updateData = {userId: 1223344, userData: {first_name : sjs},  }
            try {
                if (await this.checkUserExistsById(updateData.userId)) {
                    return await this.formatUserData(
                        await User.findByIdAndUpdate(
                            updateData.userId,
                            updateData.userData
                        )
                    );
                }
                return Boom.notFound(`[updateUser] User Not Found`);
            } catch (error) {
                return Boom.badImplementation(
                    `[updateUser] Internal Server Error: ${error}`,
                    {
                        internalCode: 500,
                        meassage:
                            error.rotine ||
                            error.meassage ||
                            "something went wrong",
                    }
                );
            }
        },
    },

    methods: {
        //  Method to check if email exists or not
        async checkUserExistsByEmail(userEmail) {
            try {
                if (await User.findOne({ email: userEmail })) {
                    return true;
                }
                return false;
            } catch (error) {
                this.logger.error(`[checkUserExistsByEmail] error :${error}`);
                return Boom.badImplementation(
                    `[checkUserExistsByEmail] Internal Server Error :${error}`,
                    {
                        internalCode: 500,
                        message:
                            error.routine ||
                            error.message ||
                            "something went wrong",
                    }
                );
            }
        },

        //  Method to check if User exists by ID/Username or not
        async checkUserExistsById(userId) {
            try {
                if (await User.findById(userId)) {
                    return true;
                }
                return false;
            } catch (error) {
                this.logger.error(`[checkUserExistsByEmail] Error :${error}`);
                return Boom.badImplementation(
                    `[checkUserExistsByEmail] Internal Server Error :${error}`,
                    {
                        internalCode: 500,
                        message:
                            error.routine ||
                            error.message ||
                            "something went wrong",
                    }
                );
            }
        },

        // method to fetch all userdata
        async formatUserData(userData) {
            try {
                delete userData._doc.__v;
                delete userData._doc.password_hash;
                delete userData._doc.password_salt;
                userData._doc.id = userData._doc._id.toString();
                delete userData._doc._id;
                return userData._doc;
            } catch (error) {
                this.logger.error(`[formatUserData] Error:${error}`);
                return Boom.badImplementation(
                    `[formatUserData] Error: ${error}`,
                    {
                        internalCode: 500,
                        message:
                            error.rotine ||
                            error.message ||
                            "something went wrong",
                    }
                );
            }
        },
    },
};
