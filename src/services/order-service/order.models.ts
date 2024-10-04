import mongoose from "mongoose";

export enum ORDER_STATUS {
    PENDING = 'PENDING',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    CANCELED = 'CANCELED'
}

const OrderSchema = new mongoose.Schema({
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    items: [
        { 
            item: { 
                _id: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true  },
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
})


const Order = mongoose.model('Order', OrderSchema); 

export { Order } 