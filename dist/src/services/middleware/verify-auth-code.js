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
exports.verifyAuthCode = void 0;
const Twilio_1 = __importDefault(require("twilio/lib/rest/Twilio"));
const verifyAuthCode = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { pin, phone_number } = req.body;
    const twilio_phone_number = '+237' + phone_number;
    console.log(twilio_phone_number);
    const client = new Twilio_1.default(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_ACCOUNT_AUTH_TOKEN);
    try {
        yield client.verify.v2.services(process.env.TWILIO_SERVICE_ID)
            .verificationChecks
            .create({ to: `${twilio_phone_number}`, code: `${pin}` })
            .then(verification_check => {
            switch (verification_check.status) {
                case 'approved':
                    next();
                    break;
                case 'pending':
                    return res.json({ message: verification_check.status });
            }
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something unexpected happened.' });
    }
});
exports.verifyAuthCode = verifyAuthCode;
