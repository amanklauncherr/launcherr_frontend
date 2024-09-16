import styles from './BusTicketCard.module.css';

const BusTicketCard = () => {
  return (
    <div className={styles.card}>
      <div className={styles.details}>
        <div className={styles.busType}>
          Non A/c Semi Sleeper / Sleeper (2+1)
        </div>
        <div className={styles.timeLocation}>
          <div>
            <div className={styles.dateTime}>04-Sep</div>
            <div className={styles.time}>22:30</div>
            <div className={styles.location}>Bangalore</div>
          </div>
          <div className={styles.duration}>
            <div>9h 30m</div>
          </div>
          <div>
            <div className={styles.dateTime}>05-Sep</div>
            <div className={styles.time}>08:00</div>
            <div className={styles.location}>Hyderabad</div>
          </div>
        </div>
        <div className={styles.seatInfo}>
          <div>Cancellation Policy</div>
          <div>18 Seats Available</div>
        </div>
      </div>
      <div className={styles.priceSection}>
        <div className={styles.price}>Starting at ₹668.00</div>
        <button className={styles.seatButton}>Show Seats</button>
      </div>
    </div>
  );
};

export default BusTicketCard;
