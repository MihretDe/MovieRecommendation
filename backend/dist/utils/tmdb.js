"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const tmdb = axios_1.default.create({
    baseURL: "https://api.themoviedb.org/3",
    params: {
        api_key: process.env.TMDB_API_KEY,
        language: "en-US",
    },
});
exports.default = tmdb;
