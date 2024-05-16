import React from 'react'
import styles from './product.module.css'
import ClockIcon from '../Icons/ClockIcon'
import PeopleIcon from '../Icons/PeopleIcon'
import LocationIcon from '../Icons/LocationIcon'
import { useRouter } from 'next/router'

const ProductCard = ({ img_url, duration, people, location, about, description, amount, review, rating }) => {
   const router = useRouter()

    const handleDetail = () => {
        router.push('/product-detail')
    }
    return (
        <>
            <div onClick={handleDetail} className={styles["package-card"]}>
                <div className={styles["amount-card-img"]}>

                    <img src={img_url} alt="" />
                </div>
                {/* <div className={styles["package-card-tenure"]}>
                   <p><ClockIcon /> {duration}</p> <p><PeopleIcon /> People: {people}</p>  <p><LocationIcon /> {location}</p> 
                </div> */}
                <div className={styles["package-card-info-container"]}>
                    <h2 className={styles["package-about"]}>{about}</h2>
                    <h6 className={styles["review"]}>({review} reviews) <span>{rating} Star</span> </h6>
                    <p className={styles["package-description"]}>{description}</p>

                    <h3 className={styles["amount"]}>₹{amount}</h3>
                    {/* <div className={styles["package_pricing"]}>
                        <p>₹{amount} /<span>Per Person</span></p>
                    </div> */}
                </div>
            </div>
        </>
    )
}

export default ProductCard