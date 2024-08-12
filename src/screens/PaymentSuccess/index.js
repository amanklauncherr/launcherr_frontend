import React, { useState, useEffect } from 'react';
import styles from './payment.module.css';
import Lottie from 'react-lottie-player';
import lottieJson from './my-lottie.json';
import { useRouter } from 'next/router';

const PaymentSuccess = () => {
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        // This will run only on the client side
        setIsClient(true);
    }, []);

    const handleHome = () => {
        router.push('/');
    };

    if (!isClient) {
        return null; // Prevent rendering on the server side
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
                <button onClick={handleHome} className='btn-full'>
                    Home
                </button>
            </div>
        </div>
    );
}

export default PaymentSuccess;
