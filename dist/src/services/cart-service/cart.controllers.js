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
const cart_models_1 = require("./cart.models");
// todo: 
// A function to create a new cart.
// To be called when the user wants to begin a new order from a different restaurant. 
// const createCart = async (req: Request, res: Response) => {
// }
const AddToCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const restaurant = req.body.restau_id;
    const customer = req.body.user._id;
    const item = req.body.menuItem;
    const quantity = req.body.quantity;
    try {
        const existingCart = yield cart_models_1.Cart.findOne({ restaurant, customer });
        if (!existingCart) {
            const cart = new cart_models_1.Cart({
                restaurant: req.body.restau_id,
                customer: req.body.user._id,
                items: req.body.items
            });
            yield cart.save();
            const cartItem = new cart_models_1.CartItem({
                cart: cart._id,
                item: item._id,
                quantity,
                date_added: Date.now()
            });
            yield cartItem.save();
            res.json({ status: 200, cart_created: true, message: 'ok' });
        }
        else {
        }
    }
    catch (error) {
        res.status(500).json({ message: 'An error occured while adding to cart' });
    }
});
const getCartItems = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { restau_id } = req.params;
    console.log(restau_id);
    try {
        yield cart_models_1.Cart.findOne({ restaurant: restau_id }).then((cart) => __awaiter(void 0, void 0, void 0, function* () {
            yield cart_models_1.CartItem.find({ cart: cart === null || cart === void 0 ? void 0 : cart.id }).then((cartItems) => {
                return res.json({ status: 200, cartItems });
            }).catch((err) => {
                return res.json({ status: 500, err });
            });
        })).catch((err) => {
            return res.json({ status: 500, err });
        });
    }
    catch (error) {
        res.status(500).json({ message: 'An error occured while getting items' });
    }
});
const getAllCarts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
});
exports.default = {
    AddToCart,
    getAllCarts,
    getCartItems
};
