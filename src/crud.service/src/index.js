import config from "config";
import { ServiceBroker } from "moleculer";

const brokerOptions = {
    nodeID: config.get("broker.nodeID"),
    namespace: process.env.namespace || "development",
    transporter: "TCP",
    logger: console,
    logLevel: "debug",
};

const logger = globalThis.logger || console;
let broker;

(async () => {
    setInterval(() => {}, 1000);
    try {
        broker = new ServiceBroker(brokerOptions);
        broker.loadServices(require("path").resolve(__dirname));
        await broker.start();
    } catch (error) {
        logger.error(`Error in broker${error}`);
    }
})();
