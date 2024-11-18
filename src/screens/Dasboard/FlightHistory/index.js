import React, { useEffect, useState } from 'react';
import styles from './flighthistory.module.css';
import Dashboard from '..';
import axios from 'axios';
import Cookies from 'js-cookie';

const FlightHistory = () => {
    const [historyData, setHistoryData] = useState(null);
    const [loading, setLoading] = useState(false);

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

    const handleCancelTicket = async (bookingRef, pnr, flightId, Pax_Id, segmentId) => {
        const payload = {
            headersToken: "ulkO2oPHVIUlGJUsRGVoHM+5lmM0Y9FT3V2zHoZI7tsJ0QLA+ui31zpFT9LTf4se",
            headersKey: "NTq7XiHjm9kdkXIlp25ps7642Rh+oMhNmE5ObIvz8AQMumYUau4MsP9ChHkeqpQr",
            ticketCancelDetails: [
                {
                    flightId: flightId,
                    passengerId: String(Pax_Id),
                    segmentId: segmentId
                }
            ],
            pnr,
            bookingRef,
            cancelType: "0", // Normal Cancel
            cancelCode: "005",
            remark: "I cancelled the ticket directly with Airline"
        };

        try {
            setLoading(true);
            const response = await axios.post('https://api.launcherr.co/api/Cancellation', payload);
            console.log('Cancellation response:', response.data);
            alert('Ticket cancelled successfully!');
        } catch (error) {
            console.error('Error cancelling ticket:', error);
            alert('Failed to cancel the ticket. Please try again.');
        } finally {
            setLoading(false);
        }
    };

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
                                    </div>
                                ))}
                            </div>

                            <div className={styles.section}>
                                <h3>Travel Details</h3>
                                {booking.TravelDetails.map((travel, travelIndex) => (
                                    <div key={travelIndex}>
                                        <p><strong>Flight Number:</strong> {travel.Flight_Number}</p>
                                        <p><strong>Origin:</strong> {travel.Origin}</p>
                                        <p><strong>Destination:</strong> {travel.Destination}</p>
                                    </div>
                                ))}
                            </div>

                            <button
                                className={styles.cancelButton}
                                onClick={() =>
                                    handleCancelTicket(
                                        booking.BookingRef,
                                        booking.PnrDetails[0]?.AirlinePNRs[0]?.Airline_PNR || '',
                                        booking.PnrDetails[0]?.Flight_Id || '',
                                        booking.PAXTicketDetails[0]?.Pax_Id || '',
                                        booking.PnrDetails[0]?.SegmentId || '0'
                                    )
                                }
                                disabled={loading}
                            >
                                {loading ? 'Processing...' : 'Cancel Ticket'}
                            </button>
                        </div>
                    ))
                ) : (
                    <p>Loading travel history...</p>
                )}
            </div>
        </Dashboard>
    );
};

export default FlightHistory;
