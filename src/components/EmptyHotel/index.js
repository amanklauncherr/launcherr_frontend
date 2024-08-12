import React, { useState, useEffect } from 'react';
import styles from './emptycart.module.css';
import mylotti from './empty.json';
import Lottie from 'react-lottie-player';

const EmptyHotel = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This will run only on the client side
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Prevent rendering on the server side
  }

  return (
    <div className={styles["empty-cart-main-container"]}>
      <p>No Data Found</p>
      <Lottie
        loop
        animationData={mylotti}
        play
        className={styles["empty-cart-inner"]}
        style={{ width: '100%', maxWidth: '280px', height: 'auto' }} // Responsive design
      />
    </div>
  );
}

export default EmptyHotel;
