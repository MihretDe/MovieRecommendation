"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getManagementToken = getManagementToken;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
async function getManagementToken() {
    try {
        const response = await axios_1.default.post(`https://${process.env.AUTH0_DOMAIN}/oauth/token`, {
            client_id: process.env.AUTH0_CLIENT_ID,
            client_secret: process.env.AUTH0_CLIENT_SECRET,
            audience: process.env.AUTH0_AUDIENCE,
            grant_type: "client_credentials",
        });
        return response.data.access_token;
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            console.error("Auth0 error:", error.response?.data || error.message);
        }
        else {
            console.error("Unexpected error:", error);
        }
        throw new Error("Unable to fetch Auth0 management token");
    }
}
