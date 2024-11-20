import React, { useEffect, useState } from 'react';
import styles from './flighthistory.module.css';
import Dashboard from '..';
import axios from 'axios';
import Cookies from 'js-cookie';
import EmptyHotel from '@/components/EmptyHotel';
import Loader from '@/components/Loader';

const FlightHistory = () => {
    const [historyData, setHistoryData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [encryptedToken, setEncryptedToken] = useState('');
    const [encryptedKey, setEncryptedKey] = useState('');
    const [fetchingHistory, setFetchingHistory] = useState(false);

    const getEncryptedCredentials = async () => {
        try {
            const response = await axios.get('https://api.launcherr.co/api/AES/Encryption');
            setEncryptedToken(response.data.encrypted_token);
            setEncryptedKey(response.data.encrypted_key);
        } catch (error) {
            console.error('Error encrypting credentials:', error);
            throw error; // Ensures we don't proceed to fetch history without credentials
        }
    };

    const fetchTravelHistory = async (authToken) => {
        try {
            setFetchingHistory(true);
            const response = await axios.get('https://api.launcherr.co/api/Flight/Travel/History', {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            setHistoryData(response.data.data);
        } catch (error) {
            console.error('Error fetching travel history:', error);
        } finally {
            setFetchingHistory(false);
        }
    };

    useEffect(() => {
        const initializeData = async () => {
            const authToken = Cookies.get('auth_token');
            if (!authToken) {
                console.error('No auth token found. Please log in.');
                return;
            }

            try {
                await getEncryptedCredentials(); // Fetch encrypted credentials first
                await fetchTravelHistory(authToken); // Fetch travel history after credentials are set
            } catch (error) {
                console.error('Error during initialization:', error);
            }
        };

        initializeData();
    }, []);

    const handleCancelTicket = async (bookingRef, pnr, flightId, Pax_Id, segmentId) => {
        const payload = {
            headersToken: encryptedToken,
            headersKey: encryptedKey,
            ticketCancelDetails: [
                {
                    flightId: flightId,
                    passengerId: String(Pax_Id),
                    segmentId: segmentId,
                },
            ],
            pnr,
            bookingRef,
            cancelType: '1', // full cancel 1 || normal cancel 0 || no two flight 2
            cancelCode: '005',
            remark: 'I cancelled the ticket directly with Airline',
        };

        const authToken = Cookies.get('auth_token');
        if (authToken) {
            try {
                setLoading(true);
                const response = await axios.post('https://api.launcherr.co/api/Cancellation', payload, {
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    }
                });
                console.log('Cancellation response:', response.data);
                alert('Ticket cancelled successfully!');
            } catch (error) {
                console.error('Error cancelling ticket:', error);
                alert('Failed to cancel the ticket. Please try again.');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <Dashboard>
            <div className={styles.historyContainer}>
                <h1>Flight Travel History</h1>
                {fetchingHistory ? (
                    <>
                        <Loader />
                    </>
                ) : historyData ? (
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
                    <>
                        <EmptyHotel />
                    </>
                )}
            </div>
        </Dashboard>
    );
};

export default FlightHistory;
