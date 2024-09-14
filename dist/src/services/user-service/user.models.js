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
exports.ROLES = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
var ROLES;
(function (ROLES) {
    ROLES["USER"] = "USER";
    ROLES["OWNER"] = "OWNER";
    ROLES["ADMIN"] = "ADMIN";
    ROLES["COURIER"] = "COURIER";
})(ROLES || (exports.ROLES = ROLES = {}));
const UserSchema = new mongoose_1.default.Schema({
    // todo: create index for user schema to optimize performance;
    // todo: encrypt and store user password pre-save; (done)
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    phone_number: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isAccountActive: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: ROLES,
        required: true,
        default: ROLES.USER
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});
UserSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const salt = yield bcrypt_1.default.genSalt();
        this.password = yield bcrypt_1.default.hash(this.password, salt);
        next();
    });
});
const User = mongoose_1.default.model('User', UserSchema);
exports.default = User;
