import React, { useEffect, useState } from 'react';
import styles from './bushistory.module.css';
import Dashboard from '..';
import axios from 'axios';
import Cookies from 'js-cookie';
import EmptyHotel from '@/components/EmptyHotel';

const BusHistory = () => {
    const [historyData, setHistoryData] = useState(null);
    const [encryptedToken, setEncryptedToken] = useState(null);
    const [encryptedKey, setEncryptedKey] = useState(null);

    // Fetch travel history
    useEffect(() => {
        const authToken = Cookies.get('auth_token');

        if (authToken) {
            axios
                .get('https://api.launcherr.co/api/Bus/Travel/History', {
                    headers: { Authorization: `Bearer ${authToken}` }
                })
                .then((response) => {
                    console.log('API Response:', response.data);
                    setHistoryData(response.data);
                })
                .catch((error) => {
                    console.error('Error fetching travel history:', error);
                });
        } else {
            console.error('No auth token found. Please log in.');
        }
    }, []);

    // Fetch encrypted credentials
    const getEncryptedCredentials = async () => {
        try {
            const response = await axios.get('https://api.launcherr.co/api/AES/Encryption');
            console.log('response', response.data)
            setEncryptedToken(response.data.encrypted_token);
            setEncryptedKey(response.data.encrypted_key);
        } catch (error) {
            console.error('Error encrypting credentials:', error);
            throw error;
        }
    };

    // Handle ticket cancellation
    const handleCancelTicket = async (referenceId, seatNames) => {
        const authToken = Cookies.get('auth_token');
        if (authToken) {
        try {
            // Ensure encrypted credentials are available
            if (!encryptedToken || !encryptedKey) {
                await getEncryptedCredentials();
            }

            // Build payload
            const payload = {
                headersToken: encryptedToken,
                headersKey: encryptedKey,
                referenceId,
                seatsToCancel: seatNames
            };

            // Call the cancellation API

            const response = await axios.post(
                'https://api.launcherr.co/api/Get/Cancel/Ticket',
                payload , {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                }
            );

            console.log('Ticket canceled successfully:', response.data);
            alert('Ticket canceled successfully!');
        } catch (error) {
            console.error('Error canceling ticket:', error);
            alert('Failed to cancel the ticket. Please try again.');
        }
    }
    };

    return (
        <Dashboard>
            <div className={styles.historyContainer}>
                <h1>Bus Travel History</h1>
                {historyData && historyData.data && historyData.data.length > 0 ? (
                    historyData.data.map((item, index) => (
                        <div key={index} className={styles.historyCard}>
                            <h2>Booking Reference: {item.BookingRef}</h2>
                            <p><strong>Booking Type:</strong> {item.BookingType}</p>

                            {/* PNR Details */}
                            {item.PnrDetails ? (
                                <div className={styles.section}>
                                    <h3>PNR Details</h3>
                                    <p><strong>PNR:</strong> {item.PnrDetails.pnr}</p>
                                    <p><strong>Bus Type:</strong> {item.PnrDetails.busType}</p>
                                </div>
                            ) : (
                                <p>No PNR details available.</p>
                            )}

                            {/* Passenger Information */}
                            {item.PAXTicketDetails && item.PAXTicketDetails.length > 0 ? (
                                item.PAXTicketDetails.map((ticket, idx) => (
                                    <div key={idx} className={styles.ticketDetails}>
                                        <p><strong>Seat:</strong> {ticket.seatName}</p>
                                        <p><strong>Date of Journey:</strong> {new Date(ticket.dateOfJourney).toLocaleDateString()}</p>
                                        <p><strong>Base Fare:</strong> ₹{ticket.baseFare}</p>
                                        <p><strong>Total Fare:</strong> ₹{ticket.fare}</p>
                                        <p><strong>Service Tax:</strong> ₹{ticket.serviceTax}</p>
                                        <h4>Passenger Details:</h4>
                                        <p><strong>Name:</strong> {ticket.passenger.title} {ticket.passenger.name}</p>
                                        <p><strong>Age:</strong> {ticket.passenger.age}</p>
                                        <p><strong>Gender:</strong> {ticket.passenger.gender}</p>
                                        <p><strong>Mobile:</strong> {ticket.passenger.mobile}</p>
                                        <p><strong>Email:</strong> {ticket.passenger.email}</p>

                                        {/* Cancel Ticket Button */}
                                        <button
                                            className='btn btn-primary'
                                            onClick={() =>
                                                handleCancelTicket(item.BookingRef, [ticket.seatName])
                                            }
                                        >
                                            Cancel Ticket
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p>No passenger details available.</p>
                            )}

                            {/* Travel Details */}
                            {item.TravelDetails ? (
                                <div className={styles.section}>
                                    <h3>Travel Details</h3>
                                    <p><strong>Pickup Location:</strong> {item.TravelDetails.pickupDetails.pickupLocation} ({item.TravelDetails.pickupDetails.sourceCity})</p>
                                    <p><strong>Pickup Time:</strong> {item.TravelDetails.pickupDetails.pickupTime}</p>
                                    <p><strong>Drop Location:</strong> {item.TravelDetails.dropDetails.dropLocation} ({item.TravelDetails.dropDetails.destinationCity})</p>
                                    <p><strong>Drop Time:</strong> {item.TravelDetails.dropDetails.dropTime}</p>
                                </div>
                            ) : (
                                <p>No travel details available.</p>
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

export default BusHistory;
