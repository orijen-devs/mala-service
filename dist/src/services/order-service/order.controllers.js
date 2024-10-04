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
Object.defineProperty(exports, "__esModule", { value: true });
const order_models_1 = require("./order.models");
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // handle payment sucessful
    try {
        const order = req.body.order;
        const newOrder = new order_models_1.Order({
            customer: order.customer,
            restaurant: order.restaurant,
            items: order.items,
            variousFees: order.variousFees,
            totalAmount: order.totalAmount,
            deliveryAddress: order.deliveryAddress,
            status: order_models_1.ORDER_STATUS.PENDING
        });
        yield newOrder.save();
        return res.json({ status: 200, message: 'ok' });
    }
    catch (error) {
        return res.json({ status: 500, message: 'server_error' });
    }
});
const cancelOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId } = req.params;
    try {
        const updatedOrder = order_models_1.Order.findByIdAndUpdate(orderId, { status: order_models_1.ORDER_STATUS.CANCELED });
        if (!updatedOrder) {
            return res.json({ status: 404, message: 'not_found' });
        }
        return res.json({ status: 200, message: 'canceled' });
    }
    catch (error) {
        return res.json({ status: 500, message: 'server_error' });
    }
});
exports.default = {
    createOrder,
    cancelOrder
};
