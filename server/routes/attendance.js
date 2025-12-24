const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const { protect } = require('../middleware/auth');

// @route   POST /api/attendance
// @desc    Submit attendance
// @access  Private
router.post('/', protect, async (req, res) => {
    // console.log('--- NEW ATTENDANCE SUBMISSION ---');
    // console.log('Received Body:', JSON.stringify(req.body, null, 2));
    const { date, department, year, records, lastUpdated } = req.body;

    try {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const existing = await Attendance.findOne({
            department,
            year,
            date: { $gte: startOfDay, $lte: endOfDay }
        });

        if (existing) {
            existing.records = records;
            existing.faculty = req.user.id;
            existing.lastUpdated = lastUpdated; // Take from client side
            await existing.save();
            return res.json(existing);
        }

        const attendance = new Attendance({
            date: startOfDay,
            department,
            year,
            records,
            faculty: req.user.id,
            lastUpdated: lastUpdated // Take from client side
        });

        const createdAttendance = await attendance.save();
        res.status(201).json(createdAttendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/attendance/report
// @desc    Get monthly attendance report
// @access  Private
router.get('/report', protect, async (req, res) => {
    const { month, department, year } = req.query; // month in YYYY-MM format

    try {
        const [yyyy, mm] = month.split('-');
        const startDate = new Date(yyyy, mm - 1, 1);
        const endDate = new Date(yyyy, mm, 0, 23, 59, 59, 999);

        // Fetch all students for this class
        const Student = require('../models/Student');
        const students = await Student.find({ department, year }).sort({ rollNo: 1 });

        // Fetch all attendance records for this month
        const attendanceRecords = await Attendance.find({
            department,
            year,
            date: { $gte: startDate, $lte: endDate }
        });

        // Structure the data: Map<StudentId, { name, rollNo, days: {day: status} }>
        const report = students.map(student => {
            const studentData = {
                _id: student._id,
                name: student.name,
                rollNo: student.rollNo,
                attendance: {},
                presentCount: 0,
                absentCount: 0
            };

            attendanceRecords.forEach(record => {
                const day = new Date(record.date).getDate();
                const statusRecord = record.records.find(r => r.student.toString() === student._id.toString());

                if (statusRecord) {
                    studentData.attendance[day] = statusRecord.status;
                    if (statusRecord.status === 'Present') studentData.presentCount++;
                    else if (statusRecord.status === 'Absent') studentData.absentCount++;
                } else {
                    studentData.attendance[day] = '-'; // Not marked?
                }
            });

            return studentData;
        });

        res.json(report);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/attendance/logs
// @desc    Get all attendance logs (Admin only)
// @access  Public (Hidden URL strategy)
router.get('/logs', async (req, res) => {
    try {
        const logs = await Attendance.find({})
            .populate('faculty', 'username')
            .sort({ lastUpdated: -1, date: -1 })
            .limit(100);

        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/attendance
// @desc    Get attendance by date/dept/year
// @access  Private
router.get('/', protect, async (req, res) => {
    const { date, department, year } = req.query;

    try {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const attendance = await Attendance.findOne({
            department,
            year,
            date: { $gte: startOfDay, $lte: endOfDay }
        })
            .populate('records.student', 'name rollNo')
            .populate('faculty', 'username');

        if (attendance) {
            res.json(attendance);
        } else {
            res.status(404).json({ message: 'Attendance not found for this date' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
