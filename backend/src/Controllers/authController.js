"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signup = void 0;
const axios_1 = __importDefault(require("axios"));
const auth0_1 = require("../utils/auth0");
const db_1 = require("../utils/db");
const Users_1 = require("../Models/Users");
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { email, password } = req.body;
    try {
        const token = yield (0, auth0_1.getManagementToken)();
        const userResponse = yield axios_1.default.post(`https://${process.env.AUTH0_DOMAIN}/api/v2/users`, {
            email,
            password,
            connection: 'Username-Password-Authentication',
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const auth0User = userResponse.data;
        // Connect to MongoDB and store user
        yield (0, db_1.connectDB)();
        const newUser = new Users_1.User({
            email: auth0User.email,
            auth0Id: auth0User.user_id,
        });
        yield newUser.save();
        res.status(201).json({ message: 'User created and stored in MongoDB' });
    }
    catch (err) {
        res.status(400).json({ error: ((_a = err.response) === null || _a === void 0 ? void 0 : _a.data) || err.message });
    }
});
exports.signup = signup;
