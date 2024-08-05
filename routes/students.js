var express = require('express');
var router = express.Router();
var student = require('../models/student');

// GET students
router.get('/', async function(req, res, next) {
    const students = await student.find();
    console.log(students)
    res.json(students)
});


// Create student
router.post('/', async function(req, res, next) {
    var { name, className, avgPoints } = req.body;
    avgPoints = parseFloat(avgPoints);

    if(!name || !className || !avgPoints) {
        return res.status(400).send('Invalid data');
    }

    if(avgPoints < 0 || avgPoints > 10|| isNaN(avgPoints) || avgPoints % 0.5 != 0) {
        return res.status(400).send('Invalid avgPoints');
    }

    await student.create({ name, className, avgPoints })
    
    res.send({ id, name, className, avgPoints })
});
// Update student
router.put('/:id', async function(req, res, next) {
    const { name, className, avgPoints } = req.body;
    var oneStudent = await student.findById(req.params.id);

    if(!oneStudent) {
        return res.status(404).send('Student not found');
    }

    if(!name || !className || !avgPoints) {
        return res.status(400).send('Invalid data');
    }

    if(avgPoints < 0 || avgPoints > 10|| isNaN(avgPoints) || avgPoints % 0.5 != 0) {
        return res.status(400).send('Invalid avgPoints');
    }

    oneStudent.name = name;
    oneStudent.className = className;
    oneStudent.avgPoints = avgPoints;

    oneStudent.save();
    
    res.send('Student updated')
});
//DELETE Students
router.delete('/:id', async function(req, res, next) {
    const oneStudent = await student.findById(req.params.id);
    oneStudent.remove();
    res.send('Student deleted');
});

// GET students by AvgPoints between 6.5 and 8
router.get('/getAvgStudent', async function(req, res, next) {
    var listStudents = await student.find({ avgPoints: { $gte: 6.5, $lte: 8 } });
    res.json(listStudents)
});
//GET student by className and avgPoints >= 9
router.get('/getStudentByClassAndAvg', async function(req, res, next) {
    var listStudents = await student.find({ className: 'MD18401', avgPoints: { $gte: 9 } });
    res.json(listStudents)
});
//SORT students
router.get('/sortStudentsByAvgPoints', async function(req, res, next) {
    // var listStudents = students.sort((a, b) => b.avgPoints - a.avgPoints);
    // students = listStudents;
    // saveStudents();
    var listStudents = await student.find().sort({ avgPoints: -1 });
    res.json(listStudents)
});

//GET highestStudents AvgPoints
router.get('/highestAvgStudent', function(req, res, next) {
    var studentOfClassMD18401 = students.filter(student => student.className === 'MD18401');
    var maxAvgPoints = Math.max(...studentOfClassMD18401.map(student => student.avgPoints));
    var student = students.find(student => student.avgPoints === maxAvgPoints);
    res.json(student)
});

// GET student by ID
router.get('/:id', async function(req, res, next) {
    var oneStudent = await student.findById(req.params.id);
    if(!oneStudent) {
        // return res.status(404).send('Student not found');
        next();
    }
    res.json(oneStudent)
});

module.exports = router;
