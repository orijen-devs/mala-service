import express from 'express'
import transactionController from './transaction.controllers'
import { verifyAuth } from '../middleware/auth.middleware'
import orderController from '../order-service/order.controllers'

const router = express.Router()

router.post('/initiate-payment', verifyAuth, orderController.createOrder, transactionController.initiatePayment)

export default router