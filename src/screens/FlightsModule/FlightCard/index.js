import React, { useState, useEffect } from 'react';
import styles from './FlightCard.module.css';
import { useRouter } from 'next/router';
import axios from 'axios';
import FlightIconIn from '@/components/Icons/FlightIconIn';
import DurationLogoSmall from '@/components/Icons/DurationLogoSmall';

const FlightCard = ({ flightData, searchKey }) => {
    const router = useRouter();
    const [showCharges, setShowCharges] = useState(false);
    const [airlineLogos, setAirlineLogos] = useState({});

    const toggleChargesVisibility = () => {
        setShowCharges(!showCharges);
    };

    const getCurrencySymbol = (currencyCode) => {
        switch (currencyCode) {
            case 'INR': return '₹';
            case 'USD': return '$';
            default: return currencyCode;
        }
    };

    const handleBooking = (Flight_Key, Fare_Id) => {
        console.log("Fare_Id:", Fare_Id);
        router.push({
            pathname: '/flight_book',
            query: {
                flightKey: Flight_Key,
                Fare_Id: Fare_Id,
                searchKey: searchKey,
            },
        });
    };

    // Function to fetch airline logo based on the airline code
    const fetchAirlineLogo = async (airlineCode) => {
        if (airlineLogos[airlineCode]) return; // Avoid fetching the same airline logo multiple times

        try {
            const response = await axios.get(`https://api.launcherr.co/api/show/Airline?code=${airlineCode}`);
            if (response.data.success === 1) {
                setAirlineLogos(prevState => ({
                    ...prevState,
                    [airlineCode]: response.data.data.logo
                }));
            }
        } catch (error) {
            console.error('Error fetching airline logo:', error);
        }
    };

    useEffect(() => {
        // Pre-fetch airline logos for all flights
        flightData?.Flights?.forEach(flight => {
            const { Airline_Code } = flight;
            fetchAirlineLogo(Airline_Code);
        });
    }, [flightData]);

    return (
        <div className={styles.flightCard}>
            {flightData?.Flights?.map((flight, flightIndex) => {
                const { Airline_Code, Airline_Name, Segments = [], Fares = [], Flight_Key } = flight;

                // Extract Fare_Id from the Fares array
                const fareId = Fares.length > 0 ? Fares[0].Fare_Id : null;

                return (
                    <div className={styles["main-top-card-container"]} key={flightIndex}>

                        <div className={styles["main-card-container"]}>
                            <div className={styles["wrapper-left"]}>
                                <div className={styles.header}>
                                    <span className={styles.badge}>
                                        {Fares.length > 0 && Fares[0].Seats_Available && (
                                            <div className={styles.availableSeats}>
                                                <p><strong>Seats Available: </strong>{Fares[0].Seats_Available}</p>
                                            </div>
                                        )}
                                    </span>

                                    <span className={styles.badge}>
                                        {Fares.length > 0 && (
                                            <div className={styles.availableSeats}>
                                                <p><strong>Refundable: </strong>{Fares[0].Refundable ? 'Yes' : 'No'}</p>
                                            </div>
                                        )}
                                    </span>

                                    <span className={styles.badge}>
                                        {Fares.length > 0 && Fares[0].FareDetails[0]?.Free_Baggage && (
                                            <div className={styles.baggageDetails}>
                                                <p><strong>Hand Baggage:</strong> {Fares[0].FareDetails[0].Free_Baggage.Hand_Baggage}</p>
                                            </div>
                                        )}
                                    </span>

                                    <span className={styles.badge}>
                                        {Fares.length > 0 && Fares[0].FareDetails[0]?.Free_Baggage && (
                                            <div className={styles.baggageDetails}>
                                                <p><strong>Check-In Baggage:</strong> {Fares[0].FareDetails[0].Free_Baggage.Check_In_Baggage}</p>
                                            </div>
                                        )}
                                    </span>
                                </div>

                                {Segments.length > 0 && (
                                    <div className={styles.segment}>
                                        {Segments.map((segment, segmentIndex) => (
                                            <div key={segmentIndex} className={styles.segment}>
                                                <div className={styles.segmentDetails}>
                                                    <div className={styles.airlineName}>
                                                        {airlineLogos[Airline_Code] ? (
                                                            <img src={airlineLogos[Airline_Code]} alt={Airline_Name || Airline_Code} className={styles.airlineLogo} />
                                                        ) : (
                                                            Airline_Name || Airline_Code
                                                        )}
                                                    </div>
                                                    <div className={styles.flightInfo}>
                                                        <p className={styles.airportCode}>
                                                            {new Date(segment.Departure_DateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                        <p>{segment.Origin_City}</p>
                                                        <p>{new Date(segment.Departure_DateTime).toLocaleDateString()}</p>
                                                    </div>
 
                                                    <div className={styles.flightPath}>
                                                        <FlightIconIn />
                                                        <p className={styles.duration}><DurationLogoSmall/>{segment.Duration}</p>
                                                        <p className={styles.Terminal}>Terminal&nbsp;{segment.Destination_Terminal}</p>
                                                    </div>

                                                    <div className={styles.flightInfo}>
                                                        <p className={styles.airportCode}>
                                                            {new Date(segment.Arrival_DateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                        <p>{segment.Destination_City}</p>
                                                        <p>{new Date(segment.Arrival_DateTime).toLocaleDateString()}</p>
                                                    </div>
                                                </div>

                                                {segment.Baggage && (
                                                    <div className={styles.baggageInfo}>
                                                        <p><strong>Baggage Allowance:</strong> {segment.Baggage}</p>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}

                            </div>

                            <div className={styles.fareDetails}>
                                {Fares.length > 0 && (
                                    <div className={styles.price}>
                                        <p>
                                            {getCurrencySymbol(Fares[0].FareDetails[0]?.Currency_Code)}
                                            {Fares[0].FareDetails[0]?.Total_Amount?.toFixed(2) || 'N/A'}
                                        </p>
                                        <button onClick={() => handleBooking(Flight_Key, fareId)} className={styles.viewDetailsBtn}>Book</button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* <div className={styles["flight-card-footer"]}>
                            <button className={styles["toogle-btn"]} onClick={toggleChargesVisibility}>View Route</button>

                            {showCharges && (
                                <div className={styles["flight-route-map-inner"]}>
                                    {Segments.map((segment, segmentIndex) => (
                                        <div key={segmentIndex} className={styles.segment}>
                                            <div className={styles.segmentDetails}>
                                                <div className={styles.airlineName}>
                                                {airlineLogos[Airline_Code] ? (
                                                    <img src={airlineLogos[Airline_Code]} alt={Airline_Name || Airline_Code} className={styles.airlineLogo} />
                                                ) : (
                                                    Airline_Name || Airline_Code
                                                )}
                                            </div> 

                                                <div className={styles.flightInfo}>
                                                    <p className={styles.airportCode}>
                                                        {new Date(segment.Departure_DateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                    <p>{segment.Origin}</p>
                                                    <p>{new Date(segment.Departure_DateTime).toLocaleDateString()}</p>
                                                </div>

                                                <div className={styles.flightPath}>
                                                    <FlightIconIn />
                                                    <p className={styles.duration}>{segment.Duration}</p>
                                                </div>

                                                <div className={styles.flightInfo}>
                                                    <p className={styles.airportCode}>
                                                        {new Date(segment.Arrival_DateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                    <p>{segment.Destination}</p>
                                                    <p>{new Date(segment.Arrival_DateTime).toLocaleDateString()}</p>
                                                </div>
                                            </div>

                                            {segment.Baggage && (
                                                <div className={styles.baggageInfo}>
                                                    <p><strong>Baggage Allowance:</strong> {segment.Baggage}</p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div> */}
                    </div>
                );
            })}
        </div>
    );
};

export default FlightCard;
