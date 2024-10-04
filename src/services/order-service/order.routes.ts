import express from 'express'
import orderController from './order.controllers'
import { verifyAuth } from '../middleware/auth.middleware'

const router = express.Router()

router.post('/create-order', verifyAuth, orderController.createOrder)
router.post('/cancel-order/:orderId', verifyAuth, orderController.cancelOrder)
 
export default router 