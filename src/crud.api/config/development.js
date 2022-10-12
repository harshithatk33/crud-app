module.exports = {
    app: {
        name: "CRUD - Express",
        connection: {
            port: process.env.CRUD_PORT || "8001",
            host: process.env.CRUD_HOST || "127.0.0.1",
        },
    },
    // dbs: {
    //     mongodb: {
    //         mongouri:
    //             //<driverName>://<userName>:<password>@<locationOfDatabase>/<databaseName>?<connectionOptions>
    //             "mongodb+srv://admin:admin@cluster0.pwcsr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    //     },
    // },
};
