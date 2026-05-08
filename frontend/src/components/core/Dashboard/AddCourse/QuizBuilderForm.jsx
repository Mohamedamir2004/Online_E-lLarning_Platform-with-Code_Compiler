import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { IoAddCircleOutline } from "react-icons/io5"
import { MdNavigateNext } from "react-icons/md"
import { useDispatch, useSelector } from "react-redux"

import { createQuiz, getQuizzesForCourse, updateQuiz, deleteQuiz } from "../../../../services/operations/courseDetailsAPI"
import { setCourse, setStep } from "../../../../slices/courseSlice"

import IconBtn from "../../../common/IconBtn"

export default function QuizBuilderForm() {
  const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm()

  const { course } = useSelector((state) => state.course)
  const { token } = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  const [loading, setLoading] = useState(false)
  const [quizzes, setQuizzes] = useState([])
  const [editQuizId, setEditQuizId] = useState(null)

  // Fetch quizzes on component mount
  useEffect(() => {
    const fetchQuizzes = async () => {
      const result = await getQuizzesForCourse(course._id, token)
      if (result) {
        setQuizzes(result)
      }
    }
    if (course._id) {
      fetchQuizzes()
    }
  }, [course._id, token])

  // go To Next
  const goToNext = () => {
    dispatch(setStep(4))
  }

  // go Back
  const goBack = () => {
    dispatch(setStep(2))
  }

  // Handle form submission
  const onSubmit = async (data) => {
    setLoading(true)

    const quizData = {
      question: data.question,
      options: [data.option1, data.option2, data.option3, data.option4],
      correctAnswer: parseInt(data.correctAnswer),
      courseId: course._id,
    }

    let result
    if (editQuizId) {
      result = await updateQuiz(editQuizId, quizData, token)
    } else {
      result = await createQuiz(quizData, token)
    }

    if (result) {
      const updatedQuizzes = await getQuizzesForCourse(course._id, token)
      setQuizzes(updatedQuizzes)
      reset()
      setEditQuizId(null)
    }
    setLoading(false)
  }

  // Handle edit quiz
  const handleEditQuiz = (quiz) => {
    setEditQuizId(quiz._id)
    setValue("question", quiz.question)
    setValue("option1", quiz.options[0])
    setValue("option2", quiz.options[1])
    setValue("option3", quiz.options[2])
    setValue("option4", quiz.options[3])
    setValue("correctAnswer", quiz.correctAnswer.toString())
  }

  // Handle delete quiz
  const handleDeleteQuiz = async (quizId) => {
    const result = await deleteQuiz(quizId, token)
    if (result) {
      const updatedQuizzes = await getQuizzesForCourse(course._id, token)
      setQuizzes(updatedQuizzes)
    }
  }

  // Cancel edit
  const cancelEdit = () => {
    setEditQuizId(null)
    reset()
  }

  return (
    <div className="space-y-8 rounded-2xl border-[1px] border-richblack-700 bg-richblack-800 p-6">
      <p className="text-2xl font-semibold text-richblack-5">Quiz Builder</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Question */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm text-richblack-5" htmlFor="question">
            Question <sup className="text-pink-200">*</sup>
          </label>
          <input
            id="question"
            disabled={loading}
            placeholder="Enter quiz question"
            {...register("question", { required: true })}
            className="form-style w-full"
          />
          {errors.question && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">
              Question is required
            </span>
          )}
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((num) => (
            <div key={num} className="flex flex-col space-y-2">
              <label className="text-sm text-richblack-5" htmlFor={`option${num}`}>
                Option {num} <sup className="text-pink-200">*</sup>
              </label>
              <input
                id={`option${num}`}
                disabled={loading}
                placeholder={`Enter option ${num}`}
                {...register(`option${num}`, { required: true })}
                className="form-style w-full"
              />
              {errors[`option${num}`] && (
                <span className="ml-2 text-xs tracking-wide text-pink-200">
                  Option {num} is required
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Correct Answer */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm text-richblack-5" htmlFor="correctAnswer">
            Correct Answer <sup className="text-pink-200">*</sup>
          </label>
          <select
            id="correctAnswer"
            disabled={loading}
            {...register("correctAnswer", { required: true })}
            className="form-style w-full"
          >
            <option value="">Select correct option</option>
            <option value="0">Option 1</option>
            <option value="1">Option 2</option>
            <option value="2">Option 3</option>
            <option value="3">Option 4</option>
          </select>
          {errors.correctAnswer && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">
              Correct answer is required
            </span>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-x-2">
          {editQuizId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900"
            >
              Cancel
            </button>
          )}
          <IconBtn
            disabled={loading}
            text={editQuizId ? "Update Quiz" : "Add Quiz"}
            outline={false}
            type="submit"
          >
            <IoAddCircleOutline size={20} className="text-yellow-50" />
          </IconBtn>
        </div>
      </form>

      {/* Display Quizzes */}
      {quizzes.length > 0 && (
        <div className="space-y-4">
          <p className="text-lg font-semibold text-richblack-5">Quizzes</p>
          {quizzes.map((quiz, index) => (
            <div key={quiz._id} className="rounded-lg border border-richblack-700 bg-richblack-900 p-4">
              <p className="text-richblack-5 font-medium">Q{index + 1}: {quiz.question}</p>
              <ul className="mt-2 space-y-1">
                {quiz.options.map((option, i) => (
                  <li key={i} className={`text-sm ${i === quiz.correctAnswer ? 'text-green-400' : 'text-richblack-200'}`}>
                    {i + 1}. {option}
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex gap-x-2">
                <button
                  onClick={() => handleEditQuiz(quiz)}
                  className="px-3 py-1 bg-yellow-50 text-black rounded-md"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteQuiz(quiz._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded-md"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-end gap-x-2">
        <button
          type="button"
          onClick={goBack}
          className="flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900"
        >
          Back
        </button>
        <IconBtn
          disabled={loading}
          text="Next"
          onclick={goToNext}
        >
          <MdNavigateNext />
        </IconBtn>
      </div>
    </div>
  )
}