import React, { useState } from 'react';
import styles from './FlightCard.module.css';

const FlightCard = ({ flightData }) => {
    const [showCharges, setShowCharges] = useState(false);

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

    return (
        <div className={styles.flightCard}>
            {flightData?.Flights?.map((flight, flightIndex) => {
                const { Airline_Code, Airline_Name, Segments = [], Fares = [] } = flight;

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
                                    <span className={styles.badge}>Cheapest direct</span>
                                    <span className={styles.badge}>
                                        {Fares.length > 0 && Fares[0].FareDetails[0].Free_Baggage && (
                                            <div className={styles.baggageDetails}>
                                                <p><strong>Hand Baggage:</strong> {Fares[0].FareDetails[0].Free_Baggage.Hand_Baggage}</p>
                                            </div>
                                        )}
                                    </span>
                                    <span className={styles.badge}>
                                        {Fares.length > 0 && Fares[0].FareDetails[0].Free_Baggage && (
                                            <div className={styles.baggageDetails}>
                                                <p><strong>Check-In Baggage:</strong> {Fares[0].FareDetails[0].Free_Baggage.Check_In_Baggage}</p>
                                            </div>
                                        )}
                                    </span>
                                </div>

                                {Segments.map((segment, segmentIndex) => (
                                    <div key={segmentIndex} className={styles.segment}>
                                        <div className={styles.segmentDetails}>
                                            <div className={styles.flightInfo}>
                                                <p className={styles.airportCode}>
                                                    {new Date(segment.Departure_DateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                                <p>{segment.Origin}</p>
                                                <p>{new Date(segment.Departure_DateTime).toLocaleDateString()}</p>
                                            </div>

                                            <div className={styles.flightPath}>
                                                <span>Direct</span>
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
                                        <div className={styles.airlineName}>
                                            {Airline_Name || Airline_Code}
                                        </div>

                                        {segment.Baggage && (
                                            <div className={styles.baggageInfo}>
                                                <p><strong>Baggage Allowance:</strong> {segment.Baggage}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className={styles.fareDetails}>
                                {Fares.length > 0 && Fares[0].FareDetails && Fares[0].FareDetails.length > 0 && (
                                    <div className={styles.price}>
                                        <p>
                                            {getCurrencySymbol(Fares[0].FareDetails[0].Currency_Code)}
                                            {Fares[0].FareDetails[0].Total_Amount?.toFixed(2) || 'N/A'}
                                        </p>
                                        <button className={styles.viewDetailsBtn}>Book</button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className={styles["flight-card-footer"]}>
                            <button className={styles["toogle-btn"]} onClick={toggleChargesVisibility}>Cancellation Charges</button>

                            {showCharges && (
                                <div className={styles.taxDetails}>
                                    <p><strong>Cancellation Charges:</strong></p>
                                    <table className={styles.chargeTable}>
                                        <thead>
                                            <tr>
                                                <th>Duration (Days)</th>
                                                <th>Charge</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Fares[0].FareDetails[0].CancellationCharges.map((charge, idx) => (
                                                <tr key={idx}>
                                                    <td>{`From ${charge.DurationFrom} to ${charge.DurationTo} days`}</td>
                                                    <td>{`${getCurrencySymbol(Fares[0].FareDetails[0].Currency_Code)}${charge.Value}`}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    <p><strong>Reschedule Charges:</strong></p>
                                    <table className={styles.chargeTable}>
                                        <thead>
                                            <tr>
                                                <th>Duration (Days)</th>
                                                <th>Charge</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Fares[0].FareDetails[0].RescheduleCharges.map((charge, idx) => (
                                                <tr key={idx}>
                                                    <td>{`From ${charge.DurationFrom} to ${charge.DurationTo} days`}</td>
                                                    <td>{`${getCurrencySymbol(Fares[0].FareDetails[0].Currency_Code)}${charge.Value}`}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default FlightCard;
