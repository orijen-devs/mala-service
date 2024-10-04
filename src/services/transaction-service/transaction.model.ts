import mongoose from "mongoose";

enum TRANSACTION_STATUS {
    SUCCESSFUL = 'SUCCESSFUL',
    FAILED = 'FAILED',
    EXPIRED = 'EXPIRED'
}

const TransactionSchema = new mongoose.Schema({
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    status: { type: String, enum: TRANSACTION_STATUS, required: true },
    dateInitiated: { type: String, required: true },
    dateConfirmed: { type: String, required: true }
})

const Transaction = mongoose.model('Transaction', TransactionSchema)

export { Transaction }