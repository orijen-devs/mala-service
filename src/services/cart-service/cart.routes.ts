import express from 'express'
import cartController from './cart.controllers'
import { verifyAuth } from '../middleware/auth.middleware'

const router = express.Router()

router.post('/add-to-cart', verifyAuth, cartController.AddToCart)
router.get('/get-cart-items/:restau_id', verifyAuth, cartController.getCartItems)

export default router