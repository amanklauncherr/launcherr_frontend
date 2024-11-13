import React, { useEffect, useState } from 'react';
import styles from './buscard.module.css';
import axios from 'axios';
import BusSeats from '../BusSeats';

const BusTicketCard = ({encryptedKey, encryptedToken, trip, sourceId, destinationId }) => {
    const [seatDetails, setSeatDetails] = useState(null);
    const [showSeats, setShowSeats] = useState(false);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [selectedBoardingPoint, setSelectedBoardingPoint] = useState(null);
    const [selectedDroppingPoint, setSelectedDroppingPoint] = useState(null);


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
        fares = [],
        id,
    } = trip;

    console.log("seatDetails", seatDetails);

    // Ensure `boardingTimes` and `droppingTimes` are arrays
    const normalizeToArray = (data) => Array.isArray(data) ? data : [data];
    const normalizedBoardingTimes = normalizeToArray(boardingTimes || []);
    const normalizedDroppingTimes = normalizeToArray(droppingTimes || []);

    const lowestFare = Array.isArray(fares) && fares.length > 0
        ? Math.min(...fares.map(fare => parseFloat(fare)))
        : 0;

    const formatTime = (timeInMinutes) => {
        const hours = Math.floor(timeInMinutes / 60);
        const minutes = timeInMinutes % 60;
        return `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
    };

    const handleViewSeatsClick = async () => {
        setShowSeats(!showSeats);
        if (!showSeats) {
            try {
                const response = await axios.post('https://api.launcherr.co/api/Current/Trip/Details',
                    {
                        "headersToken": encryptedToken,
                        "headersKey": encryptedKey,
                        tripId: id,
                    }
                );

                console.log('Trip Details:', response.data);
                setSeatDetails(response.data.data.payloads.data.tripDetails.seats);
            } catch (error) {
                console.error('Error fetching trip details:', error);
            }
        }
    };

    const handleSeatSelection = (seatName) => {
        setSelectedSeats((prevSelectedSeats) => {
            if (prevSelectedSeats.includes(seatName)) {
                return prevSelectedSeats.filter(seat => seat !== seatName);
            } else {
                return [...prevSelectedSeats, seatName];
            }
        });
    };

    const handleBoardingPointChange = (event) => {
        const bpId = event.target.value;
        setSelectedBoardingPoint(bpId);
        console.log('Selected Boarding Point ID:', bpId);
    };

    const handleDroppingPointChange = (event) => {
        const bpId = event.target.value;
        setSelectedDroppingPoint(bpId);
        console.log('Selected Dropping Point ID:', bpId);
    };

    return (
        <>
            <div className={styles["busTicketCard"]}>
                <div className={styles["busDetails"]}>
                    <h3>{travels}</h3>
                    <p>{busType}</p>
                </div>
                <div className={styles["timeInfo"]}>
                    <div className={styles["departurearriveTimeDropdown"]}>
                        <p>{formatTime(arrivalTime)}</p>
                        <h4>Boarding Points</h4>
                        <select onChange={handleBoardingPointChange} value={selectedBoardingPoint || ''}>
                            <option value="" disabled>Select Boarding Point</option>
                            {normalizedBoardingTimes.map(bp => (
                                <option key={bp.bpId} value={bp.bpId}>
                                    {bp.bpName} - {formatTime(bp.time)}
                                </option>
                            ))}
                        </select>
                    </div>
                    <p>{duration}</p>
                    <div className={styles["departurearriveTimeDropdown"]}>
                        <p>{formatTime(departureTime)}</p>
                        <h4>Dropping Points</h4>
                        <select onChange={handleDroppingPointChange} value={selectedDroppingPoint || ''}>
                            <option value="" disabled>Select Dropping Point</option>
                            {normalizedDroppingTimes.map(dp => (
                                <option key={dp.bpId} value={dp.bpId}>
                                    {dp.bpName} - {formatTime(dp.time)}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className={styles["priceInfo"]}>
                    <h3>₹{lowestFare.toFixed(2)}</h3>
                    <p>Available Seats: {availableSeats}</p>
                </div>
                <div className={styles["viewSeatsBtn"]} onClick={handleViewSeatsClick}>
                    {showSeats ? 'Hide Seats' : 'View Seats'}
                </div>
            </div>
            {showSeats && seatDetails && (
                <div className={styles["seats-wrapper"]}>
                    <BusSeats
                        tripid={id}
                        boardingPoint={selectedBoardingPoint}
                        dropingPoint={selectedDroppingPoint}
                        sourceId={sourceId}
                        destinationId={destinationId}
                    />
                </div>
            )}
        </>
    );
};

export default BusTicketCard;
