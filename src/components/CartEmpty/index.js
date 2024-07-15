import React from 'react'
import styles from './emptycart.module.css'
import mylotti from './empty.json'
import Lottie from 'react-lottie-player'

const CartEmpty = () => {
  return (
    <>
        <div className={styles["empty-cart-main-container"]}>
            <p>Your Cart is Empty</p>
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

export default CartEmpty