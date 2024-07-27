import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './HotelSearch.module.css';

const HotelSearch = ({ onClick }) => {
    const [location, setLocation] = useState('');
    const [checkInDate, setCheckInDate] = useState(null);
    const [checkOutDate, setCheckOutDate] = useState(null);
    const [numAdults, setNumAdults] = useState(1);
    const [numRoom, setNumRoom] = useState(1);
    const [numChildren, setNumChildren] = useState(0);
    const [currency, setCurrency] = useState('INR');

    const handleSearch = () => {
        const searchParams = {
            location,
            checkInDate: checkInDate?.toISOString().split('T')[0],
            checkOutDate: checkOutDate?.toISOString().split('T')[0],
            numAdults,
            numChildren,
            currency
        };
        onClick(searchParams);
    };
    
    const incrementRoom = () => {
        setNumRoom((prev) => prev + 1);
    };

    const decrementRoom = () => {
        setNumRoom((prev) => (prev > 1 ? prev - 1 : 1));
    };

    const incrementAdults = () => {
        setNumAdults((prev) => prev + 1);
    };

    const decrementAdults = () => {
        setNumAdults((prev) => (prev > 1 ? prev - 1 : 1));
    };

    const incrementChildren = () => {
        setNumChildren((prev) => prev + 1);
    };

    const decrementChildren = () => {
        setNumChildren((prev) => (prev > 0 ? prev - 1 : 0));
    };

    return (
        <div className={styles.container}>
            <div className={styles.currencyContainer}>
                <select
                    id="currency"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className={styles.select}
                >
                    <option value="INR">INR</option>
                    <option value="USD">USD</option>
                </select>
            </div>
            <div className={styles.dFlex}>
            <div className={styles.inputContainer}>
                <input
                    type="text"
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className={styles.input}
                />
            </div>
                <DatePicker
                    selected={checkInDate}
                    onChange={(date) => setCheckInDate(date)}
                    placeholderText="Check-in Date"
                    className={styles.datePicker}
                />
                <DatePicker
                    selected={checkOutDate}
                    onChange={(date) => setCheckOutDate(date)}
                    placeholderText="Check-out Date"
                    className={styles.datePicker}
                />
            </div>
            <div className={styles.dFlex}>
            <div className={styles.passengerClassContainer}>
            <div className={styles.passengerCount}>
                    <p>Room</p>
                    <button onClick={decrementRoom} className={styles.countButton}>-</button>
                    <span>{numRoom}</span>
                    <button onClick={incrementRoom} className={styles.countButton}>+</button>
                </div>
                <div className={styles.passengerCount}>
                    <p>Adults</p>
                    <button onClick={decrementAdults} className={styles.countButton}>-</button>
                    <span>{numAdults}</span>
                    <button onClick={incrementAdults} className={styles.countButton}>+</button>
                </div>
                <div className={styles.passengerCount}>
                    <p>Children</p>
                    <button onClick={decrementChildren} className={styles.countButton}>-</button>
                    <span>{numChildren}</span>
                    <button onClick={incrementChildren} className={styles.countButton}>+</button>
                </div>
            </div>
            </div>
            <button onClick={handleSearch} className={styles.searchButton}>Search Hotels</button>
        </div>
    );
};

export default HotelSearch;
