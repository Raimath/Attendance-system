const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const { protect } = require('../middleware/auth');

// @route   GET /api/students
// @desc    Get all students (optionally filter by dept/year)
// @access  Private
router.get('/', protect, async (req, res) => {
    const { department, year } = req.query;
    const query = {};
    if (department) query.department = department;
    if (year) query.year = year;

    try {
        const students = await Student.find(query).sort({ rollNo: 1 });
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/students
// @desc    Add a student (Helper)
// @access  Private
router.post('/', protect, async (req, res) => {
    const { name, rollNo, department, year } = req.body;

    try {
        const student = new Student({
            name,
            rollNo,
            department,
            year
        });

        const createdStudent = await student.save();
        res.status(201).json(createdStudent);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   PUT /api/students/:id
// @desc    Update student
// @access  Private
router.put('/:id', protect, async (req, res) => {
    const { name, rollNo, department, year } = req.body;

    try {
        const student = await Student.findById(req.params.id);

        if (student) {
            student.name = name;
            student.rollNo = rollNo;
            student.department = department;
            student.year = year;

            const updatedStudent = await student.save();
            res.json(updatedStudent);
        } else {
            res.status(404).json({ message: 'Student not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   DELETE /api/students/:id
// @desc    Delete student
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);

        if (student) {
            await student.deleteOne();
            res.json({ message: 'Student removed' });
        } else {
            res.status(404).json({ message: 'Student not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
