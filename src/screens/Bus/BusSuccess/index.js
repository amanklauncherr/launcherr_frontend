import React, { useState, useEffect } from 'react';
import styles from './payment.module.css';
import Lottie from 'react-lottie-player';
import lottieJson from './my-lottie.json';
import { useRouter } from 'next/router';
import Loader from '../../../components/Loader';
import Cookies from 'js-cookie';
import axios from 'axios';

const BusSuccess = () => {
    const router = useRouter();

    const [isClient, setIsClient] = useState(false);
    const [loading, setLoading] = useState(true);
    const [apiResponse, setApiResponse] = useState(null);
    const [encryptedToken, setEncryptedToken] = useState('');
    const [encryptedKey, setEncryptedKey] = useState('');
    const { userRef, amount, baseFare, referenceKey, passengerPhone, passengerEmail } = router.query;

    useEffect(() => {
        // Ensure this runs on the client side only
        setIsClient(true);
    }, []);

    useEffect(() => {
        // Fetch encrypted token and key
        const getEncryptedCredentials = async () => {
            try {
                const response = await axios.get('https://api.launcherr.co/api/AES/Encryption');
                if (response.data) {
                    setEncryptedToken(response.data.encrypted_token);
                    setEncryptedKey(response.data.encrypted_key);
                }
            } catch (error) {
                console.error('Error fetching encrypted credentials:', error);
            }
        };
        getEncryptedCredentials();
    }, []);

    useEffect(() => {
        // Check if all required query parameters and encrypted credentials are available
        const bookTicket = async () => {
            if (
                userRef &&
                amount &&
                baseFare &&
                referenceKey &&
                passengerPhone &&
                passengerEmail &&
                encryptedToken &&
                encryptedKey
            ) {
                const authToken = Cookies.get('auth_token'); // Get auth token from cookies

                if (authToken) {
                    // Prepare payload for the API call
                    const payload = {
                        headersToken: encryptedToken,
                        headersKey: encryptedKey,
                        userRef,
                        amount,
                        baseFare,
                        referenceKey,
                        passengerPhone,
                        passengerEmail,
                    };

                    console.log('Payload:', payload); // Debugging: log payload

                    try {
                        const response = await axios.post('https://api.launcherr.co/api/Book/Ticket', payload, {
                            headers: {
                                Authorization: `Bearer ${authToken}`,
                                'Content-Type': 'application/json',
                            },
                        });
                        console.log('API Response:', response.data); // Debugging: log API response
                        setApiResponse(response.data);
                        setLoading(false); // Stop loading spinner
                    } catch (error) {
                        console.error('Error calling the booking API:', error);
                        setLoading(false);
                    }
                } else {
                    console.error('Auth token is missing');
                }
            }
        };

        bookTicket();
    }, [userRef, amount, baseFare, referenceKey, passengerPhone, passengerEmail, encryptedToken, encryptedKey]);

    const handleHome = () => {
        router.push('/');
    };

    if (!isClient || loading) {
        return (
            <div className={styles['loader-container']}>
                <Loader /> {/* Show loading spinner until the API call completes */}
            </div>
        );
    }

    // Render the success message after the API call is successful
    return (
        <div className={styles['paymentsucces-main-container']}>
            <Lottie
                loop
                animationData={lottieJson}
                play
                style={{ width: 550, height: 750 }}
            />

            <div className={styles['absolute-text']}>
                <h1>Thank You!</h1>
                <p>Your bus ticket has been successfully booked!</p>

                {/* Display success message from API response */}
                <p>{apiResponse?.message || 'Your booking was successful!'}</p>

                <button onClick={handleHome} className="btn-full">
                    Go to Home
                </button>
            </div>
        </div>
    );
};

export default BusSuccess;
