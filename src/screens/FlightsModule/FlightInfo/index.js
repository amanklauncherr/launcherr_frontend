import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './flightinfo.module.css';
import { useRouter } from 'next/router';
import FlightOffer from '../FlightOffer';

const FlightInfo = ({
  flight_id,
  currency,
  numberOfBookableSeats,
  carrierCode,
  segments,
  Price_grandTotal,
  carrierCode_Round,
  segments_Round,
  travelerPricings,
  validatingAirlineCodes,
  pricingOptions,
  price_payalod,
  itineraries_payalod,
  source_payload,
  instantTicketingRequired,
  nonHomogeneous,
  oneWay,
  isUpsellOffer,
  lastTicketingDate,
  lastTicketingDateTime
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [logoUrl, setLogoUrl] = useState('');
  const [airline, setAirline] = useState('');
  const [selectedFlightId, setSelectedFlightId] = useState(null);
  const [detailDataFlight, setDetailDataFlight] = useState()
  const router = useRouter();


  const toggleBody = () => {
    setIsOpen(!isOpen);
  };


  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await axios.get(`https://api.launcherr.co/api/show/Airline?code=${carrierCode}`);
        setLogoUrl(response?.data?.data?.logo);
        setAirline(response?.data?.data?.airline_name);
      } catch (error) {
        console.error('Error fetching the airline logo:', error);
      }
    };

    if (carrierCode) {
      fetchLogo();
    }
  }, [carrierCode]);

  const fetchToken = async () => {
    try {
      const response = await axios.post('https://api.amadeus.com/v1/security/oauth2/token',
        new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: 'zYssACjlbXv0PDbxMpVN58WRU7kqgGtA',
          client_secret: 'IqAniSZnJlFVMtL0'
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
      return response.data.access_token;
    } catch (error) {
      console.error('Error fetching token:', error);
    }
  };

  const handleBook = async () => {
    try {
      const token = await fetchToken();

      if (!token) {
        console.error('Failed to fetch token.');
        return;
      }
      const selectedFlight = {
        type: 'flight-offer',
        id: flight_id,
        source: source_payload,
        instantTicketingRequired: instantTicketingRequired,
        nonHomogeneous: nonHomogeneous,
        oneWay: oneWay,
        isUpsellOffer: isUpsellOffer,
        lastTicketingDate: lastTicketingDate,
        lastTicketingDateTime: lastTicketingDateTime,
        numberOfBookableSeats: numberOfBookableSeats,
        itineraries: itineraries_payalod,
        price: price_payalod,
        pricingOptions: pricingOptions,
        validatingAirlineCodes: validatingAirlineCodes,
        travelerPricings: travelerPricings
      };

      const response = await axios.post(
        'https://api.amadeus.com/v1/shopping/flight-offers/pricing?forceClass=false',
        {
          data: {
            type: 'flight-offers-pricing',
            flightOffers: [selectedFlight]
          }
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log('API Response_price bala:', response?.data?.data);
      const resp_data = response?.data
      setDetailDataFlight(resp_data)
      setShowPopup(true);
    } catch (error) {
      console.error('Error confirming price:', error);
    }
  };


  const getCurrencySymbol = () => {
    switch (currency) {
      case 'USD':
        return '$';
      case 'INR':
        return '₹';
      default:
        return '';
    }
  };

  const calculateDuration = (departureTime, arrivalTime) => {
    const departure = new Date(departureTime);
    const arrival = new Date(arrivalTime);
    const durationMs = arrival - departure;
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const originSegment = segments[0];
  const destinationSegment = segments[segments.length - 1];

  const originSegmentRound = segments_Round[0];
  const destinationSegmentRound = segments_Round[segments_Round.length - 1];

  return (
    <div onClick={toggleBody} className={styles.card}>
      <p className={`${styles.availability} ${numberOfBookableSeats < 10 ? styles['low-seats'] : styles['high-seats']}`}>
        {numberOfBookableSeats} Seats Available
      </p>
      <div className={styles.header}>
        <div className={styles.airline}>
          <img src={logoUrl} alt={`${carrierCode} logo`} className={styles.logo} />
          <span>{airline}</span>
        </div>

        <div className={styles.timeInfo}>
          <div className={styles["inner-info"]}>
            <div>
              <div className={styles.time}>{new Date(originSegment.departure.at).toLocaleTimeString()}</div>
              <div className={styles.airport}>{originSegment.departure.iataCode}</div>
              <div className={styles.city}>{originSegment.departure.city}</div>
            </div>
            <div className={styles.duration}>
              <svg role="img" aria-hidden="true" viewBox="0 0 95 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 5c0-.552.498-1 1.113-1H82v2H1.113C.498 6 0 5.552 0 5Zm82-.143V0l12.277 4.668c.046.018.094.032.142.045.927.255.693 1.287-.336 1.287H82V4.857Z" fill="#B1B9CB"></path></svg>
              <span className={styles.durationTime}>{calculateDuration(originSegment.departure.at, destinationSegment.arrival.at)}</span>
            </div>
            <div>
              <div className={styles.time}>{new Date(destinationSegment.arrival.at).toLocaleTimeString()}</div>
              <div className={styles.airport}>{destinationSegment.arrival.iataCode}</div>
              <div className={styles.city}>{destinationSegment.arrival.city}</div>
            </div>
          </div>

          {originSegmentRound ? (
               <div className={styles["inner-info"]}>
               <div>
                 <div className={styles.time}>{new Date(originSegment.departure.at).toLocaleTimeString()}</div>
                 <div className={styles.airport}>{originSegmentRound.departure.iataCode}</div>
                 <div className={styles.city}>{originSegmentRound.departure.city}</div>
               </div>
               <div className={styles.duration}>
                 <svg role="img" aria-hidden="true" viewBox="0 0 95 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 5c0-.552.498-1 1.113-1H82v2H1.113C.498 6 0 5.552 0 5Zm82-.143V0l12.277 4.668c.046.018.094.032.142.045.927.255.693 1.287-.336 1.287H82V4.857Z" fill="#B1B9CB"></path></svg>
                 <span className={styles.durationTime}>{calculateDuration(originSegment.departure.at, destinationSegment.arrival.at)}</span>
               </div>
               <div>
                 <div className={styles.time}>{new Date(destinationSegmentRound.arrival.at).toLocaleTimeString()}</div>
                 <div className={styles.airport}>{destinationSegmentRound.arrival.iataCode}</div>
                 <div className={styles.city}>{destinationSegmentRound.arrival.city}</div>
               </div>
             </div>
          ) : (
            <></>
          )}
        </div>


        <div className={styles.priceInfo}>
          <div className={styles.discountedPrice}>
            <p>{getCurrencySymbol()}{Price_grandTotal}</p>
          <div className={styles.footer}>
            <button onClick={handleBook} className={styles.select}>Proceed</button>
          </div>
          </div>
          <div className={styles.dropbtn}>
            {isOpen ?
              <svg width="24" height="15" viewBox="0 0 24 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.86299 14.6057L11.2325 3.07893C11.437 2.82612 11.7129 2.68433 12.0005 2.68433C12.2881 2.68433 12.564 2.82612 12.7685 3.07893L22.138 14.6032C22.3437 14.8559 22.6206 14.9975 22.909 14.9975C23.1974 14.9975 23.4743 14.8559 23.68 14.6032C23.7813 14.4798 23.8618 14.3323 23.9167 14.1693C23.9717 14.0064 24 13.8314 24 13.6545C24 13.4777 23.9717 13.3027 23.9167 13.1398C23.8618 12.9768 23.7813 12.8293 23.68 12.7059L14.3124 1.18154C13.6954 0.424273 12.8652 0 12.0005 0C11.1358 0 10.3056 0.424273 9.68862 1.18154L0.321067 12.7059C0.219468 12.8293 0.138707 12.977 0.0835603 13.1402C0.0284135 13.3033 0 13.4787 0 13.6558C0 13.8329 0.0284135 14.0083 0.0835603 14.1714C0.138707 14.3346 0.219468 14.4823 0.321067 14.6057C0.526768 14.8584 0.803631 15 1.09203 15C1.38043 15 1.65729 14.8584 1.86299 14.6057Z" fill="#2DAEFF" />
              </svg> :
              <svg width="24" height="15" viewBox="0 0 24 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.137 0.394256L12.7675 11.9211C12.563 12.1739 12.2871 12.3157 11.9995 12.3157C11.7119 12.3157 11.436 12.1739 11.2315 11.9211L1.86197 0.396755C1.65627 0.144081 1.3794 0.00249894 1.09101 0.00249891C0.802606 0.00249889 0.525743 0.144081 0.320042 0.396755C0.218749 0.520191 0.138249 0.667721 0.0832841 0.830654C0.0283193 0.993586 1.73988e-06 1.16862 1.72442e-06 1.34545C1.70896e-06 1.52228 0.0283192 1.69731 0.083284 1.86024C0.138249 2.02318 0.218749 2.17071 0.320041 2.29414L9.6876 13.8185C10.3046 14.5757 11.1348 15 11.9995 15C12.8642 15 13.6944 14.5757 14.3114 13.8185L23.6789 2.29414C23.7805 2.17067 23.8613 2.02298 23.9164 1.85982C23.9716 1.69666 24 1.52133 24 1.3442C24 1.16707 23.9716 0.991745 23.9164 0.828582C23.8613 0.665418 23.7805 0.517731 23.6789 0.394256C23.4732 0.141582 23.1964 -1.69649e-08 22.908 -4.21776e-08C22.6196 -6.73903e-08 22.3427 0.141582 22.137 0.394256Z" fill="#2DAEFF" />
              </svg>
            }
          </div>
        </div>
      </div>

      {isOpen && (
        <>
          <div className={styles.body}>
            <div className={styles.flightDetails}>
              {Array.isArray(segments) && segments.map((segment, index) => (
                <div key={index} className={styles.flightSegment}>
                  <div className={styles["router-inner"]}>
                    <div className={styles.segmentTime}>{new Date(segment.departure.at).toLocaleTimeString()}</div>
                    <div className={styles.segmentDate}>{new Date(segment.departure.at).toLocaleDateString()}</div>
                    <div className={styles.airportInfo}>
                      <div>{segment.departure.iataCode}</div>
                      <div>{segment.departure.city}</div>
                    </div>
                  </div>
                  <div className={styles["router-inner"]}>
                    <div className={styles.segmentTime}>{new Date(segment.arrival.at).toLocaleTimeString()}</div>
                    <div className={styles.segmentDate}>{new Date(segment.arrival.at).toLocaleDateString()}</div>
                    <div className={styles.airportInfo}>
                      <div>{segment.arrival.iataCode}</div>
                      <div>{segment.arrival.city}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.flightDetails}>
              {Array.isArray(segments_Round) && segments_Round.map((segment, index) => (
                <div key={index} className={styles.flightSegment}>
                  <div className={styles["router-inner"]}>
                    <div className={styles.segmentTime}>{new Date(segment.departure.at).toLocaleTimeString()}</div>
                    <div className={styles.segmentDate}>{new Date(segment.departure.at).toLocaleDateString()}</div>
                    <div className={styles.airportInfo}>
                      <div>{segment.departure.iataCode}</div>
                      <div>{segment.departure.city}</div>
                    </div>
                  </div>
                  <div className={styles["router-inner"]}>
                    <div className={styles.segmentTime}>{new Date(segment.arrival.at).toLocaleTimeString()}</div>
                    <div className={styles.segmentDate}>{new Date(segment.arrival.at).toLocaleDateString()}</div>
                    <div className={styles.airportInfo}>
                      <div>{segment.arrival.iataCode}</div>
                      <div>{segment.arrival.city}</div>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>
    
        </>
      )}

      {/* Popup Component */}
      {showPopup && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            <span className={styles.close} onClick={() => setShowPopup(false)}>&times;</span>
            {/* <p>Flight ID: {flight_id}</p> 
            <p>Carrier Code: {carrierCode}</p> */}
            <FlightOffer flightOffer={detailDataFlight} />
          </div>
        </div>
      )}
    </div>
  );
};

export default FlightInfo;
