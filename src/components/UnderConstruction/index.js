import React from 'react'
import styles from './Loader.module.css'
import mylotti from './search.json';
import Lottie from 'react-lottie-player';
import { useRouter } from 'next/router';


const UnderConstruction = () => {
  const router = useRouter();

  const handleback = () => {
   router.back();
  }
  return (
    <>
      <div className={styles["flight-anim-container"]}>
        <img src="/logo.svg" alt="" />
        <Lottie
          loop
          animationData={mylotti}
          play
        />
        <button onClick={handleback} className='btn'>
          Home
        </button>
      </div>
    </>
  )
}

export default UnderConstruction