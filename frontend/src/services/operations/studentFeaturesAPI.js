import { toast } from "react-hot-toast";
import { studentEndpoints } from "../apis";
import { apiConnector } from "../apiConnector";
import rzpLogo from "../../assets/Logo/rzp_logo.png"
import { setPaymentLoading } from "../../slices/courseSlice";
import { resetCart } from "../../slices/cartSlice";


const { COURSE_PAYMENT_API, COURSE_VERIFY_API, SEND_PAYMENT_SUCCESS_EMAIL_API } = studentEndpoints;

function loadScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;

        script.onload = () => {
            resolve(true);
        }
        script.onerror = () => {
            resolve(false);
        }
        document.body.appendChild(script);
    })
}

// ================ buyCourse ================ 
export async function buyCourse(token, coursesId, userDetails, navigate, dispatch) {
    const toastId = toast.loading("Processing your payment...");
    dispatch(setPaymentLoading(true));

    try {
        console.log('BuyCourse Called with coursesId:', coursesId);
        
        if (!coursesId || coursesId.length === 0) {
            throw new Error('No courses selected for purchase');
        }
        
        if (!token) {
            throw new Error('User not authenticated');
        }
        
        // initiate the order
        console.log('Initiating payment with coursesId:', coursesId);
        const orderResponse = await apiConnector("POST", COURSE_PAYMENT_API,
            { coursesId },
            {
                Authorization: `Bearer ${token}`,
            })
        console.log("Payment API Response: ", orderResponse);
        
        if (!orderResponse?.data?.success) {
            throw new Error(orderResponse?.data?.message || "Could not initiate payment");
        }

        if (!orderResponse?.data?.message?.id) {
            throw new Error("Invalid payment response - no order ID received");
        }

        // Mock payment success
        console.log('Creating mock payment response...');
        const mockResponse = {
            razorpay_order_id: orderResponse.data.message.id,
            razorpay_payment_id: "pay_mock_" + Math.random().toString(36).substr(2, 9),
            razorpay_signature: "mock_signature"
        };
        
        console.log('Sending payment success email...');
        try {
            sendPaymentSuccessEmail(mockResponse, orderResponse.data.message.amount, token);
        } catch (emailError) {
            console.log('Email sending failed (non-critical):', emailError);
        }
        
        console.log('Verifying payment with backend...');
        verifyPayment({ ...mockResponse, coursesId }, token, navigate, dispatch);

    }
    catch (error) {
        console.log("PAYMENT API ERROR:", error);
        toast.error(error.response?.data?.message || error.message || "Payment failed");
        dispatch(setPaymentLoading(false));
    }
    finally {
        toast.dismiss(toastId);
    }
}


// ================ send Payment Success Email ================
async function sendPaymentSuccessEmail(response, amount, token) {
    try {
        await apiConnector("POST", SEND_PAYMENT_SUCCESS_EMAIL_API, {
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            amount,
        }, {
            Authorization: `Bearer ${token}`
        })
    }
    catch (error) {
        console.log("PAYMENT SUCCESS EMAIL ERROR....", error);
    }
}


// ================ verify payment ================
async function verifyPayment(bodyData, token, navigate, dispatch) {
    const toastId = toast.loading("Verifying Payment....");
    dispatch(setPaymentLoading(true));

    try {
        console.log('Verifying payment with body:', bodyData);
        const response = await apiConnector("POST", COURSE_VERIFY_API, bodyData, {
            Authorization: `Bearer ${token}`,
        })
        
        console.log('Payment verification response:', response);

        if (!response.data.success) {
            throw new Error(response.data.message || "Payment verification failed");
        }
        
        console.log('Payment verified successfully, navigating to enrolled courses');
        toast.success("Payment Successful! You are now enrolled in the course");
        
        // Reset cart before navigation
        dispatch(resetCart());
        
        // Navigate after a short delay to allow toast and state updates
        setTimeout(() => {
            navigate("/dashboard/enrolled-courses");
        }, 1000);
    }
    catch (error) {
        console.log("PAYMENT VERIFY ERROR....", error);
        console.log("Error response:", error.response);
        toast.error(error.response?.data?.message || error.message || "Could not verify Payment");
        dispatch(setPaymentLoading(false));
    }
    toast.dismiss(toastId);
}