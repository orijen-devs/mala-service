import { Request, Response } from "express"
import { Order, ORDER_STATUS } from "./order.models"

const createOrder = async (req: Request, res: Response) => {
    // handle payment sucessful
    try {
        const order = req.body.order

        const newOrder = new Order({
            customer: order.customer,
            restaurant: order.restaurant,
            items: order.items,
            variousFees: order.variousFees,
            totalAmount: order.totalAmount,
            deliveryAddress: order.deliveryAddress,
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