import { Request, Response } from "express";
import  { Menu, MenuItem, Restaurant }  from "./restaurant.models";
import User, { ROLES } from "../../user-service/user.models";

const listRestaurant = async (req: Request, res: Response) => {

    try {
       const data = req.body;

       console.log(data.menu)

       const existingRestaurant = await Restaurant.findOne({ owner_id: data.user_id });

       if (existingRestaurant) {
        console.log(existingRestaurant)
        return res.json({ status: 409, restaurant_exists: true, message: 'restaurant_exists' });
       }

       const restaurant = new Restaurant({
        owner_id: data.user_id,
        ...data
       }); 
       
       await restaurant.save()

       const menu = new Menu({
            restaurant: restaurant._id,
            menuItems: data.menu.items
        })

       await menu.save()

       await User.findByIdAndUpdate(data.user_id, { role: ROLES.OWNER })
  
       res.json({ status: 201, restaurant_created: true, message: 'created' })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Something went wrong while listing your restaurant' })
    }
}


const getAllRestaurants = async (req: Request, res: Response) => {
    try {
       const restaurants = await Restaurant.find()
        
       if(!restaurants) {
            return res.json({ status: 404, not_found: true, message: 'no_restaurants'})
       }
       
       res.json(restaurants)
    } catch (error) {
        
        res.status(500).json({ server_error: true, message: 'An error occurred while fetching restaurants.'})
    } 
}
 
const fetchRestaurantById = async (req: Request, res: Response) => {

    const { restaurant_id } = req.params

    try {
        const existingRestaurant = await Restaurant.findById(restaurant_id)

        if (!existingRestaurant) {
            return res.json({ status: 404, not_found: true, message: 'not_found'})
        }

        const menu = await Menu.findOne({ restaurant: restaurant_id })

        res.status(200).json({ restaurant: existingRestaurant, menu })
        
    } catch (error) {
        res.json({ status: 500, server_error: true, message: 'server_error' })
    }

}

export default {
    listRestaurant,
    getAllRestaurants,
    fetchRestaurantById
}