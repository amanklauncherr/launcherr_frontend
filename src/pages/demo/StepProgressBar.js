import React from 'react';
import styles from './StepProgressBar.module.css';

const StepProgressBar = () => {
  return (
    <div className={styles.progressContainer}>
      <div className={`${styles.step} ${styles.active} `}>
        <span>Booking</span>
      </div>
      <div className={styles.progressLine}></div>
      <div className={styles.step}>
        <span>Purchase</span>
      </div>
      <div className={styles.progressLine}></div>
      <div className={styles.step}>
        <span>Get&nbsp;your&nbsp;E&nbsp;ticket</span>
      </div>
    </div>
  );
};

export default StepProgressBar;
