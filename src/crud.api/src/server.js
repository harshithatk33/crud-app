/*importing necessary packages*/
import express, { request } from "express";
import { ServiceBroker } from "moleculer";
import logger from "./utils/logger";
//const config = require("config"); //ES6 something?

/* creating an instance of express*/
const server = express();

// setting up middleware for POST requests for Express to reconize  req body as a json object.
server.use(express.json({ extended: false }));
//configuring API's
//server.use("/", require("./routes/apis/index"));
server.use("/api/v1/user", require("./routes/apis/user"));

let broker;

(async () => {
    setInterval(() => {}, 1000);
    try {
        broker = new ServiceBroker({
            namespace: "development",
            transporter: "TCP",
        });

        await broker.start();
        await broker.waitForServices("crud");
        server.request.broker = broker;
    } catch (error) {}
})();

export default server;
