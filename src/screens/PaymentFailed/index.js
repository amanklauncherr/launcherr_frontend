import React, { useState, useEffect } from 'react';
import styles from './payment.module.css';
import { useRouter } from 'next/router';
import PaymentFailure from '@/components/PaymentFailure';

const PaymentFailed = () => {
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
             <PaymentFailure/>

            <div className={styles["absolute-text"]}>
                <h1>Payment Failed</h1>
                <p>Click here to return to the Home page</p>
                <button onClick={handleHome} className='btn-full'>
                    Home
                </button>
            </div>
        </div>
    );
}

export default PaymentFailed;
