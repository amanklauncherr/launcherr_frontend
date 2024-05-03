import React, { Children } from 'react'
import styles from './imagelayout.module.css'

const ImageLayout = ({ Img_url, children, heading }) => {
    return (
        <>
            <div className={styles["imagelayout-container"]}>
                <img className={styles['main-img']} src={Img_url} alt="" />
                <div className={styles["bottom-img"]}>
                    <img src="/images/bottom.svg" alt="" />
                </div>
                <div className={styles["text-heading"]}>
                    <h1>
                         {heading}
                    </h1>
                </div>
                <div className={styles["bottom-filter"]}>
                    {children}
                </div>
            </div>
        </>
    )
}

export default ImageLayout