import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import styles from './FlightSearch.module.css';
import { useRouter } from 'next/router';

const FlightSearch = ({ onClick }) => {
    const router = useRouter();
    const [tripType, setTripType] = useState('one-way');
    const [flyingFrom, setFlyingFrom] = useState('');
    const [flyingTo, setFlyingTo] = useState('');
    const [departureDate, setDepartureDate] = useState(null);
    const [returnDate, setReturnDate] = useState(null);
    const [passengerClass, setPassengerClass] = useState('1 Passenger, Economy');
    const [directOnly, setDirectOnly] = useState(false);
    const [numAdults, setNumAdults] = useState(1);
    const [currency, setCurrency] = useState('INR');
    const [fromSearchResults, setFromSearchResults] = useState([]);
    const [toSearchResults, setToSearchResults] = useState([]);
    const [loadingFrom, setLoadingFrom] = useState(false);
    const [loadingTo, setLoadingTo] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fromCountry, setFromCountry] = useState('');  // New state for storing origin country
    const [toCountry, setToCountry] = useState('');  // New state for storing destination country
    const [cabinClass, setCabinClass] = useState('Economy');


    const fetchAirportData = async (query, setSearchResults, setLoading, setCountry) => {
        setLoading(true);
        try {
            const response = await axios.get(`https://api.launcherr.co/api/showIata/airport?query=${query}`);
            const results = response.data?.data || [];
            setSearchResults(results);
        } catch (error) {
            console.error('Error fetching airport data:', error?.response?.data?.message);
            setSearchResults([]);
            setCountry('');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (flyingFrom.length > 2) {
            fetchAirportData(flyingFrom, setFromSearchResults, setLoadingFrom, setFromCountry);
        } else {
            setFromSearchResults([]);
            setFromCountry('');
        }
    }, [flyingFrom]);

    useEffect(() => {
        if (flyingTo.length > 2) {
            fetchAirportData(flyingTo, setToSearchResults, setLoadingTo, setToCountry);
        } else {
            setToSearchResults([]);
            setToCountry('');
        }
    }, [flyingTo]);

    const handleSearch = async () => {
        setLoading(true);

        try {
            const fromResponse = await axios.get(`https://api.launcherr.co/api/showIata/airport?query=${flyingFrom}`);
            const toResponse = await axios.get(`https://api.launcherr.co/api/showIata/airport?query=${flyingTo}`);
            const fromAirport = fromResponse.data?.data.find(airport => airport.iata_code === flyingFrom);
            const toAirport = toResponse.data?.data.find(airport => airport.iata_code === flyingTo);

            const fromCountry = fromAirport?.country;
            const toCountry = toAirport?.country;

            const searchParams = {
                tripType,
                flyingFrom,
                flyingTo,
                departureDate: departureDate?.toISOString().split('T')[0],
                returnDate: returnDate?.toISOString().split('T')[0],
                passengerClass: `${numAdults} Passenger${numAdults > 1 ? 's' : ''}`,
                directOnly,
                currency,
                fromCountry,
                toCountry,
                cabinClass // Add this line
            };
            

            console.log(searchParams, "searchParams")

            if (fromCountry === 'India' && toCountry === 'India') {
                alert('Domestic');
            } else {
                const queryString = new URLSearchParams(searchParams).toString();
                router.push(`/flightDoms?${queryString}`);
            }

        } catch (error) {
            console.error('Error fetching airport data:', error);
        } finally {
            setLoading(false);
        }
    };


    const incrementAdults = () => {
        setNumAdults((prev) => prev + 1);
    };

    const decrementAdults = () => {
        setNumAdults((prev) => (prev > 1 ? prev - 1 : 1));
    };

    const handleSelectChange = (e, setFunction, storageKey) => {
        const value = e.target.value;
        setFunction(value);
        localStorage.setItem(storageKey, value);
    };

    const handleTripTypeChange = (type) => {
        if (type === 'one-way') {
            setTripType(type);
            window.location.reload(); // Refresh the page
        } else {
            setTripType(type);
        }
    };

    const today = new Date();

    return (
        <div className={styles.container}>
            <div className={styles.tripTypeButtons}>
                <button
                    onClick={() => handleTripTypeChange('one-way')}
                    className={`${styles.button} ${tripType === 'one-way' ? styles.selected : ''}`}
                >
                    One-way
                </button>
                <button
                    onClick={() => handleTripTypeChange('round-trip')}
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
                <div className={styles["input-dropdown-custom"]}>
                    <input
                        type="text"
                        placeholder="Origin"
                        value={flyingFrom}
                        onChange={(e) => setFlyingFrom(e.target.value)}
                        className={styles.input}
                    />
                    {loadingFrom ? (
                        <p>Loading...</p>
                    ) : (
                        fromSearchResults.length > 0 && (
                            <div className={styles["list-cities"]}>
                                <select
                                    onChange={(e) => handleSelectChange(e, setFlyingFrom, 'origin')}
                                    value={flyingFrom}
                                    className={styles["select-dropdown"]}
                                >
                                    <option value="">Select origin</option>
                                    {fromSearchResults.map(result => (
                                        <option key={result.id} value={result.iata_code}>
                                            {result?.city}&nbsp;{result?.country}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )
                    )}
                </div>

                <svg width="90px" height="20px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="SvgIconstyled__SvgIconStyled-sc-1i6f60b-0 kvpvkK"><path d="M7.854 12.146a.5.5 0 0 1 .057.638l-.057.07L3.706 17H20.5a.5.5 0 1 1 0 1H3.706l4.148 4.146a.5.5 0 0 1 .057.638l-.057.07a.5.5 0 0 1-.638.057l-.07-.057-5-5a.5.5 0 0 1-.057-.638l.057-.07 5-5a.5.5 0 0 1 .708 0zm8.292-11a.5.5 0 0 1 .638-.057l.07.057 5 5 .057.07a.5.5 0 0 1 0 .568l-.057.07-5 5-.07.057a.5.5 0 0 1-.568 0l-.07-.057-.057-.07a.5.5 0 0 1 0-.568l.057-.07L20.293 7H3.5a.5.5 0 0 1 0-1h16.793l-4.147-4.146-.057-.07a.5.5 0 0 1 .057-.638z"></path></svg>
                <div className={styles["input-dropdown-custom"]}>
                    <input
                        type="text"
                        placeholder="Destination"
                        value={flyingTo}
                        onChange={(e) => setFlyingTo(e.target.value)}
                        className={styles.input}
                    />
                    {loadingTo ? (
                        <p>Loading...</p>
                    ) : (
                        toSearchResults.length > 0 && (
                            <div className={styles["list-cities"]}>
                                <select
                                    onChange={(e) => handleSelectChange(e, setFlyingTo, 'destination')}
                                    value={flyingTo}
                                    className={styles["select-dropdown"]}
                                >
                                    <option value="">Select destination</option>
                                    {toSearchResults.map(result => (
                                        <option key={result.id} value={result.iata_code}>
                                            {result?.city}&nbsp;{result?.country}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )
                    )}
                </div>
            </div>
            <div className={styles["d-flex"]}>
                <DatePicker
                    selected={departureDate}
                    onChange={(date) => setDepartureDate(date)}
                    minDate={today}
                    placeholderText="Departure date"
                    className={styles.datePicker}
                    dateFormat="yyyy-MM-dd"
                />
                {tripType === 'round-trip' && (
                    <DatePicker
                        selected={returnDate}
                        onChange={(date) => setReturnDate(date)}
                        minDate={departureDate || today}
                        placeholderText="Return date"
                        className={styles.datePicker}
                        dateFormat="yyyy-MM-dd"
                    />
                )}
                <div className={styles["passenger-container"]}>
                    <button onClick={decrementAdults} disabled={numAdults === 1}>-</button>
                    <input
                        type="text"
                        value={`${numAdults} Passenger${numAdults > 1 ? 's' : ''}`}
                        onChange={() => { }}
                        className={styles.passengerInput}
                        readOnly
                    />
                    <button onClick={incrementAdults}>+</button>
                </div>

                <div className={styles["cabin-container"]}>
                    <label htmlFor="cabinClass">Cabin Class:</label>
                    <select
                        id="cabinClass"
                        value={cabinClass}
                        onChange={(e) => setCabinClass(e.target.value)}
                        className={styles.select}
                    >
                        <option value="Economy">Economy</option>
                        <option value="Premium Economy">Premium Economy</option>
                        <option value="Business">Business</option>
                        <option value="First Class">First Class</option>
                    </select>
                </div>
            </div>


            <div className={styles.directOnlyContainer}>
                <label>
                    <input
                        type="checkbox"
                        checked={directOnly}
                        onChange={(e) => setDirectOnly(e.target.checked)}
                    />
                    Direct Flights Only
                </label>
            </div>
            <div className={styles.buttonContainer}>
                <button onClick={handleSearch} disabled={loading} className={styles.searchButton}>
                    {loading ? 'Searching...' : 
                    <>Search&nbspFlights</>}
                </button>
            </div>
        </div>
    );
};

export default FlightSearch;


