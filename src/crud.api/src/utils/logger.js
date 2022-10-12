import config from "config";
import bunyan from "bunyan";

const levelMap = {
    development: "trace",
    test: "error",
    production: "info",
};

//initializing and configuring logger
const logger = bunyan.createLogger({
    name: config.get("app.name"),
    streams: [
        {
            level: levelMap[config.get("environment")],
            stream: process.stdout,
        },
    ],
});

global.logger = logger;
export default logger;
