"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signup = void 0;
const axios_1 = __importDefault(require("axios"));
const auth0_1 = require("../utils/auth0");
const db_1 = require("../utils/db");
const Users_1 = require("../Models/Users");
const signup = async (req, res) => {
    const { email, password } = req.body;
    try {
        const token = await (0, auth0_1.getManagementToken)();
        const userResponse = await axios_1.default.post(`https://${process.env.AUTH0_DOMAIN}/api/v2/users`, {
            email,
            password,
            connection: "Username-Password-Authentication",
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const auth0User = userResponse.data;
        // Connect to MongoDB and store user
        await (0, db_1.connectDB)();
        const newUser = new Users_1.User({
            email: auth0User.email,
            auth0Id: auth0User.user_id,
        });
        await newUser.save();
        res.status(201).json({ message: "User created and stored in MongoDB" });
    }
    catch (err) {
        res.status(400).json({ error: err.response?.data || err.message });
    }
};
exports.signup = signup;
