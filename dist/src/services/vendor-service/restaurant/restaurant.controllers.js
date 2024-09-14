"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const restaurant_models_1 = require("./restaurant.models");
const user_models_1 = __importStar(require("../../user-service/user.models"));
const listRestaurant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        console.log(data.menu);
        const existingRestaurant = yield restaurant_models_1.Restaurant.findOne({ owner_id: data.user_id });
        if (existingRestaurant) {
            console.log(existingRestaurant);
            return res.json({ status: 409, restaurant_exists: true, message: 'restaurant_exists' });
        }
        const restaurant = new restaurant_models_1.Restaurant(Object.assign({ owner_id: data.user_id }, data));
        yield restaurant.save();
        const menu = new restaurant_models_1.Menu({
            restaurant: restaurant._id,
            menuItems: data.menu.items
        });
        yield menu.save();
        yield user_models_1.default.findByIdAndUpdate(data.user_id, { role: user_models_1.ROLES.OWNER });
        res.json({ status: 201, restaurant_created: true, message: 'created' });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong while listing your restaurant' });
    }
});
const getAllRestaurants = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const restaurants = yield restaurant_models_1.Restaurant.find();
        if (!restaurants) {
            return res.json({ status: 404, not_found: true, message: 'no_restaurants' });
        }
        res.json(restaurants);
    }
    catch (error) {
        res.status(500).json({ server_error: true, message: 'An error occurred while fetching restaurants.' });
    }
});
const fetchRestaurantById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { restaurant_id } = req.params;
    try {
        const existingRestaurant = yield restaurant_models_1.Restaurant.findById(restaurant_id);
        if (!existingRestaurant) {
            return res.json({ status: 404, not_found: true, message: 'not_found' });
        }
        const menu = yield restaurant_models_1.Menu.findOne({ restaurant: restaurant_id });
        res.status(200).json({ restaurant: existingRestaurant, menu });
    }
    catch (error) {
        res.json({ status: 500, server_error: true, message: 'server_error' });
    }
});
exports.default = {
    listRestaurant,
    getAllRestaurants,
    fetchRestaurantById
};
