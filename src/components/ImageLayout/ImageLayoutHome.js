import React, { Children } from 'react'
import styles from './imagelayout.module.css'

const ImageLayoutHome = ({ btn_name, subheading, Img_url, children, heading }) => {
    return (
        <>
            <div className={styles["imagelayout-container"]}>
                <img className={styles['main-img']} src={Img_url} alt="" />
                <div className={styles["bottom-img"]}>
                    <img src="/images/bottom.svg" alt="" />
                </div>
                <div className={styles["text-heading-home"]}>
                    <h1>
                        {heading}
                    </h1>
                    <p>
                        {subheading}
                    </p>
                </div>
                <div className={styles["bottom-filter"]}>
                    {children}
                </div>
            </div>
        </>
    )
}

export default ImageLayoutHome