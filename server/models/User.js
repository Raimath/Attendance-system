const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'faculty'
    }
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
    return enteredPassword === this.password;
};

module.exports = mongoose.model('User', UserSchema);
