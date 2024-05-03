import React from 'react'
import styles from './offer.module.css'

const OfferCard = ({ img_url, discount_percentage, Country, Offer_Description, del_amount, amount }) => {
    return (
        <>
            <div className={styles["offer-card-main-container"]}>
                <img src={img_url} alt="" />
                <div className={styles["discount-off"]}>
                   <p>{discount_percentage}%<br /><span>off</span></p>
                </div>
                <div className={styles["offer-card-inner"]}>
                    <p className={styles["country"]}>{Country}</p>
                    <p className={styles["offer-description"]}>{Offer_Description}</p>
                    <p className={styles["price"]}>
                        Price: <span><del>₹{del_amount}</del></span>&nbsp;&nbsp;<span>₹{amount}</span>
                    </p>
                </div>
            </div>
        </>
    )
}

export default OfferCard