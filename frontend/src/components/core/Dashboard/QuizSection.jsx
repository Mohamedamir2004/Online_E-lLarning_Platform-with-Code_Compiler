import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

import { getQuizzesForCourse } from "../../../services/operations/courseDetailsAPI"

export default function QuizSection({ courseId }) {
  const { token } = useSelector((state) => state.auth)
  const [quizzes, setQuizzes] = useState([])
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  useEffect(() => {
    const fetchQuizzes = async () => {
      const result = await getQuizzesForCourse(courseId, token)
      if (result) {
        setQuizzes(result)
      }
    }
    fetchQuizzes()
  }, [courseId, token])

  const handleAnswerChange = (quizId, answer) => {
    setAnswers(prev => ({ ...prev, [quizId]: answer }))
  }

  const handleSubmit = () => {
    let correct = 0
    quizzes.forEach(quiz => {
      if (answers[quiz._id] === quiz.correctAnswer) {
        correct++
      }
    })
    setScore(correct)
    setSubmitted(true)
  }

  const handleRestart = () => {
    setAnswers({})
    setSubmitted(false)
    setScore(0)
  }

  if (quizzes.length === 0) {
    return <p className="text-richblack-300 p-4">No quizzes available for this course.</p>
  }

  return (
    <div className="bg-richblack-900 border border-richblack-700 rounded-lg p-4 m-4">
      <h3 className="text-xl font-semibold text-richblack-5 mb-4">Course Quizzes</h3>

      {submitted ? (
        <div className="text-center">
          <p className="text-2xl text-yellow-50 mb-4">Your Score: {score}/{quizzes.length}</p>
          <button
            onClick={handleRestart}
            className="px-4 py-2 bg-yellow-50 text-black rounded"
          >
            Restart Quiz
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {quizzes.map((quiz, index) => (
            <div key={quiz._id} className="border border-richblack-600 rounded p-4">
              <p className="text-richblack-5 font-medium mb-3">Q{index + 1}: {quiz.question}</p>
              <div className="space-y-2">
                {quiz.options.map((option, i) => (
                  <label key={i} className="flex items-center text-richblack-200">
                    <input
                      type="radio"
                      name={quiz._id}
                      value={i}
                      onChange={() => handleAnswerChange(quiz._id, i)}
                      className="mr-2"
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>
          ))}
          <div className="text-center">
            <button
              onClick={handleSubmit}
              disabled={Object.keys(answers).length !== quizzes.length}
              className="px-6 py-2 bg-yellow-50 text-black rounded disabled:opacity-50"
            >
              Submit Quiz
            </button>
          </div>
        </div>
      )}
    </div>
  )
}