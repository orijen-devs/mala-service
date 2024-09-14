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
const OrderSchema = new mongoose_1.default.Schema({
    customer: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    restaurant: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    items: [
        {
            item: {
                _id: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
                imageUrl: { type: String, required: true },
                name: { type: String, required: true },
                category: { type: String, required: true },
                price: { type: Number, required: true }
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
    deliveryAddress: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, default: 'South-West Region' }
    },
    customerLocation: {
        x: { type: String, required: true },
        y: { type: String, required: true }
    },
    courierInstructions: { type: String, required: false },
    vendorInstructions: { type: String, required: false },
    status: { type: String, enum: ORDER_STATUS, required: true },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date }
});
const Order = mongoose_1.default.model('Order', OrderSchema);
exports.Order = Order;
