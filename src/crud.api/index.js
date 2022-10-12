import config from "config";
import server from "./src/server";

/*setting a PORT number using Env variables*/
//const PORT = process.env.PORT || config.get("PORT");
/*listen to this port*/
server.listen(
    config.get("app.connection.port"),
    config.get("app.connection.host"),
    () => {
        logger.info(
            `server listening to PORT : http://${config.get(
                "app.connection.host"
            )}:${config.get("app.connection.port")}`
        );
    }
);
