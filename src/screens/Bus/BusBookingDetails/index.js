import styles from './busbooking.module.css';

const BusBookingDetails = () => {
  // Static data based on your provided information
  const data = {
    bookingStatus: "BOOKED",
    busType: "Bharat benz A/C Seater (2+1)",
    dateOfJourney: "2024-08-30T00:00:00+05:30",
    dropDetails: {
      destinationCity: "Hyderabad",
    },
    inventoryItems: {
      fare: "10.00",
      passenger: {
        name: "Passenger Name",
      },
    },
    pickupDetails: {
      pickupTime: 420, // Time in minutes (e.g., 07:00 AM)
      sourceCity: "Bangalore",
    },
    inventoryId: "2000000149900071485",
  };

  // Helper function to format time
  const formatTime = (time) => {
    const hours = Math.floor(time / 60);
    const minutes = time % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} AM`;
  };

  return (
    <div className={styles.bookingContainer}>
      <h2 className={styles.bookingTitle}>Your Booking</h2>

      <div className={styles.infoContainer}>
        <div className={styles.busIcon}>🚌</div>
        <div>
          <div className={styles.departure}>
            <span className={styles.time}>{formatTime(data.pickupDetails.pickupTime)}</span>
            <span className={styles.date}>{new Date(data.dateOfJourney).toLocaleDateString()}</span>
          </div>
          <div className={styles.route}>
            {data.pickupDetails.sourceCity} ➔ {data.dropDetails.destinationCity}
          </div>
          <div className={styles.duration}>30 min</div>
        </div>
      </div>

      <div className={styles.separator}></div>

      <div className={styles.driverInfo}>
        <div className={styles.busInfo}>
          <div>Bus Number: {data.inventoryId.slice(-6)}</div>
          <div className={styles.driverDetails}>
            Bus Driver: <span>Johnny</span> (ID: AA-D-01)
          </div>
        </div>
      </div>

      <div className={styles.passengerInfo}>
        <div className={styles.passengerIcon}>👤</div>
        <span>{data.inventoryItems.passenger.name}</span>
        <span className={styles.passengerCount}>(2 Passengers)</span>
      </div>

      <div className={styles.fareDetails}>
        <span className={styles.pricePerPerson}>${data.inventoryItems.fare}/person</span>
        <span className={styles.totalPrice}>Total: ${parseFloat(data.inventoryItems.fare) * 2}</span>
      </div>

      <button className={styles.paymentButton}>Payment</button>
    </div>
  );
};

export default BusBookingDetails;
