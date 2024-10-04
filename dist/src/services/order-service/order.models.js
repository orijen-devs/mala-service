"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = exports.ORDER_STATUS = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
var ORDER_STATUS;
(function (ORDER_STATUS) {
    ORDER_STATUS["PENDING"] = "PENDING";
    ORDER_STATUS["IN_PROGRESS"] = "IN_PROGRESS";
    ORDER_STATUS["COMPLETED"] = "COMPLETED";
    ORDER_STATUS["CANCELED"] = "CANCELED";
})(ORDER_STATUS || (exports.ORDER_STATUS = ORDER_STATUS = {}));
var DINING_MODE;
(function (DINING_MODE) {
    DINING_MODE["DELIVERY"] = "Delivery";
    DINING_MODE["PICKUP"] = "Pickup";
})(DINING_MODE || (DINING_MODE = {}));
const OrderSchema = new mongoose_1.default.Schema({
    customer: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    restaurant: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    diningMode: { type: String, enum: DINING_MODE, required: true },
    items: [
        {
            item: {
                _id: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
                imageUrl: { type: String, required: true },
                name: { type: String, required: true },
                description: { type: String, required: false },
                category: { type: String, required: true },
                price: { type: Number, required: true },
                price_description: { type: String, required: false },
                uuid: { type: String, required: false }
            },
            quantity: { type: String, required: true }
        },
    ],
    variousFees: {
        subTotal: { type: Number, required: true },
        deliveryFee: { type: Number, required: true },
        serviceFee: { type: Number, required: true }
    },
    totalAmount: { type: Number, required: true },
    deliveryAddress: { type: String, required: true },
    customerLocation: {
        x: { type: Number, required: true },
        y: { type: Number, required: true }
    },
    courierInstructions: { type: String, required: false },
    vendorInstructions: { type: String, required: false },
    pickupTime: { type: String, required: false },
    status: { type: String, enum: ORDER_STATUS, required: true },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date }
});
const Order = mongoose_1.default.model('Order', OrderSchema);
exports.Order = Order;
