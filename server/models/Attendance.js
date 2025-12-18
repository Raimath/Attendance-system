const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    year: {
        type: String,
        required: true
    },
    records: [{
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student',
            required: true
        },
        status: {
            type: String,
            enum: ['Present', 'Absent'],
            required: true
        }
    }],
    faculty: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

// Compound index to ensure one attendance record per day per class
AttendanceSchema.index({ date: 1, department: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', AttendanceSchema);
