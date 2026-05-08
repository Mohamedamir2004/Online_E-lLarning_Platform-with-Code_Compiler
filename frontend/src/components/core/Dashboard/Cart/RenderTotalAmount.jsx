import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"

import IconBtn from "../../../common/IconBtn"
import { buyCourse } from "../../../../services/operations/studentFeaturesAPI"

export default function RenderTotalAmount() {
  const { total, cart } = useSelector((state) => state.cart)
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const { paymentLoading } = useSelector((state) => state.course)
  const navigate = useNavigate()
  const dispatch = useDispatch()


  const handleBuyCourse = async () => {
    try {
      if (!cart || cart.length === 0) {
        toast.error("Cart is empty");
        return
      }
      
      if (!token) {
        toast.error("Please login to purchase");
        navigate("/login");
        return;
      }
      
      if (!user) {
        toast.error("User information not found");
        return;
      }
      
      const courses = cart.map((course) => course._id)
      console.log('Starting purchase for courses:', courses)
      await buyCourse(token, courses, user, navigate, dispatch)
    } catch (error) {
      console.log('Error in handleBuyCourse:', error);
      toast.error(error.message || "Failed to process purchase");
    }
  }

  return (
    <div className="min-w-[280px] rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
      <p className="mb-1 text-sm font-medium text-richblack-300">Total:</p>
      <p className="mb-6 text-3xl font-medium text-yellow-100">₹ {total}</p>
      <IconBtn
        text={paymentLoading ? "Processing..." : "Buy Now"}
        onclick={handleBuyCourse}
        disabled={paymentLoading || !cart || cart.length === 0}
        customClasses="w-full justify-center"
      />
    </div>
  )
}