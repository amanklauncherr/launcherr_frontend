import React, { useState, useEffect } from 'react';
import styles from './payment.module.css';
import Lottie from 'react-lottie-player';
import lottieJson from './my-lottie.json';
import { useRouter } from 'next/router';
import axios from 'axios';
import Cookies from 'js-cookie';
import Loader from '@/components/Loader';

const PaymentSuccessProduct = () => {
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);
    const [loading, setLoading] = useState(true); // Loader state
    const { orderId } = router.query; // Extract OrderID from URL query

    useEffect(() => {
        // Ensure client-side rendering
        setIsClient(true);
    }, []);

    useEffect(() => {
        const authToken = Cookies.get('auth_token');
        if (orderId) {
            const updateOrderStatus = async () => {
                try {
                    const response = await axios.post(
                        'https://api.launcherr.co/api/get/Order/Detail',
                        {
                            OrderID: orderId,
                            // OrderStatus: 'PaymentSuccess', // Change this as needed
                        },
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${authToken}`,
                            },
                        }
                    );

                    console.log('Order status updated successfully:', response.data);
                } catch (error) {
                    console.error('Error updating order status:', error.response?.data || error.message);
                } finally {
                    setLoading(false); // Stop loading after API response
                }
            };

            updateOrderStatus();
        } else {
            setLoading(false); // Stop loading if OrderID is not available
        }
    }, [orderId]);

    const handleHome = () => {
        router.push('/');
    };

    if (!isClient) {
        return null; // Prevent rendering on the server side
    }

    if (loading) {
        return <Loader />; // Show loader while waiting for API response
    }

    return (
        <div className={styles["paymentsucces-main-container"]}>
            <Lottie
                loop
                animationData={lottieJson}
                play
                style={{ width: 550, height: 750 }}
            />

            <div className={styles["absolute-text"]}>
                <h1>Thank You!</h1>
                <h4>Payment done Successfully</h4>

                <p>Click here to return to the Home page</p>
                <button onClick={handleHome} className="btn-full">
                    Home
                </button>
            </div>
        </div>
    );
};

export default PaymentSuccessProduct;
