import { NextFunction, Request, Response } from "express"
import Twilio from "twilio/lib/rest/Twilio";

export const verifyAuthCode = async (req: Request, res: Response, next: NextFunction) => {

    const { pin, phone_number } = req.body;
    const twilio_phone_number = '+237' + phone_number

    console.log(twilio_phone_number)

    const client = new Twilio(process.env.TWILIO_ACCOUNT_SID as string, process.env.TWILIO_ACCOUNT_AUTH_TOKEN as string)

    try {

        await client.verify.v2.services(process.env.TWILIO_SERVICE_ID as string)
            .verificationChecks
            .create({to: `${twilio_phone_number}`, code: `${pin}`})
            .then(verification_check => {

                switch (verification_check.status) {
                    case 'approved':
                        next()
                        break;
                    case 'pending':
                        return res.json({ message: verification_check.status })
                }
            });

    } catch (error) {

        console.log(error) 
        res.status(500).json({ message: 'Something unexpected happened.' })
        
    }
} 