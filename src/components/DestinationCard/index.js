import React from 'react'
import styles from './destinationcard.module.css'
import { useRouter } from 'next/router'

const DestinationCard = ({ thumbnail_image, name, short_description, duration, description }) => {
    const router = useRouter();
    const handlebook = () => {
        router.push('/book')
    }
    return (
        <>
            <div className={styles["destination-card-main-container"]}>
                <img src={thumbnail_image} alt="" />
                <div className={styles["destinatiom-card-inner"]}>
                    <h2 className={styles["country"]}>{name}</h2>
                    <h3 className={styles["short_description"]}>{short_description}</h3>
                    <h4 className={styles["description"]}>{description}</h4>
                    <h3 className={styles["duration"]}>{duration}</h3>
                    {/* <button onClick={handlebook} className='book-btn-primary'>Book Now</button> */}
                </div>
            </div>
        </>
    )
}

export default DestinationCard