import axios from "axios";
import { PaymentData } from "../../../types";
import { Request, Response } from "express";

const baseUrl = ' https://sandbox.fapshi.com'
const headers = {
    apiuser: '19be6f08-58c3-4c74-9f14-847e700adfa0',
    apikey: 'FAK_TEST_8210da833bc136a989c8'
}

const initiatePayment = async(req: Request, res: Response) => {
    const paymentData = req.body
    console.log(paymentData)

    const data = {
        amount: req.body.totalAmount,
        email: req.body.user.email,
        redirectUrl: 'http://localhost:3000'
    }
    
    try {

        if (!paymentData.totalAmount) 
            return res.json({ status: 400, message: 'amount required' })

        if (!Number.isInteger(paymentData.amount)) 
            return res.json({ status: 400, message: 'amount must be a number' })
        
        if (paymentData.totalAmount < 100)
            return res.json({ status: 400, message: 'amount cannot be less than 100'})

        const config = {
            method: 'post',
            url: baseUrl+'/initiate-pay',
            headers: headers,
            data: data
        }

        const response = await axios(config) 

        response.data.statusCode = response.status

        return res.json({ status: 200, data: response.data })

    } catch (error) {

        return res.status(500).json({ message: 'Internal server error. Attempting to resolve.' })

    }
}

export const paymentStatus = async (transId: string) => {
    return new Promise(async (resolve) => {
        try {
            if(!transId || typeof transId !== 'string')
                resolve(Error('invalid type, string expected'))
            if(!/^[a-zA-Z0-9]{8,10}$/.test(transId))
                resolve(Error('invalid transaction id'))

            const config = {
                method: 'get',
                url: baseUrl+'/payment-status/'+transId,
                headers: headers
            }
            const response = await axios(config)
            response.data.statusCode = response.status
            resolve(response.data)
        } catch (error) {
            resolve(error)
        }
    })
}

export default {
    initiatePayment,
}