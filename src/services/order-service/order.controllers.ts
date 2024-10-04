import { Request, Response } from "express"
import { Order, ORDER_STATUS } from "./order.models"

const createOrder = async (req: Request, res: Response) => {
    const customer = req.body.user._id
    const order = req.body.order
    // handle payment sucessful

    console.log(order)

    try {

        //check if order exists
        const existingPendingOrders = await Order.find({ customer, restaurant: order.restaurant, status: ORDER_STATUS.PENDING })

        if (existingPendingOrders.length >= 3) {
            return res.json({ status: 403, message: 'too many pending orders' })
        }

        if(!order.restaurant) {
            return res.json({ status: 400, message: 'restaurant required' })
        }

        if(!order.items) {
            return res.json({ status: 400, message: 'items required' })
        }

        if(!order.variousFees) {
            return res.json({ status: 400, message: 'Various fees required' })
        }

        if(!order.totalAmount) {
            return res.json({ status: 400, message: 'Total amount required' })
        }

        if(!order.deliveryAddress) {
            return res.json({ status: 400, message: 'Delivery address required' })
        }

        if(!order.diningMode) {
            return res.json({ status: 400, message: 'Dining mode required'})
        }

        const newOrder = new Order({
            customer,
            restaurant: order.restaurant,
            items: order.items,
            diningMode: order.diningMode,
            variousFees: order.variousFees,
            totalAmount: order.totalAmount,
            deliveryAddress: order.deliveryAddress,
            courierInstructions: order.courierInstructions,
            vendorInstructions: order.vendorInstructions,
            pickupTime: order.pickupTime,
            status: ORDER_STATUS.PENDING
        })
    
        await newOrder.save()
    
        return res.json({ status: 200, message: 'ok' })
        
    } catch (error) {
        return res.json({ status: 500, message: 'server_error' })
    }
}

const cancelOrder = async (req: Request, res: Response) => {
 
    const { orderId } = req.params

    try {

        const updatedOrder = Order.findByIdAndUpdate(orderId, { status: ORDER_STATUS.CANCELED })

        if (!updatedOrder) {
            return res.json({ status: 404, message: 'not_found' })
        }

        return res.json({ status: 200, message: 'canceled' })

    } catch (error) {
        return res.json({ status: 500, message: 'server_error' })
    }
}
 
export default {
    createOrder,
    cancelOrder
}