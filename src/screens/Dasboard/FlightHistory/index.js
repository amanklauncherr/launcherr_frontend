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

    // Fetch Encrypted Credentials
    const getEncryptedCredentials = async () => {
        try {
            const response = await axios.get('https://api.launcherr.co/api/AES/Encryption');
            setEncryptedToken(response.data.encrypted_token);
            setEncryptedKey(response.data.encrypted_key);
        } catch (error) {
            console.error('Error encrypting credentials:', error);
            throw error;
        }
    };

    // Fetch Travel History
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

    // Initialize Data
    useEffect(() => {
        const initializeData = async () => {
            const authToken = Cookies.get('auth_token');
            if (!authToken) {
                console.error('No auth token found. Please log in.');
                return;
            }

            try {
                await getEncryptedCredentials();
                await fetchTravelHistory(authToken);
            } catch (error) {
                console.error('Error during initialization:', error);
            }
        };

        initializeData();
    }, []);

    // Handle Cancel Ticket
    const handleCancelTicket = async (bookingRef, pnr, FlightId, paxId, SegmentId, index) => {
        const payload = {
            headersToken: encryptedToken,
            headersKey: encryptedKey,
            ticketCancelDetails: [
                {
                    FlightId,
                    PassengerId: String(paxId),
                    SegmentId,
                },
            ],
            pnr,
            bookingRef,
            cancelType: '1',
            cancelCode: '015',
            remark: 'I cancelled the ticket directly with Airline',
        };

        const authToken = Cookies.get('auth_token');
        if (authToken) {
            try {
                setButtonLoading((prevState) => {
                    const newState = [...prevState];
                    newState[index] = true;
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
                setButtonLoading((prevState) => {
                    const newState = [...prevState];
                    newState[index] = false;
                    return newState;
                });
            }
        }
    };

    // Render Booking Card
    const renderBookingCard = (booking, index) => {
        if (booking.Status !== 'BOOKED') return null;

        return (
            <div key={index} className={styles.bookingCard}>
                <h2>
                    Booking Reference: <br /> <span>{booking.BookingRef}</span>
                </h2>
                {booking.PnrDetails?.length > 0 && (
                    <>
                        <div className={styles.section}>
                            <h3>PNR Details</h3>
                            {booking.PnrDetails.map((pnr, pnrIndex) => (
                                <div key={pnrIndex}>
                                    <p>
                                        <strong>Flight ID:</strong> {pnr.Flight_Id}
                                    </p>
                                    <p>
                                        <strong>Status:</strong> {pnr.Status_Id}
                                    </p>
                                    {pnr.AirlinePNRs?.map((airline, airlineIndex) => (
                                        <div key={airlineIndex}>
                                            <p>
                                                <strong>Airline Code:</strong> {airline.Airline_Code}
                                            </p>
                                            <p>
                                                <strong>Airline PNR:</strong> {airline.Airline_PNR}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                        <div className={styles.section}>
                            <h3>Passenger Details</h3>
                            {booking.PAXTicketDetails?.map((pax, paxIndex) => (
                                <div key={paxIndex}>
                                    <p>
                                        <strong>Name:</strong> {pax.Title} {pax.First_Name} {pax.Last_Name}
                                    </p>
                                    <p>
                                        <strong>Nationality:</strong> {pax.Nationality}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </>
                )}
                <button
                    className="btn btn-primary"
                    onClick={() =>
                        handleCancelTicket(
                            booking.BookingRef,
                            booking.PnrDetails?.[0]?.AirlinePNRs?.[0]?.Airline_PNR || '',
                            booking.PnrDetails?.[0]?.Flight_Id || '',
                            booking.PAXTicketDetails?.[0]?.Pax_Id || '',
                            booking.PnrDetails?.[0]?.SegmentId || '0',
                            index
                        )
                    }
                    disabled={buttonLoading[index]}
                >
                    {buttonLoading[index] ? 'Processing...' : 'Cancel Ticket'}
                </button>
            </div>
        );
    };

    return (
        <Dashboard>
            <div className={styles.historyContainer}>
                <h1>Flight Travel History</h1>
                {fetchingHistory ? (
                    <Loader />
                ) : historyData?.length > 0 ? (
                    historyData.map((booking, index) => renderBookingCard(booking, index))
                ) : (
                    <EmptyHotel />
                )}
            </div>
        </Dashboard>
    );
};

export default FlightHistory;
