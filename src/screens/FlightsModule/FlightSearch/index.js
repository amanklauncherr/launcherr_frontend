import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './FlightSearch.module.css';

const FlightSearch = ({ onClick }) => {
    const [tripType, setTripType] = useState('one-way');
    const [flyingFrom, setFlyingFrom] = useState('');
    const [flyingTo, setFlyingTo] = useState('');
    const [departureDate, setDepartureDate] = useState(null);
    const [returnDate, setReturnDate] = useState(null);
    const [passengerClass, setPassengerClass] = useState('1 Passenger, Economy');
    const [directOnly, setDirectOnly] = useState(false);
    const [numAdults, setNumAdults] = useState(1);
    const [currency, setCurrency] = useState('INR');

    const handleSearch = () => {
        const searchParams = {
            tripType,
            flyingFrom,
            flyingTo,
            departureDate: departureDate?.toISOString().split('T')[0],
            returnDate: returnDate?.toISOString().split('T')[0],
            passengerClass: `${numAdults} Passenger${numAdults > 1 ? 's' : ''}`,
            directOnly,
            currency
        };
        onClick(searchParams);
    };

    const incrementAdults = () => {
        setNumAdults((prev) => prev + 1);
    };

    const decrementAdults = () => {
        setNumAdults((prev) => (prev > 1 ? prev - 1 : 1));
    };

    return (
        <div className={styles.container}>
            <div className={styles.tripTypeButtons}>
                <button
                    onClick={() => setTripType('one-way')}
                    className={`${styles.button} ${tripType === 'one-way' ? styles.selected : ''}`}
                >
                    One-way
                </button>
                <button
                    onClick={() => setTripType('round-trip')}
                    className={`${styles.button} ${tripType === 'round-trip' ? styles.selected : ''}`}
                >
                    Round-trip
                </button>
                <div className={styles["currency-container"]}>
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
            </div>
            <div className={styles["input-container"]}>
                <input
                    type="text"
                    placeholder="Origin"
                    value={flyingFrom}
                    onChange={(e) => setFlyingFrom(e.target.value)}
                    className={styles.input}
                />
                <svg width="90px" height="20px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="SvgIconstyled__SvgIconStyled-sc-1i6f60b-0 kvpvkK"><path d="M7.854 12.146a.5.5 0 0 1 .057.638l-.057.07L3.706 17H20.5a.5.5 0 1 1 0 1H3.706l4.148 4.146a.5.5 0 0 1 .057.638l-.057.07a.5.5 0 0 1-.638.057l-.07-.057-5-5a.5.5 0 0 1-.057-.638l.057-.07 5-5a.5.5 0 0 1 .708 0zm8.292-11a.5.5 0 0 1 .638-.057l.07.057 5 5 .057.07a.5.5 0 0 1 0 .568l-.057.07-5 5-.07.057a.5.5 0 0 1-.568 0l-.07-.057-.057-.07a.5.5 0 0 1 0-.568l.057-.07L20.293 7H3.5a.5.5 0 0 1 0-1h16.793l-4.147-4.146-.057-.07a.5.5 0 0 1 .057-.638z"></path></svg>
                <input
                    type="text"
                    placeholder="Destination"
                    value={flyingTo}
                    onChange={(e) => setFlyingTo(e.target.value)}
                    className={styles.input}
                />
            </div>
            <div className={styles["d-flex"]}>
                <DatePicker
                    selected={departureDate}
                    onChange={(date) => setDepartureDate(date)}
                    placeholderText="Departure Date"
                    className={styles.datePicker}
                />
                {tripType === 'round-trip' && (
                    <DatePicker
                        selected={returnDate}
                        onChange={(date) => setReturnDate(date)}
                        placeholderText="Return"
                        className={styles.datePicker}
                    />
                )}
                <div className={styles["passenger-class-container"]}>
                    <div className={styles["passenger-count"]}>
                        <p>Adult</p>
                        <button onClick={decrementAdults} className={styles["count-button"]}>-</button>
                        <span>{numAdults}</span>
                        <button onClick={incrementAdults} className={styles["count-button"]}>+</button>
                    </div>
                </div>
            </div>
            <div className={styles.checkboxContainer}>
                <label className={styles.customCheckbox}>
                    <input
                        type="checkbox"
                        checked={directOnly}
                        onChange={(e) => setDirectOnly(e.target.checked)}
                    />
                    <span className={styles.checkmark}></span>
                    <p>Non-stop flights</p>
                </label>
            </div>
            <button onClick={handleSearch} className={styles.searchButton}>Search Flights</button>
        </div>
    );
};

export default FlightSearch;
