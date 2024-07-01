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
                hbjhbjnj
                <button className='Explore'>{btn_name}
                    <svg width="19" height="16" viewBox="0 0 19 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.11437 14.2374C0.78199 14.4845 0.712923 14.9544 0.960103 15.2868C1.20728 15.6191 1.67711 15.6882 2.00948 15.441L1.11437 14.2374ZM18.6802 2.76971C18.7405 2.3599 18.4571 1.97884 18.0473 1.9186L11.3691 0.936865C10.9593 0.876621 10.5782 1.16 10.518 1.56981C10.4577 1.97962 10.7411 2.36067 11.1509 2.42092L17.0871 3.29357L16.2144 9.22977C16.1542 9.63958 16.4376 10.0206 16.8474 10.0809C17.2572 10.1411 17.6383 9.85774 17.6985 9.44793L18.6802 2.76971ZM2.00948 15.441L18.3858 3.26245L17.4906 2.0588L1.11437 14.2374L2.00948 15.441Z" fill="white" />
                </svg>
                </button>
                <div className={styles["bottom-filter"]}>
                    {children}
                </div>
            </div>
        </>
    )
}

export default ImageLayoutHome