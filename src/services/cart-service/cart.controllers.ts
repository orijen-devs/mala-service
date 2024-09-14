import { Request, Response } from "express"
import { Cart, CartItem } from "./cart.models"
 

// todo: 
// A function to create a new cart.
// To be called when the user wants to begin a new order from a different restaurant. 

// const createCart = async (req: Request, res: Response) => {

// }

const AddToCart = async (req: Request, res: Response) => {

    console.log(req.body)

    const restaurant = req.body.restau_id
    const customer = req.body.user._id
    const item = req.body.menuItem
    const quantity = req.body.quantity

    try {

        const existingCart = await Cart.findOne({ restaurant, customer })

        if (!existingCart) {

            const cart = new Cart({
                restaurant: req.body.restau_id,
                customer: req.body.user._id, 
                items: req.body.items
            })

            await cart.save()

            const cartItem = new CartItem({
                cart: cart._id,
                item: item._id,
                quantity, 
                date_added: Date.now()
            })
 
            await cartItem.save()

            res.json({ status: 200, cart_created: true, message: 'ok' })

        } else { 

        }


    } catch (error) {
        res.status(500).json({ message: 'An error occured while adding to cart' })
    }
}

const getCartItems = async (req: Request, res: Response) => {

    const { restau_id } = req.params
  
    console.log(restau_id)

    try {

        await Cart.findOne({ restaurant: restau_id }).then(async (cart) => {
            await CartItem.find({ cart: cart?.id }).then((cartItems) => {
                return res.json({ status: 200, cartItems })
            }).catch((err) => {
                return res.json({ status: 500, err})
            })
        }).catch((err) => {
            return res.json({ status: 500, err})
        })
        
    } catch (error) {
        res.status(500).json({ message: 'An error occured while getting items' })
    }
}

const getAllCarts = async (req: Request, res: Response) => {

}

export default {
    AddToCart,
    getAllCarts,
    getCartItems  
}