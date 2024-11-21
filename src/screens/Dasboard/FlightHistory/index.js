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
    const [buttonLoading, setButtonLoading] = useState([]); // Track button loading state for each booking

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

    const handleCancelTicket = async (bookingRef, pnr, flightId, Pax_Id, segmentId, index) => {
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
                setButtonLoading(prevState => {
                    const newState = [...prevState];
                    newState[index] = true; // Set the specific button loading state to true
                    return newState;
                });

                const response = await axios.post('https://api.launcherr.co/api/Cancellation', payload, {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });
                console.log('Cancellation response:', response.data);
                alert('Ticket cancelled successfully!');
            } catch (error) {
                console.error('Error cancelling ticket:', error);
                alert('Failed to cancel the ticket. Please try again.');
            } finally {
                setButtonLoading(prevState => {
                    const newState = [...prevState];
                    newState[index] = false; // Set the specific button loading state to false
                    return newState;
                });
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
                            <h2>Booking Reference: <br /> <span>{booking.BookingRef}</span></h2>
                            {/* <p><strong>Booking Type:</strong> {booking.BookingType}</p> */}
                            {booking.PnrDetails?.length > 0 && (
                                <>
                                    <div className={styles.section}>
                                        <h3>PNR Details</h3>
                                        {booking.PnrDetails?.length > 0 ? (
                                            booking.PnrDetails.map((pnr, pnrIndex) => (
                                                <div key={pnrIndex}>
                                                    <p><strong>Flight ID:</strong> {pnr.Flight_Id}</p>
                                                    <p><strong>Status:</strong> {pnr.Status_Id}</p>
                                                    {pnr.AirlinePNRs?.map((airline, airlineIndex) => (
                                                        <div key={airlineIndex}>
                                                            <p><strong>Airline Code:</strong> {airline.Airline_Code}</p>
                                                            <p><strong>Airline PNR:</strong> {airline.Airline_PNR}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            ))
                                        ) : (
                                            <p>No PNR details available.</p>
                                        )}
                                    </div>
                                    <div className={styles.section}>
                                        <h3>Passenger Details</h3>
                                        {booking.PAXTicketDetails && booking.PAXTicketDetails.length > 0 ? (
                                            booking.PAXTicketDetails.map((pax, paxIndex) => (
                                                <div key={paxIndex}>
                                                    <p><strong>Name:</strong> {pax.Title} {pax.First_Name} {pax.Last_Name}</p>
                                                    <p><strong>Nationality:</strong> {pax.Nationality}</p>
                                                </div>
                                            ))
                                        ) : (
                                            <p>No Passenger Details Available</p>
                                        )}
                                    </div>
                                    <div className={styles.section}>
                                        <h3>Travel Details</h3>
                                        {Array.isArray(booking.TravelDetails) ? (
                                            booking.TravelDetails.map((travel, travelIndex) => (
                                                <div key={travelIndex}>
                                                    <p><strong>Flight Number:</strong> {travel.Flight_Number}</p>
                                                    <p><strong>Origin:</strong> {travel.Origin}</p>
                                                    <p><strong>Destination:</strong> {travel.Destination}</p>
                                                </div>
                                            ))
                                        ) : (
                                            <p>No travel details available.</p>
                                        )}
                                    </div>
                                </>
                            )}
                            {booking.PnrDetails?.length > 0 && (
                                <button
                                    className='btn btn-primary'
                                    onClick={() =>
                                        handleCancelTicket(
                                            booking.BookingRef,
                                            booking.PnrDetails[0]?.AirlinePNRs[0]?.Airline_PNR || '',
                                            booking.PnrDetails[0]?.Flight_Id || '',
                                            booking.PAXTicketDetails[0]?.Pax_Id || '',
                                            booking.PnrDetails[0]?.SegmentId || '0',
                                            index
                                        )
                                    }
                                    disabled={buttonLoading[index]} // Disable the button for the specific index
                                >
                                    {buttonLoading[index] ? 'Processing...' : 'Cancel Ticket'}
                                </button>
                            )}
                        </div>
                    ))
                ) : (
                    <EmptyHotel />
                )}
            </div>
        </Dashboard>
    );
};

export default FlightHistory;
