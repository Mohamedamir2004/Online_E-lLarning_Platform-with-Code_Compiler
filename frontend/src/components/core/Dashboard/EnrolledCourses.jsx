import { useEffect, useState } from "react"
import ProgressBar from "@ramonak/react-progress-bar"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { getUserEnrolledCourses } from "../../../services/operations/profileAPI"
import Img from './../../common/Img';
import MeetIcon from './../../common/MeetIcon';
import JsCompiler from './JsCompiler';
import QuizSection from './QuizSection';



export default function EnrolledCourses() {
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()

  const [enrolledCourses, setEnrolledCourses] = useState(null)
  const [activeTab, setActiveTab] = useState('courses')
  const [quizToggles, setQuizToggles] = useState({})

  // fetch all users enrolled courses
  const getEnrolledCourses = async () => {
    try {
      const res = await getUserEnrolledCourses(token);
      setEnrolledCourses(res);
    } catch (error) {
      console.log("Could not fetch enrolled courses.")
    }
  };

  useEffect(() => {
    getEnrolledCourses();
  }, [])

  // Loading Skeleton
  const sklItem = () => {
    return (
      <div className="flex border border-richblack-700 px-5 py-3 w-full">
        <div className="flex flex-1 gap-x-4 ">
          <div className='h-14 w-14 rounded-lg skeleton '></div>

          <div className="flex flex-col w-[40%] ">
            <p className="h-2 w-[50%] rounded-xl  skeleton"></p>
            <p className="h-2 w-[70%] rounded-xl mt-3 skeleton"></p>
          </div>
        </div>

        <div className="flex flex-[0.4] flex-col ">
          <p className="h-2 w-[20%] rounded-xl skeleton mt-2"></p>
          <p className="h-2 w-[40%] rounded-xl skeleton mt-3"></p>
        </div>
      </div>
    )
  }

  // return if data is null
  // if (enrolledCourses?.length == 0 && activeTab === 'courses') {
  //   return (
  //     <div>
  //       <div className="flex items-center justify-between">
  //         <div className="text-4xl text-richblack-5 font-boogaloo text-center sm:text-left">Enrolled Courses</div>
  //         <div className="ml-4">
  //           <MeetIcon />
  //         </div>
  //       </div>
  //       <p className="grid h-[50vh] w-full place-content-center text-center text-richblack-5 text-3xl">
  //         You have not enrolled in any course yet.
  //       </p>
  //     </div>
  //   )
  // }



  return (
    <>
      <div className="flex items-center justify-between">
        <div className="text-4xl text-richblack-5 font-boogaloo text-center sm:text-left">Enrolled Courses</div>
        <div className="ml-4">
          <MeetIcon />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${activeTab === 'courses' ? 'bg-yellow-50 text-black' : 'bg-richblack-700 text-richblack-300'}`}
          onClick={() => setActiveTab('courses')}
        >
          My Courses
        </button>
        <button
          className={`px-4 py-2 rounded ${activeTab === 'compiler' ? 'bg-yellow-50 text-black' : 'bg-richblack-700 text-richblack-300'}`}
          onClick={() => setActiveTab('compiler')}
        >
          JS Compiler
        </button>
      </div>

      {activeTab === 'courses' && (
        <div className="my-8 text-richblack-5">
          {enrolledCourses?.length === 0 ? (
            <p className="grid h-[50vh] w-full place-content-center text-center text-richblack-5 text-3xl">
              You have not enrolled in any course yet.
            </p>
          ) : (
            <>
              {/* Headings */}
              <div className="flex rounded-t-2xl bg-richblack-800 ">
                <p className="w-[45%] px-5 py-3">Course Name</p>
                <p className="w-1/4 px-2 py-3">Duration</p>
                <p className="flex-1 px-2 py-3">Progress</p>
              </div>


              {/* loading Skeleton */}
              {!enrolledCourses && <div >
                {sklItem()}
                {sklItem()}
                {sklItem()}
                {sklItem()}
                {sklItem()}
              </div>}

              {/* Course Names */}
              {
                enrolledCourses?.map((course, i, arr) => (
                  <>
                    <div
                      className={`flex flex-col sm:flex-row sm:items-center border border-richblack-700 ${i === arr.length - 1 ? "rounded-b-2xl" : "rounded-none"}`}
                      key={i}
                    >
                    <div
                      className="flex sm:w-[45%] cursor-pointer items-center gap-4 px-5 py-3"
                      onClick={() => {
                        navigate(
                          `/view-course/${course?._id}/section/${course.courseContent?.[0]?._id}/sub-section/${course.courseContent?.[0]?.subSection?.[0]?._id}`
                        )
                      }}
                    >
                      <Img
                        src={course.thumbnail}
                        alt="course_img"
                        className="h-14 w-14 rounded-lg object-cover"
                      />

                      <div className="flex max-w-xs flex-col gap-2">
                        <p className="font-semibold">{course.courseName}</p>
                        <p className="text-xs text-richblack-300">
                          {course.courseDescription.length > 50
                            ? `${course.courseDescription.slice(0, 50)}...`
                            : course.courseDescription}
                        </p>
                      </div>
                    </div>

                    {/* only for smaller devices */}
                    {/* duration -  progress */}
                    <div className='sm:hidden'>
                      <div className=" px-2 py-3">{course?.totalDuration}</div>

                      <div className="flex sm:w-2/5 flex-col gap-2 px-2 py-3">
                        {/* {console.log('Course ============== ', course.progressPercentage)} */}

                        <p>Progress: {course.progressPercentage || 0}%</p>
                        <ProgressBar
                          completed={course.progressPercentage || 0}
                          height="8px"
                          isLabelVisible={false}
                        />
                      </div>
                    </div>

                    {/* only for larger devices */}
                    {/* duration -  progress */}
                    <div className="hidden w-1/5 sm:flex px-2 py-3">{course?.totalDuration}</div>
                    <div className="hidden sm:flex w-1/5 flex-col gap-2 px-2 py-3">
                      <p>Progress: {course.progressPercentage || 0}%</p>
                      <ProgressBar
                        completed={course.progressPercentage || 0}
                        height="8px"
                        isLabelVisible={false}
                      />
                      <button
                        onClick={() => setQuizToggles(prev => ({ ...prev, [course._id.toString()]: !prev[course._id.toString()] }))}
                        className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm"
                      >
                        {quizToggles[course._id.toString()] ? 'Hide Quizzes' : 'Show Quizzes'}
                      </button>
                    </div>
                  </div>
                  {quizToggles[course._id.toString()] && (
                    <div className="w-full">
                      <QuizSection courseId={course._id} />
                    </div>
                  )}
                  </>
                ))
              }
            </>
          )}
        </div>
      )}

      {activeTab === 'compiler' && <JsCompiler />}
    </>
  )
}