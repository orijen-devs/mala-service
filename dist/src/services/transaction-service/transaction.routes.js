"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const transaction_controllers_1 = __importDefault(require("./transaction.controllers"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.post('/initiate-payment', auth_middleware_1.verifyAuth, transaction_controllers_1.default.initiatePayment);
exports.default = router;
