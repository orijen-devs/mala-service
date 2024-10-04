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
const createOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.body.user._id;
    const order = req.body.order;
    // handle payment sucessful
    console.log(order);
    console.log(customer);
    try {
        //check if order exists
        const existingPendingOrders = yield order_models_1.Order.find({ customer, restaurant: order.restaurant, status: order_models_1.ORDER_STATUS.PENDING });
        if (existingPendingOrders.length >= 3) {
            return res.json({ status: 403, message: 'too many pending orders' });
        }
        if (!order.restaurant) {
            return res.json({ status: 400, message: 'restaurant required' });
        }
        if (!order.items) {
            return res.json({ status: 400, message: 'items required' });
        }
        if (!order.variousFees) {
            return res.json({ status: 400, message: 'Various fees required' });
        }
        if (!order.totalAmount) {
            return res.json({ status: 400, message: 'Total amount required' });
        }
        if (!order.deliveryAddress) {
            return res.json({ status: 400, message: 'Delivery address required' });
        }
        if (!order.diningMode) {
            return res.json({ status: 400, message: 'Dining mode required' });
        }
        const newOrder = new order_models_1.Order({
            customer,
            restaurant: order.restaurant,
            items: order.items,
            diningMode: order.diningMode,
            variousFees: order.variousFees,
            totalAmount: order.totalAmount,
            deliveryAddress: order.deliveryAddress,
            courierInstructions: order.courierInstructions,
            customerLocation: order.customerLocation,
            vendorInstructions: order.vendorInstructions,
            pickupTime: order.pickupTime,
            status: order_models_1.ORDER_STATUS.PENDING
        });
        yield newOrder.save();
        req.body.orderId = newOrder._id;
        next();
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
