import { toast } from "react-hot-toast"
// import { setLoading } from "../../slices/profileSlice";
import { apiConnector } from "../apiConnector"
import { courseEndpoints, quizEndpoints } from "../apis"

const {
  COURSE_DETAILS_API,
  COURSE_CATEGORIES_API,
  GET_ALL_COURSE_API,
  CREATE_COURSE_API,
  EDIT_COURSE_API,
  CREATE_SECTION_API,
  CREATE_SUBSECTION_API,
  UPDATE_SECTION_API,
  UPDATE_SUBSECTION_API,
  DELETE_SECTION_API,
  DELETE_SUBSECTION_API,
  GET_ALL_INSTRUCTOR_COURSES_API,
  DELETE_COURSE_API,
  GET_FULL_COURSE_DETAILS_AUTHENTICATED,
  LECTURE_COMPLETION_API,
  DELETE_CATEGORY_API,
  CREATE_CATEGORY_API,
  SEARCH_COURSE_API,
  CREATE_RATING_API,
} = courseEndpoints

const {
  CREATE_QUIZ_API,
  GET_QUIZZES_FOR_COURSE_API,
  UPDATE_QUIZ_API,
  DELETE_QUIZ_API,
} = quizEndpoints



// ================ get All Courses ================
export const getAllCourses = async () => {
  const toastId = toast.loading("Loading...")
  let result = []

  try {
    const response = await apiConnector("GET", GET_ALL_COURSE_API)
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Course Categories")
    }
    result = response?.data?.data
  } catch (error) {
    console.log("GET_ALL_COURSE_API API ERROR............", error)
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}


// ================ fetch Course Details ================
export const fetchCourseDetails = async (courseId) => {
  // const toastId = toast.loading('Loading')
  //   dispatch(setLoading(true));
  let result = null;

  try {
    const response = await apiConnector("POST", COURSE_DETAILS_API, { courseId, })
    console.log("COURSE_DETAILS_API API RESPONSE............", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }
    result = response.data
  } catch (error) {
    console.log("COURSE_DETAILS_API API ERROR............", error)
    result = error.response.data
    // toast.error(error.response.data.message);
  }
  // toast.dismiss(toastId)
  //   dispatch(setLoading(false));
  return result
}

// ================ fetch Course Categories ================
export const fetchCourseCategories = async () => {
  let result = []

  try {
    const response = await apiConnector("GET", COURSE_CATEGORIES_API)
    console.log("COURSE_CATEGORIES_API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Course Categories")
    }
    result = response?.data?.data
  } catch (error) {
    console.log("COURSE_CATEGORY_API API ERROR............", error)
    toast.error(error.message)
  }
  return result
}

// ================ create Course Category ================
export const createCourseCategory = async (name, description, token) => {
  let result = null
  const toastId = toast.loading("Creating category...")

  try {
    const response = await apiConnector(
      "POST",
      CREATE_CATEGORY_API,
      { name, description },
      {
        Authorization: `Bearer ${token}`,
      }
    )
    console.log("CREATE_CATEGORY_API RESPONSE", response)
    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Could not create category")
    }
    result = response?.data?.data
    toast.success("Category created successfully")
  } catch (error) {
    console.log("CREATE_CATEGORY_API ERROR", error)
    toast.error(error.message || "Failed to create category")
  }

  toast.dismiss(toastId)
  return result
}

// ================ search Courses ================
export const searchCourses = async (query) => {
  let result = []
  try {
    const response = await apiConnector(
      "GET",
      SEARCH_COURSE_API,
      null,
      null,
      { q: query }
    )
    console.log("SEARCH_COURSE_API RESPONSE", response)
    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Search failed")
    }
    result = response?.data?.data
  } catch (error) {
    console.log("SEARCH_COURSE_API ERROR", error)
    toast.error(error.message || "Failed to search courses")
  }
  return result
}

// ================ delete Category ================
export const deleteCourseCategory = async (categoryId, token) => {
  let success = false
  try {
    const response = await apiConnector("DELETE", DELETE_CATEGORY_API, { categoryId }, {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    })
    console.log("DELETE_CATEGORY_API RESPONSE", response)
    if (response?.data?.success) {
      success = true
      toast.success(response.data.message || "Category deleted")
    }
  } catch (error) {
    console.log("DELETE_CATEGORY_API ERROR", error)
    toast.error(error.response?.data?.message || error.message || "Failed to delete category")
  }
  return success
}


// ================ add Course Details ================
export const addCourseDetails = async (data, token) => {
  const toastId = toast.loading("Loading...")
  let result = null;

  try {
    const response = await apiConnector("POST", CREATE_COURSE_API, data, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    })
    console.log("CREATE COURSE API RESPONSE............", response)

    if (!response?.data?.success) {
      throw new Error("Could Not Add Course Details")
    }

    result = response?.data?.data
    toast.success("Course Details Added Successfully")
  } catch (error) {
    console.log("CREATE COURSE API ERROR............", error)
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}


// ================ edit Course Details ================
export const editCourseDetails = async (data, token) => {
  let result = null
  const toastId = toast.loading("Loading...")

  try {
    const response = await apiConnector("POST", EDIT_COURSE_API, data, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    })
    console.log("EDIT COURSE API RESPONSE............", response)

    if (!response?.data?.success) {
      throw new Error("Could Not Update Course Details")
    }

    result = response?.data?.data
    toast.success("Course Details Updated Successfully")
  } catch (error) {
    console.log("EDIT COURSE API ERROR............", error)
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}


// ================ create Section ================
export const createSection = async (data, token) => {
  let result = null
  const toastId = toast.loading("Loading...")

  try {
    const response = await apiConnector("POST", CREATE_SECTION_API, data, {
      Authorization: `Bearer ${token}`,
    })
    console.log("CREATE SECTION API RESPONSE............", response)

    if (!response?.data?.success) {
      throw new Error("Could Not Create Section")
    }

    result = response?.data?.updatedCourseDetails
    toast.success("Course Section Created")
  } catch (error) {
    console.log("CREATE SECTION API ERROR............", error)
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}


// ================ create SubSection ================
export const createSubSection = async (data, token) => {
  let result = null
  const toastId = toast.loading("Adding lecture...")

  try {
    console.log("Sending create sub-section request with data:", {
      sectionId: data.get('sectionId'),
      title: data.get('title'),
      description: data.get('description'),
      video: data.get('video') ? 'Video file present' : 'No video'
    })
    
    // when we send FormData along with custom headers, axios does not
    // automatically set the content-type (including the boundary). the
    // backend relies on express-fileupload to parse multipart data, so we
    // need to explicitly declare it here. forgetting to send the header
    // results in the request being sent as JSON which strips the file
    // resulting in `req.files.video` being undefined and a 400 response
    // from the server complaining about missing fields.
    const response = await apiConnector("POST", CREATE_SUBSECTION_API, data, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    })
    console.log("CREATE SUB-SECTION API RESPONSE............", response)

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Could Not Add Lecture")
    }

    result = response?.data?.data
    toast.success("Lecture Added Successfully")
  } catch (error) {
    console.log("CREATE SUB-SECTION API ERROR............", error)
    // prefer server-provided message if available
    const msg = error.response?.data?.message || error.message || "Failed to add lecture"
    toast.error(msg)
  }
  toast.dismiss(toastId)
  return result
}


// ================ Update Section ================
export const updateSection = async (data, token) => {
  let result = null
  const toastId = toast.loading("Loading...")

  try {
    const response = await apiConnector("POST", UPDATE_SECTION_API, data, {
      Authorization: `Bearer ${token}`,
    })
    console.log("UPDATE SECTION API RESPONSE............", response)

    if (!response?.data?.success) {
      throw new Error("Could Not Update Section")
    }

    result = response?.data?.data
    toast.success("Course Section Updated")
  } catch (error) {
    console.log("UPDATE SECTION API ERROR............", error)
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}


// ================ Update SubSection ================
export const updateSubSection = async (data, token) => {
  let result = null
  const toastId = toast.loading("Updating lecture...")

  try {
    console.log("Sending update sub-section request...")
    
    // same reasoning as createSubSection – include content-type when sending
    // a FormData instance so the file payload is preserved/restored by axios
    const response = await apiConnector("POST", UPDATE_SUBSECTION_API, data, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    })
    console.log("UPDATE SUB-SECTION API RESPONSE............", response)

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Could Not Update Lecture")
    }

    result = response?.data?.data
    toast.success("Lecture Updated Successfully")
  } catch (error) {
    console.log("UPDATE SUB-SECTION API ERROR............", error)
    const msg = error.response?.data?.message || error.message || "Failed to update lecture"
    toast.error(msg)
  }
  toast.dismiss(toastId)
  return result
}


// ================ delete Section ================
export const deleteSection = async (data, token) => {
  let result = null
  const toastId = toast.loading("Loading...")

  try {
    const response = await apiConnector("POST", DELETE_SECTION_API, data, {
      Authorization: `Bearer ${token}`,
    })
    console.log("DELETE SECTION API RESPONSE............", response)

    if (!response?.data?.success) {
      throw new Error("Could Not Delete Section")
    }

    result = response?.data?.data
    toast.success("Course Section Deleted")
  } catch (error) {
    console.log("DELETE SECTION API ERROR............", error)
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}


// ================ delete SubSection ================
export const deleteSubSection = async (data, token) => {
  let result = null
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("POST", DELETE_SUBSECTION_API, data, {
      Authorization: `Bearer ${token}`,
    })
    console.log("DELETE SUB-SECTION API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Delete Lecture")
    }
    result = response?.data?.data
    toast.success("Lecture Deleted")
  } catch (error) {
    console.log("DELETE SUB-SECTION API ERROR............", error)
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}

// ================ fetch Instructor Courses ================
export const fetchInstructorCourses = async (token) => {
  let result = []
  // const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector(
      "GET",
      GET_ALL_INSTRUCTOR_COURSES_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    )
    console.log("INSTRUCTOR COURSES API RESPONSE", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Instructor Courses")
    }
    result = response?.data?.data
  } catch (error) {
    console.log("INSTRUCTOR COURSES API ERROR............", error)
    toast.error(error.message)
  }
  return result
}


// ================ delete Course ================
export const deleteCourse = async (data, token) => {
  // const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("DELETE", DELETE_COURSE_API, data, {
      Authorization: `Bearer ${token}`,
    })
    console.log("DELETE COURSE API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Delete Course")
    }
    toast.success("Course Deleted")
  } catch (error) {
    console.log("DELETE COURSE API ERROR............", error)
    toast.error(error.message)
  }
  // toast.dismiss(toastId)
}


// ================ get Full Details Of Course ================
export const getFullDetailsOfCourse = async (courseId, token) => {
  // const toastId = toast.loading("Loading...")
  //   dispatch(setLoading(true));
  let result = null
  try {
    const response = await apiConnector(
      "POST",
      GET_FULL_COURSE_DETAILS_AUTHENTICATED,
      {
        courseId,
      },
      {
        Authorization: `Bearer ${token}`,
      }
    )
    console.log("COURSE_FULL_DETAILS_API API RESPONSE............", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }
    result = response?.data?.data
  } catch (error) {
    console.log("COURSE_FULL_DETAILS_API API ERROR............", error)
    result = error.response.data
    // toast.error(error.response.data.message);
  }
  // toast.dismiss(toastId)
  //   dispatch(setLoading(false));
  return result
}


// ================ mark Lecture As Complete ================
export const markLectureAsComplete = async (data, token) => {
  let result = null
  // console.log("mark complete data", data)
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("POST", LECTURE_COMPLETION_API, data, {
      Authorization: `Bearer ${token}`,
    })
    console.log("MARK_LECTURE_AS_COMPLETE_API API RESPONSE............", response)

    if (!response.data.message) {
      throw new Error(response.data.error)
    }
    toast.success("Lecture Completed")
    result = true
  } catch (error) {
    console.log("MARK_LECTURE_AS_COMPLETE_API API ERROR............", error)
    toast.error(error.message)
    result = false
  }
  toast.dismiss(toastId)
  return result
}


// ================ create Course Rating  ================
export const createRating = async (data, token) => {
  const toastId = toast.loading("Loading...")
  let success = false
  try {
    const response = await apiConnector("POST", CREATE_RATING_API, data, {
      Authorization: `Bearer ${token}`,
    })
    console.log("CREATE RATING API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Create Rating")
    }
    toast.success("Rating Created")
    success = true
  } catch (error) {
    success = false
    console.log("CREATE RATING API ERROR............", error)
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return success
}

// ================ Quiz APIs ================

// Create Quiz
export const createQuiz = async (data, token) => {
  const toastId = toast.loading("Creating quiz...")
  let result = null
  try {
    const response = await apiConnector("POST", CREATE_QUIZ_API, data, {
      Authorization: `Bearer ${token}`,
    })
    console.log("CREATE QUIZ API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Create Quiz")
    }
    result = response?.data?.data
    toast.success("Quiz Created Successfully")
  } catch (error) {
    console.log("CREATE QUIZ API ERROR............", error)
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}

// Get Quizzes for Course
export const getQuizzesForCourse = async (courseId, token) => {
  let result = []
  try {
    const response = await apiConnector("GET", `${GET_QUIZZES_FOR_COURSE_API}/${courseId}`, null, {
      Authorization: `Bearer ${token}`,
    })
    console.log("GET QUIZZES FOR COURSE API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Quizzes")
    }
    result = response?.data?.data
  } catch (error) {
    console.log("GET QUIZZES FOR COURSE API ERROR............", error)
    toast.error(error.message)
  }
  return result
}

// Update Quiz
export const updateQuiz = async (quizId, data, token) => {
  const toastId = toast.loading("Updating quiz...")
  let result = null
  try {
    const response = await apiConnector("PUT", `${UPDATE_QUIZ_API}/${quizId}`, data, {
      Authorization: `Bearer ${token}`,
    })
    console.log("UPDATE QUIZ API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Update Quiz")
    }
    result = response?.data?.data
    toast.success("Quiz Updated Successfully")
  } catch (error) {
    console.log("UPDATE QUIZ API ERROR............", error)
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}

// Delete Quiz
export const deleteQuiz = async (quizId, token) => {
  const toastId = toast.loading("Deleting quiz...")
  let success = false
  try {
    const response = await apiConnector("DELETE", `${DELETE_QUIZ_API}/${quizId}`, null, {
      Authorization: `Bearer ${token}`,
    })
    console.log("DELETE QUIZ API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Delete Quiz")
    }
    toast.success("Quiz Deleted Successfully")
    success = true
  } catch (error) {
    console.log("DELETE QUIZ API ERROR............", error)
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return success
}