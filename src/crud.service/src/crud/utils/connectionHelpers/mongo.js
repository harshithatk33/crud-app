import mongoose from "mongoose";
import config from "config";

class MongoHelpers {
    static async connect() {
        return await mongoose.connect(config.get("dbs.mongo.uri"));
    }

    static async disconnect() {
        return await mongoose.disconnect();
    }
}

export default MongoHelpers;
