import React, { useEffect, useState } from 'react';
import styles from './flighthistory.module.css';
import Dashboard from '..';
import axios from 'axios';
import Cookies from 'js-cookie';

const FlightHistory = () => {
    const [historyData, setHistoryData] = useState(null); 

    useEffect(() => {
        const authToken = Cookies.get('auth_token');
        
        if (authToken) {
            axios.get('https://api.launcherr.co/api/Flight/Travel/History', {
                headers: { Authorization: `Bearer ${authToken}` }
            })
            .then(response => {
                setHistoryData(response.data.data); 
            })
            .catch(error => {
                console.error('Error fetching travel history:', error);
            });
        } else {
            console.error('No auth token found. Please log in.');
        }
    }, []);

    return (
        <Dashboard>
            <div className={styles.historyContainer}>
                <h1>Flight Travel History</h1>
                {historyData ? (
                    historyData.map((booking, index) => (
                        <div key={index} className={styles.bookingCard}>
                            <h2>Booking Reference: {booking.BookingRef}</h2>
                            <p><strong>Booking Type:</strong> {booking.BookingType}</p>
                            
                            <div className={styles.section}>
                                <h3>PNR Details</h3>
                                {booking.PnrDetails.map((pnr, pnrIndex) => (
                                    <div key={pnrIndex}>
                                        <p><strong>Flight ID:</strong> {pnr.Flight_Id}</p>
                                        <p><strong>Status:</strong> {pnr.Status_Id}</p>
                                        {pnr.AirlinePNRs.map((airline, airlineIndex) => (
                                            <div key={airlineIndex}>
                                                <p><strong>Airline Code:</strong> {airline.Airline_Code}</p>
                                                <p><strong>Airline PNR:</strong> {airline.Airline_PNR}</p>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>

                            <div className={styles.section}>
                                <h3>Passenger Details</h3>
                                {booking.PAXTicketDetails.map((pax, paxIndex) => (
                                    <div key={paxIndex}>
                                        <p><strong>Name:</strong> {pax.Title} {pax.First_Name} {pax.Last_Name}</p>
                                        <p><strong>Nationality:</strong> {pax.Nationality}</p>
                                        <p><strong>Passport Number:</strong> {pax.Passport_Number}</p>
                                        <h4>Fare Details:</h4>
                                        {pax.Fares.map((fare, fareIndex) => (
                                            <div key={fareIndex}>
                                                {fare.FareDetails.map((fareDetail, fareDetailIndex) => (
                                                    <div key={fareDetailIndex}>
                                                        <p><strong>Basic Amount:</strong> {fareDetail.Basic_Amount}</p>
                                                        <p><strong>Total Amount:</strong> {fareDetail.Total_Amount}</p>
                                                        <p><strong>Currency:</strong> {fareDetail.Currency_Code}</p>
                                                        <div>
                                                            <h5>Airport Taxes:</h5>
                                                            {fareDetail.AirportTaxes.map((tax, taxIndex) => (
                                                                <p key={taxIndex}>
                                                                    {tax.Tax_Desc}: {tax.Tax_Amount}
                                                                </p>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>

                            <div className={styles.section}>
                                <h3>Travel Details</h3>
                                {booking.TravelDetails.map((travel, travelIndex) => (
                                    <div key={travelIndex}>
                                        <p><strong>Flight Number:</strong> {travel.Flight_Number}</p>
                                        <p><strong>Aircraft Type:</strong> {travel.Aircraft_Type}</p>
                                        <p><strong>Airline:</strong> {travel.Airline_Name} ({travel.Airline_Code})</p>
                                        <p><strong>Origin:</strong> {travel.Origin}</p>
                                        <p><strong>Destination:</strong> {travel.Destination}</p>
                                        <p><strong>Departure:</strong> {travel.Departure_DateTime}</p>
                                        <p><strong>Arrival:</strong> {travel.Arrival_DateTime}</p>
                                        <p><strong>Duration:</strong> {travel.Duration}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Loading travel history...</p>
                )}
            </div>
        </Dashboard>
    );
}

export default FlightHistory;
