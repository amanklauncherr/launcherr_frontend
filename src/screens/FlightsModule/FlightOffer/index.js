import React from 'react';
import styles from './FlightOffer.module.css'; 

const FlightOffer = ({ flightOffer }) => {
    console.log("flightOffer bala data", flightOffer?.data?.flightOffers)
  const { travelerPricings, bookingRequirements } = flightOffer?.data;
  
  const price = flightOffer?.data?.flightOffers[0]?.price
  console.log("price",price)
  const itineraries = flightOffer?.data?.flightOffer;
  console.log("itineraries", itineraries)

//   const firstSegment = flightOffer?.data?.flightOffers[0]?.itineraries;
//   console.log("firstSegment",firstSegment)



//  const secondSegment = flightOffer?.data?.flightOffers[0]?.itineraries?;
//  console.log("secondSegment", secondSegment)

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Flight Offer Details</h2>
      {/* <div className={styles.itineraries}>
        <h3 className={styles.sectionTitle}>Itinerary</h3>
        <div className={styles.segment}>
          <h4 className={styles.segmentTitle}>Segment 1</h4>
          <p><strong>Departure:</strong> {firstSegment?.departure?.iataCode} at {new Date(firstSegment?.departure?.at).toLocaleTimeString()}</p>
          <p><strong>Arrival:</strong> {firstSegment?.arrival?.iataCode} at {new Date(firstSegment?.arrival?.at).toLocaleTimeString()}</p>
          <p><strong>Carrier:</strong> {firstSegment?.carrierCode} {firstSegment?.number}</p>
          <p><strong>Duration:</strong> {firstSegment?.duration}</p>
        </div>
        <div className={styles.segment}>
          <h4 className={styles.segmentTitle}>Segment 2</h4>
          <p><strong>Departure:</strong> {secondSegment?.departure?.iataCode} at {new Date(secondSegment?.departure?.at).toLocaleTimeString()}</p>
          <p><strong>Arrival:</strong> {secondSegment?.arrival?.iataCode} at {new Date(secondSegment?.arrival?.at).toLocaleTimeString()}</p>
          <p><strong>Carrier:</strong> {secondSegment?.carrierCode} {secondSegment?.number}</p>
          <p><strong>Duration:</strong> {secondSegment?.duration}</p>
        </div>
      </div> */}

      <div className={styles.price}>
        <h3 className={styles.sectionTitle}>Price Details</h3>
        <p><strong>Total Price:</strong> {price?.currency} {price?.total}</p>
        <p><strong>Base Price:</strong> {price?.currency} {price?.base}</p>
        <p><strong>Taxes:</strong></p>
        {/* <ul>
          {travelerPricings[0]?.price?.taxes?.map((tax, index) => (
            <li key={index}>{tax?.code}: {price?.currency} {tax?.amount}</li>
          ))}
        </ul> */}
      </div>
      <div className={styles.bookingRequirements}>
        <h3 className={styles.sectionTitle}>Booking Requirements</h3>
        <p>Email Address Required: {bookingRequirements?.emailAddressRequired ? 'Yes' : 'No'}</p>
        <p>Mobile Phone Number Required: {bookingRequirements?.mobilePhoneNumberRequired ? 'Yes' : 'No'}</p>
      </div>
    </div>
  );
};

export default FlightOffer;
