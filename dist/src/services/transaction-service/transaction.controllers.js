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
exports.paymentStatus = void 0;
const axios_1 = __importDefault(require("axios"));
const baseUrl = ' https://sandbox.fapshi.com';
const headers = {
    apiuser: '19be6f08-58c3-4c74-9f14-847e700adfa0',
    apikey: 'FAK_TEST_8210da833bc136a989c8'
};
const initiatePayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const paymentData = req.body;
    console.log(paymentData);
    const data = {
        amount: req.body.totalAmount,
        email: req.body.user.email,
        redirectUrl: 'http://localhost:3000'
    };
    try {
        if (!paymentData.totalAmount)
            return res.json({ status: 400, message: 'amount required' });
        if (!Number.isInteger(paymentData.amount))
            return res.json({ status: 400, message: 'amount must be a number' });
        if (paymentData.totalAmount < 100)
            return res.json({ status: 400, message: 'amount cannot be less than 100' });
        const config = {
            method: 'post',
            url: baseUrl + '/initiate-pay',
            headers: headers,
            data: data
        };
        const response = yield (0, axios_1.default)(config);
        response.data.statusCode = response.status;
        return res.json({ status: 200, data: response.data });
    }
    catch (error) {
        return res.status(500).json({ message: 'Internal server error. Attempting to resolve.' });
    }
});
const paymentStatus = (transId) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!transId || typeof transId !== 'string')
                resolve(Error('invalid type, string expected'));
            if (!/^[a-zA-Z0-9]{8,10}$/.test(transId))
                resolve(Error('invalid transaction id'));
            const config = {
                method: 'get',
                url: baseUrl + '/payment-status/' + transId,
                headers: headers
            };
            const response = yield (0, axios_1.default)(config);
            response.data.statusCode = response.status;
            resolve(response.data);
        }
        catch (error) {
            resolve(error);
        }
    }));
});
exports.paymentStatus = paymentStatus;
exports.default = {
    initiatePayment,
};
