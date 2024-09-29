import styles from './BusTicketCard.module.css';

const BusTicketCard = ({ trip }) => {
    return (
        <div className={styles.card}>
            <div className={styles.details}>
                <div className={styles.busType}>
                    {trip.busType}
                </div>
                <div className={styles.timeLocation}>
                    <div>
                        <div className={styles.dateTime}>{new Date(trip.doj).toLocaleDateString()}</div>
                        <div className={styles.time}>{trip.departureTime}</div>
                        <div className={styles.location}>{trip.boardingTimes.bpName}</div>
                    </div>
                    <div className={styles.duration}>
                        <div>{trip.duration}</div>
                    </div>
                    <div>
                        <div className={styles.dateTime}>{new Date(trip.doj).toLocaleDateString()}</div>
                        <div className={styles.time}>{trip.droppingTimes.time}</div>
                        <div className={styles.location}>{trip.droppingTimes.bpName}</div>
                    </div>
                </div>
                <div className={styles.seatInfo}>
                    <div>Cancellation Policy: {trip.cancellationPolicy}</div>
                    <div>{trip.availableSeats} Seats Available</div>
                </div>
            </div>
            <div className={styles.priceSection}>
                <div className={styles.price}>Starting at ₹{trip.fareDetails.totalFare}</div>
                <button className={styles.seatButton}>Show Seats</button>
            </div>
        </div>
    );
};

export default BusTicketCard;
