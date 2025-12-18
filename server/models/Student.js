const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    rollNo: {
        type: String,
        required: true,
        unique: true
    },
    department: {
        type: String,
        required: true
    },
    year: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Student', StudentSchema);
