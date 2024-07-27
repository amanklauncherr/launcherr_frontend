import React from 'react';
import styles from './hotelcard.module.css';

const HotelCard = ({ hotel }) => {
    return (
        <div className={styles.card}>
            <div className={styles.imageContainer}>
                <img src={hotel.image} alt={hotel.name} className={styles.image} />
                <button className={styles.wishlistButton}>❤️</button>
            </div>
            <div className={styles.detailsContainer}>
                <div className={styles.header}>
                    <h2 className={styles.hotelName}>{hotel.name} ⭐⭐⭐⭐</h2>
                    <span className={styles.featuredBadge}>Featured</span>
                </div>
                <div className={styles.location}>
                    <a href={hotel.mapLink} className={styles.locationLink}>{hotel.location}</a>
                    <span> • {hotel.distance} from centre</span>
                </div>
                <div className={styles.roomDetails}>
                    <span className={styles.roomType}>{hotel.roomType}</span>
                    <span>{hotel.bedType}</span>
                </div>
                <div className={styles.cancellation}>
                    <p>✔️ Free cancellation</p>
                    <p>✔️ No prepayment needed – pay at the property</p>
                    <p className={styles.warning}>❗ Only 2 rooms left at this price on our site</p>
                </div>
            </div>
            <div className={styles.pricingContainer}>
                <div className={styles.review}>
                    <div className={styles.reviewScore}>{hotel.reviewScore}</div>
                    <span>{hotel.reviewsCount} reviews</span>
                </div>
                <div className={styles.price}>
                    <span className={styles.oldPrice}>₹{hotel.oldPrice}</span>
                    <span className={styles.newPrice}>₹{hotel.newPrice}</span>
                    <span className={styles.taxes}>+₹{hotel.taxes} taxes and charges</span>
                </div>
                <button className={styles.availabilityButton}>See availability</button>
            </div>
        </div>
    );
};

export default HotelCard;
