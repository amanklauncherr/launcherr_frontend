import React, { Children } from 'react'
import styles from './homecrumbs.module.css'

const HomeCrumbs = ({ Crumb_Info, Crumb_Descripton, Crumb_About, children, btn_name, onClick }) => {
    return (
        <>
            <div className={styles["crumbs-main-container"]}>
                <div className={styles["crumbs-main-container-inner"]}>
                    <p className={styles["crumbs-info"]}>
                        {Crumb_About}
                    </p>
                    <h1 className={styles["crumbs-heading"]}>
                        {Crumb_Info}
                    </h1>
                    <h6 className={styles["crumbs-description"]}>
                        {Crumb_Descripton}
                    </h6>
                </div>
                <div className={styles["grid-gallery"]}>
                    {children}
                </div>
                <button onClick={onClick} className='btn-primary'>{btn_name}</button>
            </div>
        </>
    )
}

export default HomeCrumbs