"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuItem = exports.Menu = exports.Restaurant = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const MenuItemSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    price_description: { type: String, default: 'Per Plate' },
    imageUrl: { type: String, required: true },
    category: { type: String, required: true },
    quantity_in_stock: { type: Number },
    uiid: { type: String, required: true }
});
const MenuSchema = new mongoose_1.default.Schema({
    restaurant: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    name: { type: String, default: 'Main Menu' },
    menuItems: [MenuItemSchema]
});
const RestaurantSchema = new mongoose_1.default.Schema({
    owner_id: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    description: { type: String },
    address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, default: 'South-West Region' }
    },
    businessPhoneNumberOne: { type: String, required: true },
    businessPhoneNumberTwo: { type: String, required: true },
    location: {
        x: { type: String, required: true },
        y: { type: String, required: true }
    },
    open: { type: String, required: true },
    close: { type: String, required: true },
    cuisines: [{ type: String, required: true }],
    imageURL: { type: String, required: true },
    createdAt: { type: Date, default: Date.now() }
});
const Restaurant = mongoose_1.default.model('Restaurant', RestaurantSchema);
exports.Restaurant = Restaurant;
const Menu = mongoose_1.default.model('Menu', MenuSchema);
exports.Menu = Menu;
const MenuItem = mongoose_1.default.model('MenuItem', MenuItemSchema);
exports.MenuItem = MenuItem;
