import { useEffect, useState, useRef } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { HiOutlineCurrencyRupee } from "react-icons/hi"
import { MdNavigateNext, MdOutlineDelete } from "react-icons/md"
import { useDispatch, useSelector } from "react-redux"

import { addCourseDetails, editCourseDetails, fetchCourseCategories, createCourseCategory, deleteCourseCategory } from "../../../../../services/operations/courseDetailsAPI"
import { setCourse, setStep } from "../../../../../slices/courseSlice"
import { COURSE_STATUS } from "../../../../../utils/constants"
import IconBtn from "../../../../common/IconBtn"
import Upload from "../Upload"
import ChipInput from "./ChipInput"
import RequirementsField from "./RequirementField"

export default function CourseInformationForm() {

  const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm()

  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.auth)
  const { course, editCourse } = useSelector((state) => state.course)
  const [loading, setLoading] = useState(false)
  const [courseCategories, setCourseCategories] = useState([])
  const panelRef = useRef(null);
  const toggleRef = useRef(null);

  // new category fields
  const [showNewCategoryForm, setShowNewCategoryForm] = useState(false)
  const [newCatName, setNewCatName] = useState("")
  const [newCatDesc, setNewCatDesc] = useState("")
  const [showManagePanel, setShowManagePanel] = useState(false)

  const { user } = useSelector((state) => state.profile); // for permission check

  useEffect(() => {
    const getCategories = async () => {
      setLoading(true)
      const categories = await fetchCourseCategories();
      // Always set categories, even if empty
      setCourseCategories(categories)
      setLoading(false)
    }
    // close panel when click outside
    const handleClickOutside = (e) => {
      if (
        showManagePanel &&
        panelRef.current &&
        !panelRef.current.contains(e.target) &&
        toggleRef.current &&
        !toggleRef.current.contains(e.target)
      ) {
        setShowManagePanel(false);
      }
    };
    window.addEventListener('mousedown', handleClickOutside);

    // if form is in edit mode 
    // It will add value in input field
    if (editCourse) {
      // console.log("editCourse ", editCourse)
      setValue("courseTitle", course.courseName)
      setValue("courseShortDesc", course.courseDescription)
      setValue("coursePrice", course.price)
      setValue("courseTags", course.tag)
      setValue("courseBenefits", course.whatYouWillLearn)
      setValue("courseCategory", course.category)
      setValue("courseRequirements", course.instructions)
      setValue("courseImage", course.thumbnail)
    }

    getCategories()
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, [editCourse])



  const isFormUpdated = () => {
    const currentValues = getValues()
    // console.log("changes after editing form values:", currentValues)
    if (
      currentValues.courseTitle !== course.courseName ||
      currentValues.courseShortDesc !== course.courseDescription ||
      currentValues.coursePrice !== course.price ||
      currentValues.courseTags.toString() !== course.tag.toString() ||
      currentValues.courseBenefits !== course.whatYouWillLearn ||
      currentValues.courseCategory._id !== course.category._id ||
      currentValues.courseRequirements.toString() !== course.instructions.toString() ||
      currentValues.courseImage !== course.thumbnail) {
      return true
    }
    return false
  }

  //   handle next button click
  const onSubmit = async (data) => {
    // Debug authentication
    console.log("Token:", token)
    if (!token) {
      toast.error("Please login first")
      return
    }
    // console.log(data)

    if (editCourse) {
      // const currentValues = getValues()
      // console.log("changes after editing form values:", currentValues)
      // console.log("now course:", course)
      // console.log("Has Form Changed:", isFormUpdated())
      if (isFormUpdated()) {
        const currentValues = getValues()
        const formData = new FormData()
        // console.log('data -> ',data)
        formData.append("courseId", course._id)
        if (currentValues.courseTitle !== course.courseName) {
          formData.append("courseName", data.courseTitle)
        }
        if (currentValues.courseShortDesc !== course.courseDescription) {
          formData.append("courseDescription", data.courseShortDesc)
        }
        if (currentValues.coursePrice !== course.price) {
          formData.append("price", data.coursePrice)
        }
        if (currentValues.courseTags.toString() !== course.tag.toString()) {
          formData.append("tag", JSON.stringify(data.courseTags))
          // formData.append("tag", data.courseTags)
        }
        if (currentValues.courseBenefits !== course.whatYouWillLearn) {
          formData.append("whatYouWillLearn", data.courseBenefits)
        }
        if (currentValues.courseCategory._id !== course.category._id) {
          formData.append("category", data.courseCategory)
        }
        if (currentValues.courseRequirements.toString() !== course.instructions.toString()) {
          formData.append("instructions", JSON.stringify(data.courseRequirements))
        }
        if (currentValues.courseImage !== course.thumbnail) {
          formData.append("thumbnailImage", data.courseImage)
        }

        // send data to backend
        setLoading(true)
        const result = await editCourseDetails(formData, token)
        setLoading(false)
        if (result) {
          dispatch(setStep(2))
          dispatch(setCourse(result))
        }
      } else {
        toast.error("No changes made to the form")
      }
      return
    }

    // user has visted first time to step 1 
    const formData = new FormData()
    formData.append("courseName", data.courseTitle)
    formData.append("courseDescription", data.courseShortDesc)
    formData.append("price", data.coursePrice)
    formData.append("tag", JSON.stringify(data.courseTags))
    formData.append("whatYouWillLearn", data.courseBenefits)
    formData.append("category", data.courseCategory)
    formData.append("status", COURSE_STATUS.DRAFT)
    formData.append("instructions", JSON.stringify(data.courseRequirements))
    formData.append("thumbnailImage", data.courseImage)
    setLoading(true)
    const result = await addCourseDetails(formData, token)
    if (result) {
      dispatch(setStep(2))
      dispatch(setCourse(result))
    }
    setLoading(false)
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6 "
    >
      {/* Course Title */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="courseTitle">
          Course Title <sup className="text-pink-200">*</sup>
        </label>
        <input
          id="courseTitle"
          placeholder="Enter Course Title"
          {...register("courseTitle", { required: true })}
          className="form-style w-full"
        />
        {errors.courseTitle && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Course title is required
          </span>
        )}
      </div>

      {/* Course Short Description */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="courseShortDesc">
          Course Short Description <sup className="text-pink-200">*</sup>
        </label>
        <textarea
          id="courseShortDesc"
          placeholder="Enter Description"
          {...register("courseShortDesc", { required: true })}
          className="form-style resize-x-none min-h-[130px] w-full ] "
        />
        {errors.courseShortDesc && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Course Description is required
          </span>
        )}
      </div>

      {/* Course Price */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="coursePrice">
          Course Price <sup className="text-pink-200">*</sup>
        </label>
        <div className="relative">
          <input
            id="coursePrice"
            placeholder="Enter Course Price"
            {...register("coursePrice", {
              required: true,
              valueAsNumber: true,
              pattern: {
                value: /^(0|[1-9]\d*)(\.\d+)?$/,
              },
            })}
            className="form-style w-full !pl-12"

          />
          <HiOutlineCurrencyRupee className="absolute left-3 top-1/2 inline-block -translate-y-1/2 text-2xl text-richblack-400" />
        </div>
        {errors.coursePrice && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Course Price is required
          </span>
        )}
      </div>

      {/* Course Category */}
      <div className="relative flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="courseCategory">
          Course Category <sup className="text-pink-200">*</sup>
        </label>
        {/* row: select + add button + delete icon */}
        <div className="flex items-center gap-2">
          <select
            {...register("courseCategory", { required: true })}
            defaultValue=""
            id="courseCategory"
            className="form-style flex-1 cursor-pointer"
          >
            <option value="" disabled>
              Choose a Category
            </option>
            {!loading &&
              courseCategories?.map((category, indx) => (
                <option key={indx} value={category?._id}>
                  {category?.name}
                </option>
              ))}
          </select>

          <button
            type="button"
            className="text-xs text-yellow-50 bg-richblack-700 px-2 py-1 rounded-md hover:bg-yellow-50 hover:text-black transition-colors"
            onClick={() => setShowNewCategoryForm((prev) => !prev)}
          >
            <span className="mr-1">+</span> Add
          </button>

          {(user?.accountType === "Admin" || user?.accountType === "Instructor") && (
            <button
              ref={toggleRef}
              type="button"
              onClick={() => setShowManagePanel((prev) => !prev)}
              className="p-1 bg-red-600 rounded hover:bg-red-700 text-white"
            >
              <MdOutlineDelete className="text-lg" />
            </button>
          )}
        </div>
        {errors.courseCategory && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Course Category is required
          </span>
        )}

        {showNewCategoryForm && (
          <div className="mt-2 flex flex-col gap-2 bg-richblack-800 p-3 rounded-md border border-richblack-600">
            <input
              type="text"
              placeholder="Category name"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              className="form-style w-full"
            />
            <textarea
              rows={2}
              placeholder="Description"
              value={newCatDesc}
              onChange={(e) => setNewCatDesc(e.target.value)}
              className="form-style w-full"
            />
            <button
              type="button"
              className="rounded-md bg-yellow-50 px-4 py-2 text-sm font-semibold text-black shadow-md hover:scale-95"
              onClick={async () => {
                if (!newCatName || !newCatDesc) {
                  toast.error("Both name and description are required")
                  return
                }
                setLoading(true)
                const cat = await createCourseCategory(newCatName, newCatDesc, token)
                setLoading(false)
                if (cat) {
                  // refresh categories list & select new
                  const fresh = await fetchCourseCategories()
                  setCourseCategories(fresh)
                  setValue("courseCategory", cat._id)
                  setNewCatName("")
                  setNewCatDesc("")
                  setShowNewCategoryForm(false)
                }
              }}
            >
              Create
            </button>
          </div>
        )}

        {/* manage existing categories panel */}
        {(user?.accountType === "Admin" || user?.accountType === "Instructor") && showManagePanel && (
          <div ref={panelRef} className="absolute left-0 top-full mt-2 z-20 w-60 max-h-60 overflow-y-auto space-y-1 rounded bg-richblack-700 p-2 shadow-lg border border-richblack-600">
            {courseCategories?.map((cat) => (
              <div
                key={cat._id}
                className="flex items-center justify-between px-2 py-1 hover:bg-richblack-600 rounded"
              >
                <span className="truncate">{cat.name}</span>
                <button
                  type="button"
                  onClick={async () => {
                    if (!token) return toast.error("Please login first");
                    const confirmed = window.confirm("Delete category and its courses?");
                    if (!confirmed) return;
                    setLoading(true);
                    const ok = await deleteCourseCategory(cat._id, token);
                    setLoading(false);
                    if (ok) {
                      const fresh = await fetchCourseCategories();
                      setCourseCategories(fresh);
                      if (getValues().courseCategory === cat._id) {
                        setValue("courseCategory", "");
                      }
                    }
                  }}
                  className="text-red-400 hover:text-red-600 ml-2"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Course Tags */}
      <ChipInput
        label="Tags"
        name="courseTags"
        placeholder="Enter Tags and press Enter or Comma"
        register={register}
        errors={errors}
        setValue={setValue}
      />

      {/* Course Thumbnail Image */}
      <Upload
        name="courseImage"
        label="Course Thumbnail"
        register={register}
        setValue={setValue}
        errors={errors}
        editData={editCourse ? course?.thumbnail : null}
      />

      {/* Benefits of the course */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="courseBenefits">
          Benefits of the course <sup className="text-pink-200">*</sup>
        </label>
        <textarea
          id="courseBenefits"
          placeholder="Enter benefits of the course"
          {...register("courseBenefits", { required: true })}
          className="form-style resize-x-none min-h-[130px] w-full"
        />
        {errors.courseBenefits && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Benefits of the course is required
          </span>
        )}
      </div>

      {/* Requirements/Instructions */}
      <RequirementsField
        name="courseRequirements"
        label="Requirements/Instructions"
        register={register}
        setValue={setValue}
        errors={errors}
      />

      {/* Next Button */}
      <div className="flex justify-end gap-x-2">
        {editCourse && (
          <button
            onClick={() => dispatch(setStep(2))}
            disabled={loading}
            className={`flex cursor-pointer items-center gap-x-2 rounded-md py-[8px] px-[20px] font-semibold
              text-richblack-900 bg-richblack-300 hover:bg-richblack-900 hover:text-richblack-300 duration-300`}
          >
            Continue Wihout Saving
          </button>
        )}
        <IconBtn
          disabled={loading}
          text={!editCourse ? "Next" : "Save Changes"}
        >
          <MdNavigateNext />
        </IconBtn>
      </div>
    </form>
  )
}


