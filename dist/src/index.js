"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const mongoose_1 = __importDefault(require("mongoose"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const user_routes_1 = __importDefault(require("./services/user-service/user.routes"));
const restaurant_routes_1 = __importDefault(require("./services/vendor-service/restaurant/restaurant.routes"));
const cart_routes_1 = __importDefault(require("./services/cart-service/cart.routes"));
const order_routes_1 = __importDefault(require("./services/order-service/order.routes"));
const transaction_routes_1 = __importDefault(require("./services/transaction-service/transaction.routes"));
const transaction_controllers_1 = require("./services/transaction-service/transaction.controllers");
const transaction_model_1 = require("./services/transaction-service/transaction.model");
const bodyParser = require("body-parser");
mongoose_1.default.connect(process.env.MONGODB_CONNECT_STRING).then(() => console.log('Connected to mala cluster'));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.getMaxListeners;
app.use(bodyParser.urlencoded({ extended: true }));
//automatically converts body of all requests to json
app.use((0, cors_1.default)({
    origin: ['http://localhost:3000', 'https://sandbox.fapshi.com'],
    credentials: true
}));
// redirects all user requests to userRoutes handler
app.use('/user-service/user', user_routes_1.default);
app.use('/vendor-service/restaurant', restaurant_routes_1.default);
app.use('/cart-service/cart', cart_routes_1.default);
app.use('/order-service/order', order_routes_1.default);
app.use('/transaction-service/transaction', transaction_routes_1.default);
app.post('/mala-webhook', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const event = yield (0, transaction_controllers_1.paymentStatus)(req.body.transId);
    if (event.statusCode !== 200)
        return res.status(400).json({ message: event.message });
    // Handle the event
    switch (event.status) {
        case 'SUCCESSFUL':
            // Then define and call a function to handle a SUCCESSFUL payment
            console.log(event, 'successful');
            const transaction = new transaction_model_1.Transaction({
                transactionId: req.body.transId,
                customer: req.body.userId,
                status: req.body.status,
                order: req.body.externalId,
                dateInitiated: req.body.dateInitiated,
                dateConfirmed: req.body.dateConfirmed
            });
            yield transaction.save();
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
    res.send('ok');
}));
app.listen(5000, () => {
    // const options = {
    //     port: 3000, 
    //     host: '127.0.0.1',
    // }
    // const req = http.request(options)
    // req.setTimeout(50000, () => {
    //     process.exit(0)
    // })
    console.log("Serving you from port 5000.");
});
