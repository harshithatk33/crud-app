import express, { response } from "express";
import logger from "../../utils/logger";
import { check, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import config from "config";

let router = express.Router();

// creating user api
router.post(
    "/",
    [
        check("first_name", "Please provide your First Name").not().isEmpty(),
        check("last_name", "Please provide your Last Name").not().isEmpty(),
        check("email", "We cannot create userid without email").isEmail(),
        check("password", "Please provide a valid Password").isLength({
            min: 6,
        }),
    ],
    async (request, response) => {
        try {
            const errors = validationResult(request);
            if (!errors.isEmpty()) {
                return response.status(400).json({ errors: errors.array() });
            }
            let createResult = await request.broker.call(
                "crud.createUser",
                request.body
            );
            if (typeof createResult === typeof {} && "output" in createResult) {
                logger.error("[GET] /api/v1/user/ : ", createResult);
                return response.status(createResult.output.statusCode).json({
                    ...createResult.output.payload,
                });
            }
            return response.status(202).send();
        } catch (error) {
            logger.error(
                `[ POST ] /api/v1/user/ Internal server error : ${error}`
            );
            return response.status(500).json({
                message: "internal server error",
            });
        }
    }
);

/*creating a route to test list user*/
router.get("/list", async (request, response) => {
    try {
        let userList = await request.broker.call("crud.listUsers");
        if (typeof userList === typeof {} && "output" in userList) {
            logger.error("[GET] /api/v1/user/list : ", userList);
            return response.status(userList.output.statusCode).json({
                ...userList.output.payload,
            });
        }
        return response.status(200).json({ userList });
    } catch (error) {
        logger.error(
            `[ GET ] /api/v1/user/list Internal server error : ${error}`
        );
        return response.status(500).json({
            message: "internal server error",
        });
    }
});

// creating a route to get user List
router.get("/:userId", async (request, response) => {
    try {
        let userId = request.params.userId;
        //logger.info(`Hi inside get ${userId}`);
        let userData = await request.broker.call("crud.getUser", userId);
        if (typeof userData === typeof {} && "output" in userData) {
            logger.error("[GET] /api/v1/user/:userId :", userData);
            return response.status(userData.output.statusCode).json({
                ...userData.output.payload,
            });
        }
        return response.status(200).json({ userData });
    } catch (error) {
        logger.error(
            `[ GET ] /api/v1/user/:userid Internal server error : ${error}`
        );
        return response.status(500).json({
            message: "internal server error",
        });
    }
});

// creating an route to delete records
router.delete("/:userId", async (request, response) => {
    try {
        let userId = request.params.userId;

        let deleteResponse = await request.broker.call(
            "crud.deleteUser",
            userId
        );

        if (typeof deleteResponse === typeof {} && "ouput" in deleteResponse) {
            logger.error("[DELETE] /api/v1/user/:userId", deleteResponse);
            return response.status(deleteResponse.output.statusCode).json({
                ...deleteResponse.output.payload,
            });
        }
        return response.status(202).send();
    } catch (error) {
        logger.error(
            `[DELETE] /api/v1/user/:userId Internal server error : ${error}`
        );
        return response.status(500).json({
            message: "internal server error",
        });
    }
});

// router.post("/login", async (request, response) => {
//     try {
//         // User exists
//         // password matches
//         // Save UserId
//         let userId = "sdfoiwjfecigf";

//         let payload = {
//             user: {
//                 userId,
//             },
//         };
//         //     jwt.sign(
//         //         payload,
//         //         config.get("jwtWebToken"),
//         //         { expiresIn: 360000 },
//         //         (error, token) => {
//         //             if (error) {
//         //                 return response.status(400).send("Token No");
//         //             }
//         //             console.log({ token });
//         //             return response.status(200).json({ token });
//         //         }
//         //     );
//         let token = await jwtToken(payload);
//         return response.status(200).json({ token });
//     } catch (error) {
//         logger.error(
//             `[DELETE] /api/v1/user/:userId Internal server error : ${error}`
//         );
//         return response.status(500).json({
//             message: "internal server error",
//         });
//     }
// });

// function jwtToken(payload) {
//     return new Promise((resolve, reject) => {
//         jwt.sign(
//             payload,
//             config.get("jwtWebToken"),
//             { expiresIn: 360000 },
//             (error, token) => {
//                 if (error) {
//                     reject(error);
//                 }
//                 //console.log({ token });
//                 resolve(token);
//             }
//         );
//     });
// }

// export default router;
module.exports = router;
