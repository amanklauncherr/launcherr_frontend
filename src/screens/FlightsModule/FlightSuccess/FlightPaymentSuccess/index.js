import React, { useState, useEffect, Children } from 'react';
import styles from './payment.module.css';
import Lottie from 'react-lottie-player';
import lottieJson from './my-lottie.json';
import { useRouter } from 'next/router';

const FlightPaymentSuccess = ({btn_name, onclick, paragraph, heading, children}) => {
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
                {/* <h1>Thank You!</h1> */}
                <h1>{heading}</h1>

                <p>{paragraph}</p>
                {children}
                <button onClick={onclick} className='btn-full'>
                    {btn_name}
                </button>
             
            </div>
        </div>
    );
}

export default FlightPaymentSuccess;
