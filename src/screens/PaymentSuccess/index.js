import React from 'react'
import styles from './payment.module.css'
import Lottie from 'react-lottie-player'
import lottieJson from './my-lottie.json'
import { useRouter } from 'next/router'

const PaymentSuccess = () => {
    const router = useRouter();

    const handlehome  = () => {
        router.push('/')
    }
    return (
        <>
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
             
                <p>Click here to return to Home page</p>
                <button onClick={handlehome} className='btn-full'>
                    Home
                </button>
            </div>
            </div>
        </>
    )
}

export default PaymentSuccess