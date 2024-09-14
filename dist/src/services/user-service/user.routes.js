"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controllers_1 = __importDefault(require("./user.controllers"));
const verify_auth_code_1 = require("../middleware/verify-auth-code");
const router = express_1.default.Router();
// /api/user
router.post('/create-user', user_controllers_1.default.createUser);
router.post('/new-user/request-otp', user_controllers_1.default.requestNewUserOTP);
router.post('/new-user/activate-user-account', verify_auth_code_1.verifyAuthCode, user_controllers_1.default.activateUserAccount);
router.post('/authenticate', user_controllers_1.default.authenticateUser);
router.post('/verify-otp', user_controllers_1.default.verifyOtp);
router.post('/logout', user_controllers_1.default.logout);
exports.default = router;
