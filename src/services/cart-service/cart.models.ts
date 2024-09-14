import mongoose from "mongoose";

const CartItemSchema = new mongoose.Schema({
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
    quantity: { type: String, required: true },
}) 

const CartSchema = new mongoose.Schema({
    restaurant: { type: String, ref: 'Restaurant', required: true },
    customer: { type: String, ref: 'User', required: true },
    items: [CartItemSchema],
    created_at: { type: Date },
    updated_at: { type: Date }
})
 
const Cart = mongoose.model('Cart', CartSchema)
const CartItem = mongoose.model('CartItem', CartItemSchema)

export {Cart, CartItem} 