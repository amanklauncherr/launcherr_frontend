import React from 'react'
import styles from './product.module.css'
import ClockIcon from '../Icons/ClockIcon'
import PeopleIcon from '../Icons/PeopleIcon'
import LocationIcon from '../Icons/LocationIcon'
import { useRouter } from 'next/router'

const ProductCard = ({rating_count, average_rating, regular_price, images, price_html, img_url, duration, people, location, about, description, amount, review, rating }) => {
    const router = useRouter()

    const handleDetail = () => {
        router.push('/product-detail')
    }

    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

        return (
            <div className={styles.stars}>
                {Array(fullStars).fill().map((_, i) => (
                    <span key={i} className={styles.starFull}>★</span>
                ))}
                {halfStar && <span className={styles.starHalf}>★</span>}
                {Array(emptyStars).fill().map((_, i) => (
                    <span key={i} className={styles.starEmpty}>★</span>
                ))}
            </div>
        );
    };
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
                    <div className={styles["rating"]}>
                        {renderStars(average_rating)}
                        <span>({rating_count} reviews)</span>
                    </div>
                    {/* <h6 className={styles["review"]}>({review} reviews) <span>{rating} Star</span> </h6> */}
                    <p
                        className={styles["package-description"]}
                        dangerouslySetInnerHTML={{ __html: description }}
                    />
                     <h2 className={styles["amount"]}><del>₹{regular_price}</del></h2> &nbsp;&nbsp;
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