const express = require('express');
const router = express.Router();
const { auth, isInstructor } = require('../middleware/auth');
const {
    createQuiz,
    getQuizzesForCourse,
    updateQuiz,
    deleteQuiz,
} = require('../controllers/quiz');

// Routes for quizzes
router.post('/create', auth, createQuiz);
router.get('/course/:courseId', auth, getQuizzesForCourse);
router.put('/:quizId', auth, updateQuiz);
router.delete('/:quizId', auth, deleteQuiz);

module.exports = router;