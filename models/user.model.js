// Mongoose schema for User with password hashing and JWT methods
import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        minLength: [6, "Email must be at least 6 characters long"],

    },


    password: {
        type: String,
        select: false,
    }

})

userSchema.statics.hashPassword = async function (password) {
    console.log(password, this.password);
    return await bcrypt.hash(password, 10);
}

userSchema.methods.isValidPassword = async function (password) {
    console.log(password, this.password);
    return await bcrypt.compare(password, this.password)

}

userSchema.methods.generateJWT = function () {
    return jwt.sign({
        email: this.email,
        id : this._id
    },
        process.env.JWT_SECRET,
        {
            expiresIn: '24d'
        }
    )
}

const User = mongoose.model('User', userSchema);
export default User;