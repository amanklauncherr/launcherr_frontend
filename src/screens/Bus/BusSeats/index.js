import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './bus.module.css';
import BookingForm from '../BookingForm';

const BusSeats = ({ encryptedKey, encryptedToken, tripid, boardingPoint, dropingPoint, sourceId, destinationId }) => {
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [maxSeats, setMaxSeats] = useState(6); // Example max seats per ticket

  console.log('tripid', tripid, "boardingPoint", boardingPoint, "dropingPoint", dropingPoint, "sourceId", sourceId, "destinationId", destinationId);

  useEffect(() => {
    const fetchSeats = async () => {
      if (!tripid) return; // Wait until tripid is available

      try {
        const response = await axios.post('https://api.launcherr.co/api/Current/Trip/Details', {
          headersToken : encryptedToken,
          headersKey : encryptedKey,
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

    // Check if seat is already selected
    const seatIndex = selectedSeats.findIndex(selectedSeat => selectedSeat.name === seat.name);

    let updatedSelectedSeats;
    if (seatIndex !== -1) {
      // Remove seat if already selected
      updatedSelectedSeats = selectedSeats.filter(selectedSeat => selectedSeat.name !== seat.name);
    } else {
      if (selectedSeats.length >= maxSeats) {
        alert(`You can only select up to ${maxSeats} seats.`);
        return;
      }
      // Add new seat to selected seats
      updatedSelectedSeats = [...selectedSeats, { name: seat.name, fare: seat.fare, operatorServiceChargeAbsolute: seat.operatorServiceChargeAbsolute, serviceTaxAbsolute: seat.serviceTaxAbsolute, baseFare: seat.baseFare }];
    }

    setSelectedSeats(updatedSelectedSeats);
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
          ${selectedSeats.some(selectedSeat => selectedSeat.name === seat.name) ? styles.selected : ''}
          ${seat.type === 'window' ? styles.window : ''}
          ${seat.type === 'aisle' ? styles.aisle : ''}
          ${seat.type === 'driver' ? styles.driver : ''}
          ${!seat.available ? styles.disabled : ''}  // Disabled seat styling
        `}
        onClick={() => {
          // Only allow selection if the seat is available
          if (seat.available) {
            handleSeatSelect(seat);
          }
        }}
      >
        {seat.type === 'driver' ? (
          <span className={styles.driverIcon}>🚗</span>  // Steering wheel icon
        ) : null}
        {seat.available === 'true' ? (  // Check if seat is available (boolean comparison)
        <>
        {seat.name}
        </>
      ) : 
      <div className={styles['unavialable']}>

        </div>
      }
      <span className={styles.fare}>{seat.fare}</span> 
      </div>
    ))}
  </div>
));

    
    
    
  };

  return (
    <div className={styles.seatSelection}>
      <h2>Select Your Seats</h2>
      <div className={styles["wrap-seats-amount-proceed"]}>
        <div className={styles.seatMatrix}>
          {renderSeats()}
        </div>
        <div className={styles.selectedSeats}>
          <h3 className={styles["selected-seats"]}>
            Selected Seats:
            <div>
              {selectedSeats.map((seat, index) => (
                <div key={index}>
                  {seat.name} (INR {seat.fare})
                </div>
              ))}
            </div>
          </h3>
        </div>
      </div>

      <BookingForm
        encryptedKey={encryptedKey}
        encryptedToken={encryptedToken}
        selectedSeats={selectedSeats.map(seat => seat.name)}
        selectedFares={selectedSeats.map(seat => seat.fare)}
        operatorServiceChargeAbsolute={selectedSeats.map(seat => seat.operatorServiceChargeAbsolute)}
        serviceTaxAbsolute={selectedSeats.map(seat => seat.serviceTaxAbsolute)}
        baseFare={selectedSeats.map(seat => seat.baseFare)}
        boardingPoint={boardingPoint}
        tripId={tripid}
        dropingPoint={dropingPoint}
        sourceID={sourceId}
        destinationID={destinationId}
      />
    </div>
  );
};

export default BusSeats;
