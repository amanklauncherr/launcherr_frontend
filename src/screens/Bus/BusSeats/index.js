import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './bus.module.css';
import BookingForm from '../BookingForm';

const BusSeats = ({ TotalFare, tripid, boardingPoint, dropingPoint, sourceId, destinationId }) => {
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [maxSeats, setMaxSeats] = useState(6); // Example max seats per ticket
  const [calculatedFare, setCalculatedFare] = useState(0);

  console.log('tripid', tripid, "boardingPoint", boardingPoint, "dropingPoint", dropingPoint, "sourceId", sourceId, "destinationId", destinationId)


  useEffect(() => {
    setCalculatedFare(TotalFare * selectedSeats.length);
  }, [TotalFare, selectedSeats.length]);  


  useEffect(() => {
    const fetchSeats = async () => {
      if (!tripid) return; // Wait until tripid is available

      try {
        const response = await axios.post('https://api.launcherr.co/api/Current/Trip/Details', {
          tripId: tripid,
        });

        console.log("response", response.data.data.payloads.data.tripDetails.seats);

        const seatsData = response.data.data.payloads.data.tripDetails.seats;
        setSeats(seatsData);
      } catch (error) {
        console.error('Error fetching seat data:', error);
      } finally {
        setLoading(false); // Stop loading once the data is fetched
      }
    };

    fetchSeats();
  }, [tripid]); // Depend on tripid to only fetch when it's available

  const handleSeatSelect = (seat) => {
    if (!seat.available) return;

    if (selectedSeats.length >= maxSeats && !selectedSeats.includes(seat.name)) {
      alert(`You can only select up to ${maxSeats} seats.`);
      return;
    }

    if (selectedSeats.includes(seat.name)) {
      setSelectedSeats(selectedSeats.filter((selectedSeat) => selectedSeat !== seat.name));
    } else {
      setSelectedSeats([...selectedSeats, seat.name]);
    }
  };

  const renderSeats = () => {
    const seatRows = [];
    let currentRow = [];

    seats.forEach((seat, index) => {
      if (currentRow.length === 4) {
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
              ${!seat.available ? styles.booked : ''} 
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
        {calculatedFare}
        {selectedSeats.join(', ')}
      </div>

      <BookingForm
        selectedSeats={selectedSeats}
        boardingPoint={boardingPoint}
        tripId={tripid}
        dropingPoint={dropingPoint}
        sourceID={sourceId}
        destinationID={destinationId}
        PayableAmount={calculatedFare}
      />
    </div>
  );
};

export default BusSeats;
