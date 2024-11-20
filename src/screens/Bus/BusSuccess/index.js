import React, { useState, useEffect } from 'react';
import styles from './payment.module.css';
import Lottie from 'react-lottie-player';
import lottieJson from './my-lottie.json';
import { useRouter } from 'next/router';
import Loader from '../../../components/Loader'
import Cookies from 'js-cookie';

const BusSuccess = () => {
    const router = useRouter();

    const [isClient, setIsClient] = useState(false);
    const [loading, setLoading] = useState(true);
    const [apiResponse, setApiResponse] = useState(null);

    const { userRef, amount, baseFare, referenceKey, passengerPhone, passengerEmail } = router.query;

    useEffect(() => {
        // This will run only on the client side
        setIsClient(true);
        const authToken = Cookies.get('auth_token');
        // Check if query parameters are available
        if (authToken) {
            if (userRef && amount && baseFare && referenceKey && passengerPhone && passengerEmail) {
                // Prepare the payload
                const payload = {
                    userRef,
                    amount,
                    baseFare,
                    referenceKey,
                    passengerPhone,
                    passengerEmail
                };

                // Call the API
                fetch('https://api.launcherr.co/api/Book/Ticket', {
                    method: 'POST',
                    headers: { 
                        Authorization: `Bearer ${authToken}` 
                    },
                    body: JSON.stringify(payload),
                })
                    .then((response) => response.json())
                    .then((data) => {
                        // Set the API response
                        setApiResponse(data);
                        setLoading(false);
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                        setLoading(false);
                    });
            }
        }
    }, [router.query]);

    const handleHome = () => {
        router.push('/');
    };

    if (!isClient || loading) {
        return (
            <div className={styles["loader-container"]}>
                {/* Add your Loader component or any loading animation here */}
                <Loader />
            </div>
        ); // Show loading spinner until the API is called
    }

    // Render the success message after the API is successful
    return (
        <div className={styles["paymentsucces-main-container"]}>
            <Lottie
                loop
                animationData={lottieJson}
                play
                style={{ width: 550, height: 750 }}
            />

            <div className={styles["absolute-text"]}>
                {/* Change the text as needed */}
                <h1>Thank You!</h1>
                <p>Your bus ticket has been successfully booked!</p>

                {/* If API response has a success message, show it */}
                <p>{apiResponse?.message || 'Your booking was successful!'}</p>

                <button onClick={handleHome} className='btn-full'>
                    Go to Home
                </button>
            </div>
        </div>
    );
};

export default BusSuccess;
