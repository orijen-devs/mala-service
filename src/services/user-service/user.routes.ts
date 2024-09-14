import express from 'express'
import userController from './user.controllers'


import { verifyAuthCode } from '../middleware/verify-auth-code'

const router = express.Router()

// /api/user
router.post('/create-user', userController.createUser)
router.post('/new-user/request-otp', userController.requestNewUserOTP)
router.post('/new-user/activate-user-account', verifyAuthCode, userController.activateUserAccount)
router.post('/authenticate', userController.authenticateUser)
router.post('/verify-otp', userController.verifyOtp)
router.post('/logout', userController.logout)

export default router