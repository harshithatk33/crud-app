module.exports = {
    broker: {
        nodeID: process.env.CRUD_NODE || "crud-service",
    },

    dbs: {
        mongo: {
            // uri: "mongodb+srv://admin:admin@cluster0.pwcsr.mongodb.net/CRUDOps?retryWrites=true&w=majority",
        },
    },
};
