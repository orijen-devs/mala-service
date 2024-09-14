"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const restaurant_controllers_1 = __importDefault(require("./restaurant.controllers"));
const auth_middleware_1 = require("../../middleware/auth.middleware");
const router = express_1.default.Router();
// All these roads lead to the restaurant resource. 
// They are protected by malam, the service gateman :).
router.post('/create-restaurant', auth_middleware_1.verifyAuth, restaurant_controllers_1.default.listRestaurant);
router.get('/get-all-restaurants', restaurant_controllers_1.default.getAllRestaurants);
router.get('/get-restaurant-details/:restaurant_id', restaurant_controllers_1.default.fetchRestaurantById);
router.get('/my-restaurant/:owner_id', auth_middleware_1.verifyAuth, (req, res) => {
});
exports.default = router;
