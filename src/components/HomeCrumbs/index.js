import React from 'react';
import styles from './homecrumbs.module.css';

const HomeCrumbs = ({id, Crumb_Info, Crumb_Descripton, Crumb_About, children, btn_name, onClick }) => {
    return (
        <div id={id} className={styles["crumbs-main-container"]}>
            <div className={styles["crumbs-main-container-inner"]}>
                {Crumb_About &&
                    <p className={styles["crumbs-info"]}>
                        {Crumb_About}
                    </p>
                }
                {Crumb_Info &&
                    <h1 className={styles["crumbs-heading"]}>
                        {Crumb_Info}
                    </h1>
                }
                {Crumb_Descripton &&
                    <h6 className={styles["crumbs-description"]}>
                        {Crumb_Descripton}
                    </h6>
                }
            </div>
            <div className={styles["grid-gallery"]}>
                {children}
            </div>
            {btn_name &&
                <button onClick={onClick} className='btn-primary'>{btn_name}</button>
            }
        </div>
    );
};

export default HomeCrumbs;
