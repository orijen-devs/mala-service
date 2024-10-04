"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cart_controllers_1 = __importDefault(require("./cart.controllers"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.post('/add-to-cart', auth_middleware_1.verifyAuth, cart_controllers_1.default.AddToCart);
router.get('/get-cart-items/:restau_id', auth_middleware_1.verifyAuth, cart_controllers_1.default.getCartItems);
exports.default = router;
