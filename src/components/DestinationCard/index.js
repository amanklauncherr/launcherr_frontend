import React from 'react'
import styles from './destinationcard.module.css'
import { useRouter } from 'next/router'

const DestinationCard = ({ img_url, country, state_city, duration, amount }) => {
    const router = useRouter();
    const handlebook = () => {
        router.push('/book')
    }
    return (
        <>
            <div className={styles["destination-card-main-container"]}>
                <img src={img_url} alt="" />
                <div className={styles["destinatiom-card-inner"]}>
                    <h2 className={styles["country"]}>{country}</h2>
                    <h3 className={styles["state_city"]}>{state_city}</h3>
                    <h3 className={styles["duration"]}>{duration}</h3>
                    <h3 className={styles["amount"]}>Rs.{amount}</h3>
                    <button onClick={handlebook} className='book-btn-primary'>Book Now</button>
                </div>
            </div>
        </>
    )
}

export default DestinationCard