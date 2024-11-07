import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from './bookingform.module.css'

const BookingForm = ({ PayableAmount, selectedSeats, tripId, boardingPoint, dropingPoint, tripDetails }) => {
  const router = useRouter();
  const { sourceId, destinationId, date } = router.query;

  // Define the state for seat data and passenger data separately
  const [seatData, setSeatData] = useState([]);
  const [passengerData, setPassengerData] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);


  const fare = 892.50;
  const serviceTax = 42.50;
  const operatorServiceCharge = 0.00;


  console.log(selectedSeats)

  // Update seatData and passengerData whenever selectedSeats or tripDetails change
  useEffect(() => {
    if (tripDetails?.seats && selectedSeats.length > 0) {
      const updatedSeatData = selectedSeats.map((seat, index) => {
        const seatDetails = tripDetails.seats.find(s => s.name === seat);
        if (!seatDetails) return null;  // If no matching seat, return null

        return {
          seatName: seatDetails.name,  // Ensure this is correctly populated
          fare: seatDetails.fare || 0,
          serviceTax: seatDetails.serviceTaxAbsolute || 0,
          operatorServiceCharge: seatDetails.operatorServiceChargeAbsolute || 0,
          ladiesSeat: seatDetails.ladiesSeat || "false",
          passenger: {
            name: '',
            mobile: '',
            title: 'Mr',
            email: '',
            age: '',
            gender: 'MALE',
            address: '',
            idType: 'Pancard',
            idNumber: '',
            primary: (index + 1).toString()
          }
        };
      }).filter(item => item !== null);

      setSeatData(updatedSeatData);

      // Log the seatData to confirm it's being populated correctly
      console.log("Updated Seat Data:", updatedSeatData);
    }
  }, [selectedSeats, tripDetails]);



  const handleSeatChange = (e, seatIndex, field) => {
    const updatedSeatData = [...seatData];
    if (!updatedSeatData[seatIndex]) {
      updatedSeatData[seatIndex] = {};
    }
    updatedSeatData[seatIndex][field] = e.target.value;
    setSeatData(updatedSeatData);
  };

  const handlePassengerChange = (e, seatIndex, field) => {
    const updatedPassengerData = [...passengerData];
    if (!updatedPassengerData[seatIndex]) {
      updatedPassengerData[seatIndex] = { passenger: {} };
    }

    updatedPassengerData[seatIndex].passenger[field] = e.target.value;

    // Log the seat name and field being updated
    const seatName = seatData[seatIndex]?.seatName || 'Unknown Seat';  // Check seatName here
    console.log(`Updating passenger info for seat: ${seatName}, Field: ${field}, New Value: ${e.target.value}`);

    setPassengerData(updatedPassengerData);
  };



  const handleSubmit = (e) => {
    e.preventDefault();
    logFormData();
  };



  const logFormData = () => {
    console.log("seatdatatat", seatData);  // Log the seatData to inspect

    // Map seatData to the final inventoryItems format
    const inventoryItems = seatData.map((seat, index) => ({
      seatName: seat.seatName,  // Access seatName from the seat object directly
      fare: fare,
      serviceTax: parseFloat(serviceTax),
      operatorServiceCharge: parseFloat(operatorServiceCharge),  // Access from seat object
      ladiesSeat: seat.ladiesSeat,  // Access from seat object
      passenger: {
        ...seat.passenger,
        name: passengerData[index]?.passenger?.name || '',
        mobile: passengerData[index]?.passenger?.mobile || '',
        title: passengerData[index]?.passenger?.title || 'Mr',
        email: passengerData[index]?.passenger?.email || '',
        age: passengerData[index]?.passenger?.age || '',
        gender: passengerData[index]?.passenger?.gender || 'MALE',
        address: passengerData[index]?.passenger?.address || '',
        idType: passengerData[index]?.passenger?.idType || 'Pancard',
        idNumber: passengerData[index]?.passenger?.idNumber || '',
        primary: (index + 1).toString()
      }
    }));

    const formData = {
      boardingPoint,
      dropingPoint,
      source: sourceId,
      destination: destinationId,
      tripId,
      serviceCharge: "0",
      inventoryItems
    };

    console.log('Form Data:', formData);  // Log the complete form data
  };


  const handleProceedClick = () => {
    setIsFormVisible(true);
  };


  const handlecross = () => {
    setIsFormVisible(false);
  }
  return (
    <div>
      {selectedSeats.length > 0 && (
        <button onClick={handleProceedClick}>Proceed</button>
      )}

      {isFormVisible && (
        <div className={styles['form-main-booking']}>

          <form onSubmit={handleSubmit}>
            <div className={styles["crossArea"]}>
              <button onClick={handlecross}>cross</button>
            </div>
            {selectedSeats.length > 0 ? (
              selectedSeats.map((seatName, index) => {
                const seatDetails = tripDetails?.seats.find(s => s.name === seatName);
                return (
                  <div key={index} style={{ margin: '20px 0', padding: '10px', border: '1px solid #ccc' }}>
                    <h4>Seat {seatName}</h4>
                    <label>
                      Seat Name:
                      <input
                        type="text"
                        value={seatName || ''}  // Dynamically set seatName as the value
                        onClick={(e) => handleSeatChange(e, index, 'seatName')}
                      />
                    </label>
                    <label>
                      Ladies Seat:
                      <select
                        value={seatData[index]?.ladiesSeat || "false"}
                        onChange={(e) => handleSeatChange(e, index, 'ladiesSeat')}
                      >
                        <option value="false">No</option>
                        <option value="true">Yes</option>
                      </select>
                    </label>

                    {/* Passenger-related data */}
                    <h5>Passenger Details</h5>
                    <label>
                      Name:
                      <input
                        type="text"
                        value={passengerData[index]?.passenger?.name || ''}
                        onChange={(e) => handlePassengerChange(e, index, 'name')}
                      />
                    </label>
                    <label>
                      Mobile:
                      <input
                        type="text"
                        value={passengerData[index]?.passenger?.mobile || ''}
                        onChange={(e) => handlePassengerChange(e, index, 'mobile')}
                      />
                    </label>

                    {/* Repeat for other passenger fields */}
                    {/* ... */}
                  </div>
                );
              })
            ) : (
              <p>No seats selected</p>
            )}
            <div className={styles["submit-area"]}>
              <div>
                <p>Total Amount: <span>{PayableAmount}</span></p>
              </div>
              <button
              type="submit"
                className={styles.payButton}
              >
                <img src="/icons/phonepe-icon.webp" alt="" />
                <p>Pay with PhonePe</p>
              </button>
            </div>
          </form>
        </div>

      )}
    </div>
  );
};

export default BookingForm;
