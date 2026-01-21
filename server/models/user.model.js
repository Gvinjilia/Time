const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: [true, 'Fullname is required']
    },
    email: {
        type: String,
        required: [true, 'email is required!'],
        validate: [validator.isEmail, 'Email should be valid'],
        lowerCase: true
    },
    password: {
        type: String,
        required: [function(){
            return !this.oauthId
        }, 'Password is required'],
        select: false,
        minLength: [4, 'Minimum length of password is 4 characters']
    },
    role: {
        type: String,
        enum: ['admin', 'moderator', 'user'],
        default: 'user'
    },
    oauthProvider: {
        type: String,
        enum: ['google', 'github', 'facebook', null],
        default: null
    },
    oauthId: {
        type: String
    },
    avatar: {
        type: String
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationCode: {
        type: String
    },
    resetPassToken: {
        type: String
    },
    resetPassExpires: {
        type: Number
    }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) {
        return;
    };

    this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePasswords = async (candidate, password) => {
    return await bcrypt.compare(candidate, password);
};

userSchema.methods.signToken = function() {
    return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES
    });
};

userSchema.methods.createVerificationCode = function(){
    const code = crypto.randomBytes(12).toString('hex');

    this.verificationCode = code;

    return code;
};

const User = mongoose.model('User', userSchema);

module.exports = User;