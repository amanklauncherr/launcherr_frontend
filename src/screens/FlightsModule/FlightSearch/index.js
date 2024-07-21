import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './FlightSearch.module.css';

const FlightSearch = ({ onClick }) => {
    const [tripType, setTripType] = useState('one-way');
    const [flyingFrom, setFlyingFrom] = useState('');
    const [flyingTo, setFlyingTo] = useState('');
    const [departureDate, setDepartureDate] = useState(null);
    const [retureDate, setRetureDate] = useState(null);
    const [passengerClass, setPassengerClass] = useState('1 Passenger, Economy');
    const [directOnly, setDirectOnly] = useState(false);
    const [bundleSave, setBundleSave] = useState(false);

    const handleSearch = () => {
        // Implement search functionality here
        console.log({
            tripType,
            flyingFrom,
            flyingTo,
            departureDate,
            retureDate,
            passengerClass,
            directOnly,
            bundleSave,
        });
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
            </div>
            <div className={styles["input-container"]}>
                <input
                    type="text"
                    placeholder="Flying from"
                    value={flyingFrom}
                    onChange={(e) => setFlyingFrom(e.target.value)}
                    className={styles.input}
                />
                <svg width="90px" height="20px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="SvgIconstyled__SvgIconStyled-sc-1i6f60b-0 kvpvkK"><path d="M7.854 12.146a.5.5 0 0 1 .057.638l-.057.07L3.706 17H20.5a.5.5 0 1 1 0 1H3.706l4.148 4.146a.5.5 0 0 1 .057.638l-.057.07a.5.5 0 0 1-.638.057l-.07-.057-5-5a.5.5 0 0 1-.057-.638l.057-.07 5-5a.5.5 0 0 1 .708 0zm8.292-11a.5.5 0 0 1 .638-.057l.07.057 5 5 .057.07a.5.5 0 0 1 0 .568l-.057.07-5 5-.07.057a.5.5 0 0 1-.568 0l-.07-.057-.057-.07a.5.5 0 0 1 0-.568l.057-.07L20.293 7H3.5a.5.5 0 0 1 0-1h16.793l-4.147-4.146-.057-.07a.5.5 0 0 1 .057-.638z"></path></svg>
                <input
                    type="text"
                    placeholder="Flying to"
                    value={flyingTo}
                    onChange={(e) => setFlyingTo(e.target.value)}
                    className={styles.input}
                />
            </div>
            <div className={styles["d-flex"]}>
                <DatePicker
                    selected={departureDate}
                    onChange={(date) => setDepartureDate(date)}
                    placeholderText="Departure"
                    className={styles.datePicker}
                />
                {tripType === 'round-trip' && (
                    <DatePicker
                        selected={retureDate}
                        onChange={(date) => setRetureDate(date)}
                        placeholderText="Return"
                        className={styles.datePicker}
                    />
                )}
                <select
                    value={passengerClass}
                    onChange={(e) => setPassengerClass(e.target.value)}
                    className={styles.select}
                >
                    <option value="1 Passenger, Economy">1 Passenger, Economy</option>
                    <option value="2 Passengers, Economy">2 Passengers, Economy</option>
                    <option value="1 Passenger, Business">1 Passenger, Business</option>
                    <option value="2 Passengers, Business">2 Passengers, Business</option>
                </select>
            </div>
            <button onClick={onClick} className={styles.searchButton}>Search Flights</button>
        </div>
    );
};

export default FlightSearch;
