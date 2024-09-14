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
const user_models_1 = __importDefault(require("./user.models"));
const Twilio_1 = __importDefault(require("twilio/lib/rest/Twilio"));
const generateToken_1 = require("../../utils/generateToken");
const bcrypt_1 = __importDefault(require("bcrypt"));
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // check if user exists
    // user exists, return 'user exists' to client
    // else create user
    // return user object to client
    try {
        const { email } = req.body;
        const existingUser = yield user_models_1.default.findOne({ email });
        if (existingUser && existingUser.isAccountActive == false) {
            res.json({ status: 409, user_exists_not_verified: true, message: 'This user already exists but is not verified. Request authentication code and verify.' });
            return;
        }
        if (existingUser && existingUser.isAccountActive == true) {
            res.json({ status: 409, user_exists_verified: true, message: 'This user already exists and is verified.' });
            return;
        }
        const newUser = new user_models_1.default(req.body);
        yield newUser.save();
        res.status(201).json(newUser.toObject());
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ server_error: true, message: 'Something unexpected happened. Please try again.' });
    }
});
const requestNewUserOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const client = new Twilio_1.default(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_ACCOUNT_AUTH_TOKEN);
        if (data.phone_number) {
            const phone_number = '+237' + data.phone_number;
            yield client.verify.v2.services(process.env.TWILIO_SERVICE_ID)
                .verifications
                .create({ to: `${phone_number}`, channel: 'sms' })
                .then(verification => console.log(verification));
            res.status(200).json({ message: 'sms' });
        }
        if (data.email) {
            yield client.verify.v2.services(process.env.TWILIO_SERVICE_ID)
                .verifications
                .create({ to: `${data.email}`, channel: 'email' })
                .then(verification => console.log(verification));
            res.status(200).json({ message: 'email' });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something unexpected happened. Please try again.' });
    }
});
const requestAuthOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { phone_number } = req.body;
        const twilio_phone_number = '+237' + phone_number;
        const client = new Twilio_1.default(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_ACCOUNT_AUTH_TOKEN);
        const existingUser = yield user_models_1.default.findOne({ phone_number });
        if (!existingUser) {
            return res.json({ status: 404, not_found: true, message: 'not_found' });
        }
        else {
            try {
                yield client.verify.v2.services(process.env.TWILIO_SERVICE_ID)
                    .verifications
                    .create({ to: `${twilio_phone_number}`, channel: 'sms' })
                    .then(verification => console.log(verification));
                res.status(200).json({ message: 'message_sent' });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Server_error' });
            }
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something unexpected happened. Please try again.' });
    }
});
const activateUserAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_models_1.default.findOneAndUpdate({ phone_number: req.body.phone_number }, { $set: { isAccountActive: true } });
        if (!user) {
            return res.json({ status: 400, bad_request: true, message: 'invalid_user_data' });
        }
        else {
            (0, generateToken_1.generateToken)(res, user.id);
            res.status(200).json({ message: 'user_acc_activated' });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'server_error' });
    }
});
const authenticateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { phone_number, password } = req.body;
    if (phone_number == undefined || phone_number == '' || password == undefined || password == '') {
        return res.json({ status: 400, bad_request: true, message: 'bad_request' });
    }
    const twilio_phone_number = '+237' + phone_number;
    const existingUser = yield user_models_1.default.findOne({ phone_number });
    if (!existingUser) {
        return res.json({ status: 401, unauthorized: true, message: 'unauthorized_access' });
    }
    if (!existingUser.isAccountActive) {
        return res.json({ acc_inactive: true, message: 'acc_inactive' });
    }
    const client = new Twilio_1.default(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_ACCOUNT_AUTH_TOKEN);
    yield bcrypt_1.default.compare(password, existingUser.password, (error, result) => __awaiter(void 0, void 0, void 0, function* () {
        if (result == false) {
            res.json({ status: 403, invalid_credentials: true, message: 'invalid_auth_credentials' });
        }
        else {
            try {
                yield client.verify.v2.services(process.env.TWILIO_SERVICE_ID)
                    .verifications
                    .create({ to: `${twilio_phone_number}`, channel: 'sms' })
                    .then(verification => console.log(verification));
                res.json({ status: 200, authenticated: true, verification_status: 'pending', message: 'user_authenticated' });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Server_error' });
            }
        }
    }));
});
const verifyOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { pin, phone_number } = req.body;
    const twilio_phone_number = '+237' + phone_number;
    const existingUser = yield user_models_1.default.findOne({ phone_number }).select('-password');
    if (!existingUser) {
        return res.json({ status: 401, unauthorized: true, message: 'unauthorized_access' });
    }
    if (!existingUser.isAccountActive) {
        return res.json({ acc_inactive: true, message: 'acc_inactive' });
    }
    const client = new Twilio_1.default(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_ACCOUNT_AUTH_TOKEN);
    try {
        yield client.verify.v2.services(process.env.TWILIO_SERVICE_ID)
            .verificationChecks
            .create({ to: `${twilio_phone_number}`, code: `${pin}` })
            .then(verification_check => {
            switch (verification_check.status) {
                case 'approved':
                    (0, generateToken_1.generateToken)(res, existingUser.id);
                    return res.json({ phone_number_verified: true, message: 'phone_number_verified', existingUser });
                case 'pending':
                    return res.json({ status: 403, incorrect_otp: true, message: verification_check.status });
            }
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something unexpected happened.' });
    }
});
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.cookie('acc_tk', '', {
            httpOnly: true,
            expires: new Date(0),
        });
        res.status(200).json({ logged_out: true, message: 'user_logged_out' });
    }
    catch (error) {
        res.status(500).json({ server_error: true });
    }
});
exports.default = {
    createUser,
    requestNewUserOTP,
    activateUserAccount,
    requestAuthOTP,
    authenticateUser,
    verifyOtp,
    logout
};
