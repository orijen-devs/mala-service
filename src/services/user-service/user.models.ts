import mongoose from "mongoose";
import bcrypt from 'bcrypt'

export enum ROLES {
   USER = 'USER',
   OWNER = 'OWNER',
   ADMIN = 'ADMIN',
   COURIER = 'COURIER'
}

const UserSchema = new mongoose.Schema({

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
})

UserSchema.pre('save', async function (this, next) {
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

const User = mongoose.model('User', UserSchema)
export default User