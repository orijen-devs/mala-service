"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartItem = exports.Cart = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const CartItemSchema = new mongoose_1.default.Schema({
    item: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
    quantity: { type: String, required: true },
});
const CartSchema = new mongoose_1.default.Schema({
    restaurant: { type: String, ref: 'Restaurant', required: true },
    customer: { type: String, ref: 'User', required: true },
    items: [CartItemSchema],
    created_at: { type: Date },
    updated_at: { type: Date }
});
const Cart = mongoose_1.default.model('Cart', CartSchema);
exports.Cart = Cart;
const CartItem = mongoose_1.default.model('CartItem', CartItemSchema);
exports.CartItem = CartItem;
