import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './flightinfo.module.css';

const FlightInterInfo = ({
  flightDetails,
  price,
  attributes,
  resultToken
}) => {
  const [logoUrl, setLogoUrl] = useState('');
  const [airline, setAirline] = useState('');

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await axios.get(`https://api.launcherr.co/api/show/Airline?code=${flightDetails.OperatorCode}`);
        setLogoUrl(response?.data?.data?.logo);
        setAirline(response?.data?.data?.airline_name);
      } catch (error) {
        console.error('Error fetching the airline logo:', error);
      }
    };

    if (flightDetails.OperatorCode) {
      fetchLogo();
    }
  }, [flightDetails.OperatorCode]);

  const getCurrencySymbol = () => {
    switch (price.Currency) {
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
          <img src={logoUrl} alt={`${flightDetails.OperatorCode} logo`} className={styles.logo} />
          <span>{airline}</span>
        </div>
        <div className={styles.timeInfo}>
          <div className={styles["inner-info"]}>
            <div>
              <div className={styles.time}>{new Date(flightDetails.Origin.DateTime).toLocaleTimeString()}</div>
              <div className={styles.airport}>{flightDetails.Origin.AirportCode}</div>
              <div className={styles.city}>{flightDetails.Origin.CityName}</div>
            </div>
            <div className={styles.duration}>
              {`${Math.floor(flightDetails.Duration / 60)}h ${flightDetails.Duration % 60}m`}
            </div>
            <div>
              <div className={styles.time}>{new Date(flightDetails.Destination.DateTime).toLocaleTimeString()}</div>
              <div className={styles.airport}>{flightDetails.Destination.AirportCode}</div>
              <div className={styles.city}>{flightDetails.Destination.CityName}</div>
            </div>
          </div>
        </div>
        <div className={styles.price}>
          {getCurrencySymbol()}{price.TotalDisplayFare}
        </div>
      </div>
      <div className={styles.footer}>
        <div>{attributes.IsRefundable ? 'Refundable' : 'Non-Refundable'}</div>
        <div>{attributes.FareType}</div>
        <div>{flightDetails.Attr.Baggage}</div>
        <div>{flightDetails.Attr.CabinBaggage}</div>
      </div>
    </div>
  );
};

export default FlightInterInfo;
