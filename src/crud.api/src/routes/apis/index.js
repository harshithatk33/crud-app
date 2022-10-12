import express from "express";

let router = express.Router();

/*creating a route to test*/
router.get("/", (req, res) => {
    return res.send("Starting CRUD Operations");
});

module.exports = router;
