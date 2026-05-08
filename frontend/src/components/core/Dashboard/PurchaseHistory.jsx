import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { apiConnector } from '../../../services/apiConnector';
import { paymentsEndpoints } from '../../../services/apis';

const PurchaseHistory = () => {
    const [purchaseHistory, setPurchaseHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useSelector((state) => state.auth);

    useEffect(() => {
        const fetchPurchaseHistory = async () => {
            try {
                const response = await apiConnector('GET', paymentsEndpoints.GET_PURCHASE_HISTORY_API, { token }, {
                    Authorization: `Bearer ${token}`,
                });
                setPurchaseHistory(response.data.data);
            } catch (error) {
                console.error('Error fetching purchase history:', error);
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchPurchaseHistory();
        } else {
            setLoading(false);
        }
    }, [token]);

    if (loading) {
        return <div className="text-center text-white">Loading...</div>;
    }

    return (
        <div className="text-white">
            <h1 className="text-3xl font-bold mb-6">Overview</h1>
            {purchaseHistory.length === 0 ? (
                <p>No purchases found.</p>
            ) : (
                <div className="space-y-4">
                    {purchaseHistory.map((payment) => (
                        <div key={payment._id} className="bg-richblack-700 p-4 rounded-lg">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-lg font-semibold">Order ID: {payment.orderId}</p>
                                    <p>Payment ID: {payment.paymentId}</p>
                                    <p>Amount: ₹{payment.amount / 100}</p>
                                    <p>Date: {new Date(payment.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className={`px-2 py-1 rounded ${payment.status === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                                        {payment.status}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-4">
                                <h3 className="text-md font-semibold">Courses Purchased:</h3>
                                <ul className="list-disc list-inside">
                                    {payment.courses.map((course) => (
                                        <li key={course._id || course}>{course.courseName || 'Course Name Not Available'}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PurchaseHistory;