import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './bus.module.css';

const BusSeats = () => {
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [maxSeats, setMaxSeats] = useState(6); // Example max seats per ticket

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const response = await axios.post('https://api.launcherr.co/api/Current/Trip/Details', {
          tripId: '1000008350592659281',
        });

        console.log("response", response.data.data.payloads.data.tripDetails.seats);

        const seatsData = response.data.data.payloads.data.tripDetails.seats;
        setSeats(seatsData);
      } catch (error) {
        console.error('Error fetching seat data:', error);
      }
    };

    fetchSeats();
  }, []);

  const handleSeatSelect = (seat) => {
    // Check if the seat is available
    if (!seat.available) return;

    // If maxSeats are selected, prevent further selection
    if (selectedSeats.length >= maxSeats && !selectedSeats.includes(seat.name)) {
      alert(`You can only select up to ${maxSeats} seats.`);
      return;
    }

    // Toggle seat selection
    if (selectedSeats.includes(seat.name)) {
      setSelectedSeats(selectedSeats.filter((selectedSeat) => selectedSeat !== seat.name));
    } else {
      setSelectedSeats([...selectedSeats, seat.name]);
    }
  };

  const renderSeats = () => {
    // Create seat matrix rows and columns (example: 4 seats per row)
    const seatRows = [];
    let currentRow = [];

    seats.forEach((seat, index) => {
      if (currentRow.length === 4) {  // Example: 4 seats per row
        seatRows.push(currentRow);
        currentRow = [];
      }

      currentRow.push(seat);
    });

    if (currentRow.length > 0) {
      seatRows.push(currentRow);
    }

    return seatRows.map((row, rowIndex) => (
      <div key={rowIndex} className={styles.row}>
        {row.map((seat) => (
          <div
            key={seat.name}
            className={`${styles.seat} 
              ${!seat.available ? styles.unavailable : ''} 
              ${selectedSeats.includes(seat.name) ? styles.selected : ''}
              ${seat.type === 'window' ? styles.window : ''}
              ${seat.type === 'aisle' ? styles.aisle : ''}
              ${seat.type === 'driver' ? styles.driver : ''}`}
            onClick={() => handleSeatSelect(seat)}
          >
            {seat.type === 'driver' ? (
              <span className={styles.driverIcon}>🚗</span>  // Steering wheel icon
            ) : null}
            {seat.name}
          </div>
        ))}
      </div>
    ));
  };

  return (
    <div className={styles.seatSelection}>
      <h2>Select Your Seats</h2>
      <div className={styles.seatMatrix}>
        {renderSeats()}
      </div>
      <div className={styles.selectedSeats}>
        <h3>Selected Seats: </h3>
        {selectedSeats.join(', ')}
      </div>
    </div>
  );
};

export default BusSeats;
