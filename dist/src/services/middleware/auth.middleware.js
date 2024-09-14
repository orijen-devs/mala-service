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
exports.verifyAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_models_1 = __importDefault(require("../user-service/user.models"));
// Mala's gateman. Responsible for checking credentials from the client
// before granting access to protected resources
const verifyAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let access_token;
    access_token = req.cookies.acc_tk;
    console.log(access_token);
    if (!access_token) {
        return res.json({ status: 401, forbidden: true, message: 'unauthorized_access' });
    }
    //resolve issue where jwt cannot read token from .env
    jsonwebtoken_1.default.verify(access_token, 'secret-key', (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return res.json({ status: 403, token_valid: false, message: 'invalid_token' });
        }
        else {
            req.body.user = yield user_models_1.default.findById(decoded.user).select('-password');
            next();
        }
    }));
});
exports.verifyAuth = verifyAuth;
