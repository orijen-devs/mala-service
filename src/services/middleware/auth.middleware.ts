import { NextFunction, Request, Response } from "express"
import jwt from 'jsonwebtoken'
import User from "../user-service/user.models"

// Mala's gateman. Responsible for checking credentials from the client
// before granting access to protected resources
export const verifyAuth = async (req: Request, res: Response, next: NextFunction) => {

    let access_token

    access_token = req.cookies.acc_tk

    console.log(access_token)

    if(!access_token) { 
        return res.json({ status: 401, forbidden: true, message: 'unauthorized_access' })
    }

    //resolve issue where jwt cannot read token from .env
    jwt.verify(access_token, 'secret-key', async (err: any, decoded: any) => {
        if(err) {
            return res.json({ status: 403, token_valid: false, message: 'invalid_token' })
        } else {
            req.body.user = await User.findById(decoded.user).select('-password')
            next()
        }
    })
}

