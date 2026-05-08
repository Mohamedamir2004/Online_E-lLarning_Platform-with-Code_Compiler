const Quiz = require('../models/quiz');
const Course = require('../models/course');

// Create a quiz
exports.createQuiz = async (req, res) => {
    try {
        const { question, options, correctAnswer, courseId } = req.body;
        const instructorId = req.user.id;

        // Validate options length
        if (options.length !== 4) {
            return res.status(400).json({
                success: false,
                message: 'Quiz must have exactly 4 options',
            });
        }

        // Check if course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found',
            });
        }

        const quiz = new Quiz({
            question,
            options,
            correctAnswer,
            course: courseId,
            createdBy: instructorId,
        });

        await quiz.save();

        res.status(201).json({
            success: true,
            message: 'Quiz created successfully',
            data: quiz,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Failed to create quiz',
        });
    }
};

// Get quizzes for a course
exports.getQuizzesForCourse = async (req, res) => {
    try {
        const { courseId } = req.params;

        const quizzes = await Quiz.find({ course: courseId }).populate('createdBy', 'firstName lastName');

        res.status(200).json({
            success: true,
            data: quizzes,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch quizzes',
        });
    }
};

// Update a quiz
exports.updateQuiz = async (req, res) => {
    try {
        const { quizId } = req.params;
        const { question, options, correctAnswer } = req.body;
        const instructorId = req.user.id;

        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: 'Quiz not found',
            });
        }
        if (quiz.createdBy.toString() !== instructorId) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to update this quiz',
            });
        }

        if (options && options.length !== 4) {
            return res.status(400).json({
                success: false,
                message: 'Quiz must have exactly 4 options',
            });
        }

        quiz.question = question || quiz.question;
        quiz.options = options || quiz.options;
        quiz.correctAnswer = correctAnswer !== undefined ? correctAnswer : quiz.correctAnswer;
        quiz.updatedAt = Date.now();

        await quiz.save();

        res.status(200).json({
            success: true,
            message: 'Quiz updated successfully',
            data: quiz,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Failed to update quiz',
        });
    }
};

// Delete a quiz
exports.deleteQuiz = async (req, res) => {
    try {
        const { quizId } = req.params;
        const instructorId = req.user.id;

        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: 'Quiz not found',
            });
        }
        if (quiz.createdBy.toString() !== instructorId) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to delete this quiz',
            });
        }

        await Quiz.findByIdAndDelete(quizId);

        res.status(200).json({
            success: true,
            message: 'Quiz deleted successfully',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete quiz',
        });
    }
};