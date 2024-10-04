import mongoose from "mongoose";

const MenuItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    price_description: { type: String, default: 'Per Plate' },
    imageUrl: { type: String, required: true },
    category: { type: String, required: true },
    quantity_in_stock: { type: Number },
    uiid: { type: String, required: true }
})

const MenuSchema = new mongoose.Schema({
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    name: { type: String, default: 'Main Menu' },
    menuItems: [MenuItemSchema]
})

const RestaurantSchema = new mongoose.Schema({
    owner_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
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
})


const Restaurant = mongoose.model('Restaurant', RestaurantSchema); 
const Menu = mongoose.model('Menu', MenuSchema);
const MenuItem = mongoose.model('MenuItem', MenuItemSchema)

export { Restaurant, Menu, MenuItem } 