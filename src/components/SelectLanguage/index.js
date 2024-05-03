import React, { useEffect, useState } from 'react'
import styles from './language.module.css'
import Navbar from '../Navbar';

const SelectLanguage = ({onClick}) => {
    return (
        <>
            <div className={styles['auth-form']}>
                <div className={styles["auth-form-inner"]}>
                <h3>
                    What is your  <span className='iv'>preferred</span> language?
                </h3>
                <h3 className={styles["hinditext"]}>
                    आपकी पसंदीदा भाषा कौन सी है?
                </h3>
                <div className={styles['handle-language-button']}>
                    <button onClick={onClick} className={styles['btn-eng']}>English</button>
                    <button onClick={onClick} className={styles['btn-hindi']}>हिन्दी</button>
                </div>
                </div>
            </div>
        </>
    )
}

export default SelectLanguage;