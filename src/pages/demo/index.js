import FlightSearchLaod from '@/components/FlightSearchLaod'
import React from 'react'
import styles from './style.module.css'

const index = () => {
    return (
        <>
            <div className={styles["flight-anim-container"]}>
               <img src="/logo.svg" alt=""/>
                <FlightSearchLaod />
            </div>
        </>
    )
}

export default index