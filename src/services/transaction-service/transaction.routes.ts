import express from 'express'
import transactionController from './transaction.controllers'
import { verifyAuth } from '../middleware/auth.middleware'

const router = express.Router()

router.post('/initiate-payment', verifyAuth, transactionController.initiatePayment)

export default router