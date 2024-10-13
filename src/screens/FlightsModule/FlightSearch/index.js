import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import styles from './FlightSearch.module.css';
import { useRouter } from 'next/router';

const FlightSearch = () => {
    const router = useRouter();
    const [tripType, setTripType] = useState('OneWay');
    const [flyingFrom, setFlyingFrom] = useState('');
    const [flyingTo, setFlyingTo] = useState('');
    const [departureDate, setDepartureDate] = useState(null);
    const [returnDate, setReturnDate] = useState(null);
    const [cabinClass, setCabinClass] = useState('Economy');
    const [directOnly, setDirectOnly] = useState(false);
    const [currency, setCurrency] = useState('INR');
    const [numAdults, setNumAdults] = useState(1);
    const [numChildren, setNumChildren] = useState(0);
    const [numInfants, setNumInfants] = useState(0);
    const [showPassengerDropdown, setShowPassengerDropdown] = useState(false);
    const [fromSearchResults, setFromSearchResults] = useState([]);
    const [toSearchResults, setToSearchResults] = useState([]);
    const [loadingFrom, setLoadingFrom] = useState(false);
    const [loadingTo, setLoadingTo] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fromCountry, setFromCountry] = useState('');
    const [toCountry, setToCountry] = useState('');

    const fetchAirportData = async (query, setSearchResults, setLoading) => {
        setLoading(true);
        try {
            const response = await axios.get(`https://api.launcherr.co/api/showIata/airport?query=${query}`);
            const results = response.data?.data || [];
            setSearchResults(results);
        } catch (error) {
            console.error('Error fetching airport data:', error?.response?.data?.message);
            setSearchResults([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (flyingFrom.length > 2) {
            fetchAirportData(flyingFrom, setFromSearchResults, setLoadingFrom);
        } else {
            setFromSearchResults([]);
        }
    }, [flyingFrom]);

    useEffect(() => {
        if (flyingTo.length > 2) {
            fetchAirportData(flyingTo, setToSearchResults, setLoadingTo);
        } else {
            setToSearchResults([]);
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
                departureDate: departureDate ? `${departureDate.toISOString().split('T')[0]}T00:00:00` : '',
                returnDate: tripType === 'round_trip' && returnDate ? `${returnDate.toISOString().split('T')[0]}T00:00:00` : '',
                directOnly,
                currency,
                cabin: cabinClass,
                adult: numAdults,
                child: numChildren,
                infant: numInfants,
                fromCountry,
                toCountry,
            };

            console.log(searchParams, "searchParams");

            if (fromCountry === 'India' && toCountry === 'India') {
                const queryString = new URLSearchParams(searchParams).toString();
                router.push(`/flightinter?${queryString}`);
            } else {
                const queryString = new URLSearchParams(searchParams).toString();
                router.push(`/flightinter?${queryString}`);
            }

        } catch (error) {
            console.error('Error fetching airport data:', error);
        } finally {
            setLoading(false);
        }
    };

    const incrementAdults = () => setNumAdults((prev) => prev + 1);
    const decrementAdults = () => setNumAdults((prev) => (prev > 1 ? prev - 1 : 1));
    const incrementChildren = () => setNumChildren((prev) => prev + 1);
    const decrementChildren = () => setNumChildren((prev) => (prev > 0 ? prev - 1 : 0));
    const incrementInfants = () => setNumInfants((prev) => prev + 1);
    const decrementInfants = () => setNumInfants((prev) => (prev > 0 ? prev - 1 : 0));
    const togglePassengerDropdown = () => setShowPassengerDropdown((prev) => !prev);

    const handleTripTypeChange = (type) => {
        setTripType(type);
        if (type === 'OneWay') {
            setReturnDate(null);
        }
    };

    const today = new Date();


    const handleviewtickets = () => {
        router.push('/ticketinfo')
    }

    return (
        <div className={styles.container}>
            <div className={styles.tripTypeButtons}>
                <button
                    onClick={() => handleTripTypeChange('OneWay')}
                    className={`${styles.button} ${tripType === 'OneWay' ? styles.selected : ''}`}
                >
                    One Way
                </button>
                <button
                    onClick={() => handleTripTypeChange('round_trip')}
                    className={`${styles.button} ${tripType === 'round_trip' ? styles.selected : ''}`}
                >
                    Round Trip
                </button>
                <div className={styles["currency-container"]}>
                    {/* <select
                        id="currency"
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className={styles.select}
                    >
                        <option value="INR">INR</option>
                        <option value="USD">USD</option>
                    </select> */}
                    {/* <button style={{background:"#2daeff"}} className={styles.button}>
                       View Ticket
                    </button> */}
                </div>
            </div>
            <div className={styles["wrap-container-main-inner"]}>
                <div className={styles["input-container"]}>
                    <div style={{ borderRight: "1px solid rgb(221 221 221)" }} className={styles["input-dropdown-custom"]}>
                        <input
                            type="text"
                            placeholder="Origin"
                            value={flyingFrom}
                            onChange={(e) => setFlyingFrom(e.target.value)}
                            className={styles.input}
                        />
                        <div className={styles["custom-drop-position"]}>
                            {loadingFrom ? (
                                <p>Loading...</p>
                            ) : (
                                fromSearchResults.length > 0 && (
                                    <div className={styles["list-cities"]}>
                                        <select
                                            onChange={(e) => setFlyingFrom(e.target.value)}
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
                    </div>

                    <svg width="90px" height="20px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="SvgIconstyled__SvgIconStyled-sc-1i6f60b-0 kvpvkK"><path d="M7.854 12.146a.5.5 0 0 1 .057.638l-.057.07L3.706 17H20.5a.5.5 0 1 1 0 1H3.706l4.148 4.146a.5.5 0 0 1 .057.638l-.057.07a.5.5 0 0 1-.638.057l-.07-.057-5-5a.5.5 0 0 1-.057-.638l.057-.07 5-5a.5.5 0 0 1 .708 0zm8.292-11a.5.5 0 0 1 .638-.057l.07.057 5 5 .057.07a.5.5 0 0 1 0 .568l-.057.07-5 5-.07.057a.5.5 0 0 1-.568 0l-.07-.057-.057-.07a.5.5 0 0 1 0-.568l.057-.07L20.293 7H3.5a.5.5 0 0 1 0-1h16.793l-4.147-4.146-.057-.07a.5.5 0 0 1 .057-.638z"></path></svg>

                    <div style={{ borderLeft: "1px solid rgb(221 221 221)" }} className={styles["input-dropdown-custom"]}>
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
                                        onChange={(e) => setFlyingTo(e.target.value)}
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
                <div className={styles.datePickers}>
                    <div className={styles["date-container"]}>
                        {/* <label>DEPART</label> */}
                        <DatePicker
                            selected={departureDate}
                            onChange={(date) => setDepartureDate(date)}
                            minDate={today}
                            className={styles.datePickerInput}
                            dateFormat="yyyy-MM-dd"
                            placeholderText='Depart date'
                        />
                    </div>
                    {tripType === 'round_trip' && (
                        <div className={styles["date-container"]}>
                            {/* <label>RETURN</label> */}
                            <DatePicker
                                selected={returnDate}
                                onChange={(date) => setReturnDate(date)}
                                minDate={departureDate || today}
                                className={styles.datePickerInput}
                                dateFormat="yyyy-MM-dd"
                                placeholderText='Return date'
                            />
                        </div>
                    )}
                </div>

                <div className={styles.passengerSelection}>
                    <div className={styles.passengerButton} onClick={togglePassengerDropdown}>
                        {/* <p> {numAdults} Adults, {numChildren} Children, {numInfants} Infants</p>
                        <p>{cabinClass} Class</p> */}
                        <p style={{padding:"18px"}}>Travellers&nbsp;&&nbsp;class</p>
                    </div>
                    {showPassengerDropdown && (
                        <div className={styles.passengerDropdown}>
                            <div className={styles.passengerCount}>
                                <label>Adults</label>
                                <div>
                                    <button onClick={decrementAdults}>-</button>
                                    <span>{numAdults}</span>
                                    <button onClick={incrementAdults}>+</button>
                                </div>
                            </div>
                            <div className={styles.passengerCount}>
                                <label>Children</label>
                                <div>
                                    <button onClick={decrementChildren}>-</button>
                                    <span>{numChildren}</span>
                                    <button onClick={incrementChildren}>+</button>
                                </div>
                            </div>
                            <div className={styles.passengerCount}>
                                <label>Infants</label>
                                <div>
                                    <button onClick={decrementInfants}>-</button>
                                    <span>{numInfants}</span>
                                    <button onClick={incrementInfants}>+</button>
                                </div>
                            </div>
                            <div className={styles["cabin-container"]}>
                                <label>Cabin Class</label>
                                <select
                                    id="cabinClass"
                                    value={cabinClass}
                                    onChange={(e) => setCabinClass(e.target.value)}
                                    className={styles.select}
                                >
                                    <option value="Economy">Economy</option>
                                    <option value="Business">Business</option>
                                    <option value="First">First</option>
                                </select>
                            </div>
                        </div>
                    )}
                </div>
                <button onClick={handleSearch} className={styles.searchButton} disabled={loading}>
                    {loading ? 'Searching...' : <>Search&nbsp;Flights</>}
                </button>
            </div>
            <div className={styles["flight-serach-footer"]}>
            <div className={styles.checkboxContainer}>
                <input
                    type="checkbox"
                    checked={directOnly}
                    onChange={(e) => setDirectOnly(e.target.checked)}
                />
                <label>Direct Flights Only</label>
            </div>
            <button onClick={handleviewtickets} style={{margin:"0px"}} className={styles.searchButton}>
                       View Ticket
                    </button>
            </div>
        </div>
    );
};

export default FlightSearch;
