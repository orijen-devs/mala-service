"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
var TRANSACTION_STATUS;
(function (TRANSACTION_STATUS) {
    TRANSACTION_STATUS["SUCCESSFUL"] = "SUCCESSFUL";
    TRANSACTION_STATUS["FAILED"] = "FAILED";
    TRANSACTION_STATUS["EXPIRED"] = "EXPIRED";
})(TRANSACTION_STATUS || (TRANSACTION_STATUS = {}));
const TransactionSchema = new mongoose_1.default.Schema({
    customer: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    order: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Order', required: true },
    status: { type: String, enum: TRANSACTION_STATUS, required: true },
    dateInitiated: { type: String, required: true },
    dateConfirmed: { type: String, required: true }
});
const Transaction = mongoose_1.default.model('Transaction', TransactionSchema);
exports.Transaction = Transaction;
