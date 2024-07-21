import React, { useState } from 'react';
import styles from './FlightInfo.module.css';

const FlightInfo = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleBody = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div onClick={toggleBody} className={styles.card}>
      <div className={styles.header}>
        <div className={styles.airline}>
          <img src="https://logos-world.net/wp-content/uploads/2022/01/Akasa-Air-Emblem.png" alt="Akasa Air" className={styles.logo} />
          <span>Akasa Air</span>
        </div>
        <div className={styles.timeInfo}>
          <div>
            <div className={styles.time}>08:30</div>
            <div className={styles.airport}>DEL</div>
          </div>
          <div className={styles.duration}>
            <svg role="img" aria-hidden="true" viewBox="0 0 95 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 5c0-.552.498-1 1.113-1H82v2H1.113C.498 6 0 5.552 0 5Zm82-.143V0l12.277 4.668c.046.018.094.032.142.045.927.255.693 1.287-.336 1.287H82V4.857Z" fill="#B1B9CB"></path></svg>
            <span className={styles.durationTime}>2h 15m</span>
          </div>
          <div>
            <div className={styles.time}>10:45</div>
            <div className={styles.airport}>BOM</div>
          </div>
        </div>
        <div className={styles.priceInfo}>
          <div>
          <div className={styles.originalPrice}>Rs. 2,769</div>
          <div className={styles.discountedPrice}>Rs. 2,752</div>
          </div>
        <div className={styles["dropbtn"]} >
          {isOpen ?
           <>
            <svg width="24" height="15" viewBox="0 0 24 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.86299 14.6057L11.2325 3.07893C11.437 2.82612 11.7129 2.68433 12.0005 2.68433C12.2881 2.68433 12.564 2.82612 12.7685 3.07893L22.138 14.6032C22.3437 14.8559 22.6206 14.9975 22.909 14.9975C23.1974 14.9975 23.4743 14.8559 23.68 14.6032C23.7813 14.4798 23.8618 14.3323 23.9167 14.1693C23.9717 14.0064 24 13.8314 24 13.6545C24 13.4777 23.9717 13.3027 23.9167 13.1398C23.8618 12.9768 23.7813 12.8293 23.68 12.7059L14.3124 1.18154C13.6954 0.424273 12.8652 0 12.0005 0C11.1358 0 10.3056 0.424273 9.68862 1.18154L0.321067 12.7059C0.219468 12.8293 0.138707 12.977 0.0835603 13.1402C0.0284135 13.3033 0 13.4787 0 13.6558C0 13.8329 0.0284135 14.0083 0.0835603 14.1714C0.138707 14.3346 0.219468 14.4823 0.321067 14.6057C0.526768 14.8584 0.803631 15 1.09203 15C1.38043 15 1.65729 14.8584 1.86299 14.6057Z" fill="#2DAEFF" />
            </svg>
          </> : 
          <>
            <svg width="24" height="15" viewBox="0 0 24 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.137 0.394256L12.7675 11.9211C12.563 12.1739 12.2871 12.3157 11.9995 12.3157C11.7119 12.3157 11.436 12.1739 11.2315 11.9211L1.86197 0.396755C1.65627 0.144081 1.3794 0.00249894 1.09101 0.00249891C0.802606 0.00249889 0.525743 0.144081 0.320042 0.396755C0.218749 0.520191 0.138249 0.667721 0.0832841 0.830654C0.0283193 0.993586 1.73988e-06 1.16862 1.72442e-06 1.34545C1.70896e-06 1.52228 0.0283192 1.69731 0.083284 1.86024C0.138249 2.02318 0.218749 2.17071 0.320041 2.29414L9.6876 13.8185C10.3046 14.5757 11.1348 15 11.9995 15C12.8642 15 13.6944 14.5757 14.3114 13.8185L23.6789 2.29414C23.7805 2.17067 23.8613 2.02298 23.9164 1.85982C23.9716 1.69666 24 1.52133 24 1.3442C24 1.16707 23.9716 0.991745 23.9164 0.828582C23.8613 0.665418 23.7805 0.517731 23.6789 0.394256C23.4732 0.141582 23.1964 -1.69649e-08 22.908 -4.21776e-08C22.6196 -6.73903e-08 22.3427 0.141582 22.137 0.394256Z" fill="#2DAEFF" />
            </svg>
          </>
          }
        </div>
        </div>
      </div>

      {isOpen && (
        <>
          <div className={styles.body}>
            <div className={styles.flightDetails}>
              <div className={styles.flightSegment}>
                <div className={styles.segmentTime}>08:30</div>
                <div className={styles.segmentDate}>12 Aug</div>
                <div className={styles.airportInfo}>
                  <div>New Delhi and NCR (DEL)</div>
                </div>
              </div>

              <div className={styles.flightPath}>
                <div className={styles.flightSegment}>
                  <div className={styles.segmentTime}>10:45</div>
                  <div className={styles.segmentDate}>12 Aug</div>
                  <div className={styles.airportInfo}>
                    <div>Mumbai (BOM)</div>
                    <div>Chhatrapati Shivaji Maharaj International Airport</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.footer}>
            <button className={styles.addToCart}>Add to cart</button>
            <button className={styles.select}>Select</button>
          </div>
        </>
      )}
    </div>
  );
};

export default FlightInfo;
