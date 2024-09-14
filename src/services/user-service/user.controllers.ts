import { Request, Response } from "express";
import User from "./user.models";
import Twilio from "twilio/lib/rest/Twilio";
import { generateToken } from "../../utils/generateToken";
import bcrypt from 'bcrypt';


const createUser = async (req: Request, res: Response ) => {
    
    // check if user exists
    // user exists, return 'user exists' to client
    // else create user
    // return user object to client

     try {

        const { email } = req.body; 
        const existingUser = await User.findOne({ email });

        if (existingUser && existingUser.isAccountActive == false) {
            res.json({ status: 409, user_exists_not_verified: true, message: 'This user already exists but is not verified. Request authentication code and verify.' });

            return ;
        }

        if (existingUser && existingUser.isAccountActive == true) {
            res.json({ status: 409, user_exists_verified: true, message: 'This user already exists and is verified.' });

            return ;
        } 

        const newUser = new User(req.body);
        await newUser.save();

        res.status(201).json(newUser.toObject())

     } catch (error) {
        
        console.log(error);
        res.status(500).json({ server_error: true, message: 'Something unexpected happened. Please try again.' });
          
     }
}

const requestNewUserOTP = async (req: Request, res: Response) => {

    try {

        const data = req.body
        const client = new Twilio(process.env.TWILIO_ACCOUNT_SID as string, process.env.TWILIO_ACCOUNT_AUTH_TOKEN as string)

        if (data.phone_number) {
            const phone_number = '+237' + data.phone_number;          

            await client.verify.v2.services(process.env.TWILIO_SERVICE_ID as string)
                            .verifications
                            .create({ to:`${phone_number}`, channel: 'sms' })
                            .then(verification => console.log(verification))

            res.status(200).json({ message: 'sms' })
        }

        if (data.email) {
            await client.verify.v2.services(process.env.TWILIO_SERVICE_ID as string)
                            .verifications
                            .create({ to:`${data.email}`, channel: 'email' })
                            .then(verification => console.log(verification))
            
            res.status(200).json({ message: 'email' })
        }

    } catch (error) { 
        
        console.log(error)

        res.status(500).json({ message: 'Something unexpected happened. Please try again.'})
    }
}

const requestAuthOTP = async (req: Request, res: Response) => {

    try {

        const { phone_number } = req.body
        const twilio_phone_number = '+237' + phone_number 

        const client = new Twilio(process.env.TWILIO_ACCOUNT_SID as string, process.env.TWILIO_ACCOUNT_AUTH_TOKEN as string)

        const existingUser = await User.findOne({ phone_number })

        if (!existingUser) {

            return res.json({ status: 404, not_found: true, message:'not_found' })

        } else {

            try {
                await client.verify.v2.services(process.env.TWILIO_SERVICE_ID as string)
                .verifications
                .create({ to:`${twilio_phone_number}`, channel: 'sms'})
                .then(verification => console.log(verification))
    
                res.status(200).json({ message: 'message_sent' }) 
            } catch (error) {
                console.log(error)
                res.status(500).json({ message: 'Server_error'})
            }

        }

    } catch (error) {
        console.log(error)

        res.status(500).json({ message: 'Something unexpected happened. Please try again.'})
    }
}

const activateUserAccount = async (req: Request, res: Response) => {

    try { 
        const user = await User.findOneAndUpdate({ phone_number: req.body.phone_number }, { $set: { isAccountActive: true } })

        if (!user) {
            return res.json({ status: 400, bad_request: true, message: 'invalid_user_data' })
        } else {
            generateToken(res, user.id)
            res.status(200).json({ message: 'user_acc_activated' })
        }

    } 
    catch (error) 
    {
        console.log(error)
        res.status(500).json({ message: 'server_error' })
    }
}

const authenticateUser = async (req: Request, res: Response) => {

    const { phone_number, password } = req.body;

    if (phone_number == undefined || phone_number == '' || password == undefined || password == '') {
        return res.json({ status: 400, bad_request: true, message: 'bad_request' })
    }

    const twilio_phone_number = '+237' + phone_number 
    const existingUser = await User.findOne({ phone_number })

    if (!existingUser) {
        return res.json({ status: 401, unauthorized: true, message: 'unauthorized_access'})
    }

    if (!existingUser.isAccountActive) {
        return res.json({ acc_inactive: true, message: 'acc_inactive' })
    }

    const client = new Twilio(process.env.TWILIO_ACCOUNT_SID as string, process.env.TWILIO_ACCOUNT_AUTH_TOKEN as string)

    await bcrypt.compare(password, existingUser.password, async (error, result) => {

        if (result == false) {

            res.json({ status: 403, invalid_credentials: true, message: 'invalid_auth_credentials' })

        } else {
            
            try {
                await client.verify.v2.services(process.env.TWILIO_SERVICE_ID as string)
                .verifications
                .create({ to:`${twilio_phone_number}`, channel: 'sms'})
                .then(verification => console.log(verification))
    
                res.json({ status: 200, authenticated: true, verification_status: 'pending', message: 'user_authenticated' }) 
            } catch (error) {
                console.log(error)
                res.status(500).json({ message: 'Server_error'})
            }


        }

    })
}

const verifyOtp = async (req: Request, res: Response) => {

    const { pin, phone_number } = req.body;
    const twilio_phone_number = '+237' + phone_number

    const existingUser = await User.findOne({ phone_number }).select('-password')

    if (!existingUser) {
        return res.json({ status: 401, unauthorized: true, message: 'unauthorized_access'})
    }

    if (!existingUser.isAccountActive) {
        return res.json({ acc_inactive: true, message: 'acc_inactive' })
    }

    const client = new Twilio(process.env.TWILIO_ACCOUNT_SID as string, process.env.TWILIO_ACCOUNT_AUTH_TOKEN as string)

    try {

        await client.verify.v2.services(process.env.TWILIO_SERVICE_ID as string)
            .verificationChecks
            .create({to: `${twilio_phone_number}`, code: `${pin}`})
            .then(verification_check => {

                switch (verification_check.status) {

                    case 'approved':

                        generateToken(res, existingUser.id)

                        return res.json({ phone_number_verified: true,  message: 'phone_number_verified', existingUser })
                        
                    case 'pending':
                        return res.json({ status: 403, incorrect_otp: true, message: verification_check.status })
                }
            }); 
    } catch (error) {
        console.log(error) 
        res.status(500).json({ message: 'Something unexpected happened.' })
    }
}

const logout = async (req: Request, res: Response) => {

    try {
        res.cookie('acc_tk', '', {
            httpOnly: true, 
            expires: new Date(0),
        });
        res.status(200).json({ logged_out: true, message: 'user_logged_out' });
    } catch (error) {
        res.status(500).json({ server_error: true })
    }
    
}


export default { 
    createUser,
    requestNewUserOTP,
    activateUserAccount,
    requestAuthOTP,
    authenticateUser,
    verifyOtp,
    logout
}