"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const order_controllers_1 = __importDefault(require("./order.controllers"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.post('/create-order', auth_middleware_1.verifyAuth, order_controllers_1.default.createOrder);
router.post('/cancel-order/:orderId', auth_middleware_1.verifyAuth, order_controllers_1.default.cancelOrder);
exports.default = router;
