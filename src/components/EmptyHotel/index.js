import React from 'react'
import styles from './emptycart.module.css'
import mylotti from './empty.json'
import Lottie from 'react-lottie-player'

const EmptyHotel = () => {
  return (
    <>
        <div className={styles["empty-cart-main-container"]}>
            <p>No Hotels Found</p>
        <Lottie
                loop
                animationData={mylotti}
                play
                className={styles["empty-cart-inner"]}
            />
        </div>
    </>
  )
}

export default EmptyHotel