import React from 'react';
import styles from './flightinfo.module.css';

// Static custom JSON data for flights
const flightData = {
  "Airline_Code": "AI",
  "Airline_Name": "Air India",
  "Segments": [
    {
      "Flight_Number": "AI202",
      "Departure_DateTime": "2024-09-30T10:00:00Z",
      "Arrival_DateTime": "2024-09-30T12:30:00Z",
      "Origin": "DEL",
      "Origin_City": "New Delhi",
      "Destination": "BOM",
      "Destination_City": "Mumbai",
      "Duration": 150, // in minutes
      "Baggage": "20kg",
      "CabinBaggage": "7kg"
    }
  ],
  "Total_Amount": 5000,
  "Currency_Code": "INR",
  "Refundable": true,
  "FareType": "Economy"
};

const airlineLogos = {
  AI: '/images/airline-ai-logo.png',
  BA: '/images/airline-ba-logo.png',
  // Add more airline codes and corresponding logo paths here
};

const FlightInterInfo = () => {
  const airlineCode = flightData.Airline_Code || 'Unknown';
  const logoUrl = airlineLogos[airlineCode] || '/images/default-logo.png'; // Fallback logo
  const airline = flightData.Airline_Name || 'Unknown Airline';

  const getCurrencySymbol = () => {
    switch (flightData.Currency_Code) {
      case 'USD':
        return '$';
      case 'INR':
        return '₹';
      default:
        return '';
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.airline}>
          <img src={logoUrl} alt={airlineCode + ' logo'} className={styles.logo} />
          <span>{airline}</span>
        </div>
        <div className={styles.timeInfo}>
          <div className={styles["inner-info"]}>
            {flightData.Segments.map((segment, index) => (
              <div key={index}>
                <div>
                  <div className={styles.time}>
                    {new Date(segment.Departure_DateTime).toLocaleTimeString()}
                  </div>
                  <div className={styles.airport}>{segment.Origin}</div>
                  <div className={styles.city}>{segment.Origin_City || 'Unknown City'}</div>
                </div>
                <div className={styles.duration}>
                  {`${Math.floor(segment.Duration / 60)}h ${segment.Duration % 60}m`}
                </div>
                <div>
                  <div className={styles.time}>
                    {new Date(segment.Arrival_DateTime).toLocaleTimeString()}
                  </div>
                  <div className={styles.airport}>{segment.Destination}</div>
                  <div className={styles.city}>{segment.Destination_City || 'Unknown City'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.price}>
          {getCurrencySymbol()}{flightData.Total_Amount || 'N/A'}
        </div>
      </div>
      <div className={styles.footer}>
        <div>{flightData.Refundable ? 'Refundable' : 'Non-Refundable'}</div>
        <div>{flightData.FareType || 'N/A'}</div>
        <div>{flightData.Baggage || 'No Baggage Info'}</div>
        <div>{flightData.CabinBaggage || 'No Cabin Baggage Info'}</div>
      </div>
    </div>
  );
};

export default FlightInterInfo;
