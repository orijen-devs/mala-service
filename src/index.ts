import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import mongoose from 'mongoose'
import CookieParser from 'cookie-parser'

import userRoutes from './services/user-service/user.routes'
import restaurantRoutes from './services/vendor-service/restaurant/restaurant.routes'
import cartRoutes from './services/cart-service/cart.routes'
import orderRoutes from './services/order-service/order.routes'
import transactionRoutes from './services/transaction-service/transaction.routes'
import { paymentStatus } from './services/transaction-service/transaction.controllers'
import { Transaction } from './services/transaction-service/transaction.model'


const bodyParser = require("body-parser")


mongoose.connect(process.env.MONGODB_CONNECT_STRING as string).then(() =>
    console.log('Connected to mala cluster')
)

const app = express()

app.use(express.json())
app.use(CookieParser())

app.getMaxListeners
app.use(bodyParser.urlencoded({ extended: true }));
//automatically converts body of all requests to json

app.use(cors({
    origin: ['http://localhost:3000', 'https://sandbox.fapshi.com'],
    credentials: true
}))


// redirects all user requests to userRoutes handler
app.use('/user-service/user', userRoutes)
app.use('/vendor-service/restaurant', restaurantRoutes)
app.use('/cart-service/cart', cartRoutes)
app.use('/order-service/order', orderRoutes)
app.use('/transaction-service/transaction', transactionRoutes)

app.post('/mala-webhook', async (req, res) => {

    console.log(req.body)
    const event: any = await paymentStatus(req.body.transId)

    if(event.statusCode !== 200)
        return res.status(400).json({message: event.message});
    
      // Handle the event
      switch (event.status) {
        case 'SUCCESSFUL':
          // Then define and call a function to handle a SUCCESSFUL payment
          console.log(event, 'successful');
          const transaction = new Transaction({
            transactionId: req.body.transId,
            customer: req.body.userId,
            status: req.body.status,
            order: req.body.externalId,
            dateInitiated: req.body.dateInitiated,
            dateConfirmed: req.body.dateConfirmed
          })

          await transaction.save()
          break;
        case 'FAILED':
          // Then define and call a function to handle a FAILED payment
          console.log(event, 'failed');
          break;
        case 'EXPIRED':
          // Then define and call a function to handle an expired transaction
          console.log(event, 'expired');
          break; 
        // ... handle other event types
        default:
          console.log(`Unhandled event status: ${event.type}`);
        }

    res.send('ok')

})


app.listen(5000, () => {

    // const options = {
    //     port: 3000, 
    //     host: '127.0.0.1',
    // }
  
    // const req = http.request(options)

    // req.setTimeout(50000, () => {
    //     process.exit(0)
    // })

    console.log("Serving you from port 5000.")
}) 