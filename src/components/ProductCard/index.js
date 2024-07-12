import React from 'react';
import styles from './product.module.css';
import ClockIcon from '../Icons/ClockIcon';
import PeopleIcon from '../Icons/PeopleIcon';
import LocationIcon from '../Icons/LocationIcon';
import { useRouter } from 'next/router';

const ProductCard = ({ ProductId, rating_count, average_rating, regular_price, img_url, about, description, amount }) => {
    const router = useRouter();

    // console.log(id)
    const handleDetail = () => {
        router.push(`/product-detail?id=${ProductId}`);
    };

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
        <div onClick={handleDetail} className={styles["package-card"]}>
            <div className={styles["amount-card-img"]}>
                <img src={img_url} alt="" />
            </div>
            <div className={styles["package-card-info-container"]}>
                <h2 className={styles["package-about"]}>{about}</h2>
                <div className={styles["rating"]}>
                    {renderStars(average_rating)}
                    <span>({rating_count} reviews)</span>
                </div>
                <p
                    className={styles["package-description"]}
                    dangerouslySetInnerHTML={{ __html: description }}
                />
                <h2 className={styles["amount"]}><del>₹{regular_price}</del></h2> &nbsp;&nbsp;
                <h3 className={styles["amount"]}>₹{amount}</h3>
            </div>
        </div>
    );
};

export default ProductCard;
