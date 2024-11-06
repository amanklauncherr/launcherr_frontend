import React, { useState } from 'react';
import styles from './buscard.module.css';
import axios from 'axios';
import BusSeats from '../BusSeats'

const BusTicketCard = ({ trip }) => {
    const [seatDetails, setSeatDetails] = useState(null);
    const [showSeats, setShowSeats] = useState(false);
    const [selectedSeats, setSelectedSeats] = useState([]); // State to keep track of selected seats

    const {
        travels,
        departureTime,
        arrivalTime,
        duration,
        availableSeats,
        busType,
        fareDetails,
        boardingTimes,
        droppingTimes,
        id,
    } = trip;

    // Convert time in minutes to readable format
    const formatTime = (timeInMinutes) => {
        const hours = Math.floor(timeInMinutes / 60);
        const minutes = timeInMinutes % 60;
        return `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
    };

    // Handle view seats click to fetch trip details
    const handleViewSeatsClick = async () => {
        setShowSeats(!showSeats);

        if (!showSeats) {
            try {
                const response = await axios.post('https://api.launcherr.co/api/Current/Trip/Details', {
                    tripId: id,
                });

                console.log('Trip Details:', response.data);
                setSeatDetails(response.data.data.payloads.data.tripDetails.seats);
            } catch (error) {
                console.error('Error fetching trip details:', error);
            }
        }
    };

    // Handle seat selection
    const handleSeatSelection = (seatName) => {
        setSelectedSeats((prevSelectedSeats) => {
            if (prevSelectedSeats.includes(seatName)) {
                // If seat is already selected, unselect it
                return prevSelectedSeats.filter(seat => seat !== seatName);
            } else {
                // If seat is not selected, select it
                return [...prevSelectedSeats, seatName];
            }
        });
    };

    return (
        <>
            <div className={styles["busTicketCard"]}>
                <div className={styles["busDetails"]}>
                    <h3>{travels}</h3>
                    <p>{busType}</p>
                </div>
                <div className={styles["timeInfo"]}>
                    <div>
                        <p>{formatTime(arrivalTime)}</p>
                        <h4>Boarding Points</h4>
                    </div>
                    <p>{duration}</p>
                    <div>
                        <p>{formatTime(departureTime)}</p>
                        <h4>Dropping Points</h4>
                    </div>
                </div>
                <div className={styles["priceInfo"]}>
                    <h3>₹{fareDetails.totalFare}</h3>
                    <p>Available Seats: {availableSeats}</p>
                </div>
                <div className={styles["viewSeatsBtn"]} onClick={handleViewSeatsClick}>
                    {showSeats ? 'Hide Seats' : 'View Seats'}
                </div>

            </div>
            {showSeats && seatDetails && (
                <div className={styles["seats-wrapper"]}>
                    <>
                        <BusSeats />
                    </>
                </div>
            )}
        </>
    );
};

export default BusTicketCard;
