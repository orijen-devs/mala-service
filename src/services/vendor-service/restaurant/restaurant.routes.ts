import express, { Request, Response } from 'express'
import restaurantController from './restaurant.controllers'
import { verifyAuth } from '../../middleware/auth.middleware'

const router = express.Router()

// All these roads lead to the restaurant resource. 
// They are protected by malam, the service gateman :).

router.post('/create-restaurant', verifyAuth, restaurantController.listRestaurant)
router.get('/get-all-restaurants', restaurantController.getAllRestaurants)
router.get('/get-restaurant-details/:restaurant_id', restaurantController.fetchRestaurantById)

router.get('/my-restaurant/:owner_id', verifyAuth, (req: Request, res: Response) => {
       
}) 
export default router 