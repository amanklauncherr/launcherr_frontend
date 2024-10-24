import React from 'react'
import styles from './Loader.module.css'
import mylotti from './search.json';
import Lottie from 'react-lottie-player';

const FlightSearchLaod = () => {
  return (
    <>
      <div className={styles["flight-anim-container"]}>
        <img src="/logo.svg" alt="" />
        <Lottie
          loop
          animationData={mylotti}
          play
        />
      </div>
    </>
  )
}

export default FlightSearchLaod