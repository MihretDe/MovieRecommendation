"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signup = void 0;
const axios_1 = __importDefault(require("axios"));
const auth0_1 = require("../utils/auth0");
const Users_1 = require("../Models/Users");
const signup = async (req, res) => {
    const { email, password, name } = req.body; // <-- add name
    try {
        const token = await (0, auth0_1.getManagementToken)();
        console.log("Management Token:", token);
        const userResponse = await axios_1.default.post(`https://${process.env.AUTH0_DOMAIN}/api/v2/users`, {
            email,
            password,
            name, // <-- pass name to Auth0
            connection: "Username-Password-Authentication",
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const auth0User = userResponse.data;
        // Connect to MongoDB and store user
        // await connectDB();
        const newUser = new Users_1.User({
            email: auth0User.email,
            auth0Id: auth0User.user_id,
            name: auth0User.name || name, // <-- store name in MongoDB
        });
        await newUser.save();
        res.status(201).json({ message: "User created and stored in MongoDB" });
    }
    catch (err) {
        console.log("Error during signup:", err);
        res.status(400).json({ error: err.response?.data || err.message });
    }
};
exports.signup = signup;
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const response = await axios_1.default.post(`https://${process.env.AUTH0_DOMAIN}/oauth/token`, {
            grant_type: "http://auth0.com/oauth/grant-type/password-realm",
            username: email,
            password: password,
            audience: process.env.AUTH0_AUDIENCE,
            scope: "openid profile email",
            client_id: process.env.AUTH0_CLIENT_ID,
            client_secret: process.env.AUTH0_CLIENT_SECRET,
            realm: "Username-Password-Authentication", // 👈 Required for database connections
        });
        // Return tokens to frontend (access_token, id_token, expires_in, etc.)
        res.status(200).json(response.data);
    }
    catch (error) {
        console.error("Login error:", error.response?.data || error.message);
        res
            .status(error.response?.status || 500)
            .json(error.response?.data || { message: "Login failed" });
    }
};
exports.login = login;
