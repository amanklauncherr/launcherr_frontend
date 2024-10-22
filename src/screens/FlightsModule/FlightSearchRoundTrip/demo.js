import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './FlightSearch.module.css';
import { useRouter } from 'next/router';

const FlightSearch = () => {
    const router = useRouter();
    const [tripType, setTripType] = useState('OneWay');
    const [multiStateFlights, setMultiStateFlights] = useState([{ flyingFrom: '', flyingTo: '', departureDate: null }]);
    const [flyingFrom, setFlyingFrom] = useState('');
    const [flyingTo, setFlyingTo] = useState('');
    const [departureDate, setDepartureDate] = useState(null);
    const [returnDate, setReturnDate] = useState(null);
    const [cabinClass, setCabinClass] = useState('Economy');
    const [numAdults, setNumAdults] = useState(1);
    const [numChildren, setNumChildren] = useState(0);
    const [numInfants, setNumInfants] = useState(0);

    const [fromSearchResults, setFromSearchResults] = useState([]);
    const [toSearchResults, setToSearchResults] = useState([]);
    const [loadingFrom, setLoadingFrom] = useState(false);
    const [loadingTo, setLoadingTo] = useState(false);
    
    const today = new Date();

    const handleTripTypeChange = (type) => {
        setTripType(type);
        if (type === 'OneWay') {
            setReturnDate(null);
            setMultiStateFlights([{ flyingFrom: '', flyingTo: '', departureDate: null }]);
        }
    };

    const handleMultiStateFlightChange = (index, field, value) => {
        const updatedFlights = [...multiStateFlights];
        updatedFlights[index][field] = field === 'departureDate' ? new Date(value) : value; 
        setMultiStateFlights(updatedFlights);
    };

    const addFlight = () => {
        setMultiStateFlights([...multiStateFlights, { flyingFrom: '', flyingTo: '', departureDate: null }]);
    };

    const fetchIataCodes = async (query, isFrom = true) => {
        const loadingSetter = isFrom ? setLoadingFrom : setLoadingTo;
        const searchResultsSetter = isFrom ? setFromSearchResults : setToSearchResults;

        loadingSetter(true);
        try {
            const response = await axios.get(`https://api.launcherr.co/api/showIata/airport?query=${query}`);
            const results = response.data?.data || [];
            searchResultsSetter(results);
        } catch (error) {
            console.error("Error fetching IATA codes:", error);
        } finally {
            loadingSetter(false);
        }
    };

    const handleFlyingFromChange = (e, index) => {
        const value = e.target.value;
        if (index !== undefined) {
            handleMultiStateFlightChange(index, 'flyingFrom', value);
        } else {
            setFlyingFrom(value);
        }
        if (value) {
            fetchIataCodes(value, true);
        } else {
            setFromSearchResults([]);
        }
    };

    const handleFlyingToChange = (e, index) => {
        const value = e.target.value;
        if (index !== undefined) {
            handleMultiStateFlightChange(index, 'flyingTo', value);
        } else {
            setFlyingTo(value);
        }
        if (value) {
            fetchIataCodes(value, false);
        } else {
            setToSearchResults([]);
        }
    };

    const handleSearch = () => {
        const tripInfo = tripType === 'MULTISTATE' 
            ? multiStateFlights.map(flight => ({
                origin: flight.flyingFrom,
                destination: flight.flyingTo,
                travelDate: flight.departureDate ? flight.departureDate.toLocaleDateString() : ''
            })) 
            : [
                {
                    origin: flyingFrom,
                    destination: flyingTo,
                    travelDate: departureDate ? departureDate.toLocaleDateString() : ''
                },
                ...(tripType === 'round_trip' ? [{
                    origin: flyingTo,
                    destination: flyingFrom,
                    travelDate: returnDate ? returnDate.toLocaleDateString() : ''
                }] : [])
            ];

        const formData = {
            travelType: "0",
            TYPE: tripType === 'round_trip' ? "ROUNDTRIP" : tripType === 'MULTISTATE' ? "MULTISTATE" : "ONEWAY",
            bookingType: "2",
            tripInfo,
            adultCount: numAdults.toString(),
            childCount: numChildren.toString(),
            infantCount: numInfants.toString(),
            airlineCode: "",
            classOfTravel: cabinClass === 'Economy' ? "0" : cabinClass === 'Business' ? "1" : "2",
            Refundable: "",
            Arrival: "",
            Departure: "",
        };

        console.log(formData);
        // Implement your API call or navigation logic here
    };

    return (
        <div className={styles["wrap-container-main-inner"]}>
            <div className={styles.tripTypeButtons}>
                <button onClick={() => handleTripTypeChange('OneWay')} className={`${styles.button} ${tripType === 'OneWay' ? styles.selected : ''}`}>
                    One&nbsp;Way
                </button>
                <button onClick={() => handleTripTypeChange('round_trip')} className={`${styles.button} ${tripType === 'round_trip' ? styles.selected : ''}`}>
                    Round&nbsp;Trip
                </button>
                <button onClick={() => handleTripTypeChange('MULTISTATE')} className={`${styles.button} ${tripType === 'MULTISTATE' ? styles.selected : ''}`}>
                    Multi&nbsp;State
                </button>
            </div>
            {tripType !== 'MULTISTATE' && (
                <>
                    <div className={styles["flight-input"]}>
                        <input
                            type="text"
                            placeholder="Flying From"
                            value={flyingFrom}
                            onChange={(e) => handleFlyingFromChange(e)}
                            className={styles.input}
                        />
                        <div className={styles["custom-drop-position"]}>
                            {loadingFrom ? (
                                <p>Loading...</p>
                            ) : (
                                fromSearchResults.length > 0 && (
                                    <div className={styles["list-cities"]}>
                                        <select onChange={(e) => setFlyingFrom(e.target.value)} value={flyingFrom} className={styles["select-dropdown"]}>
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
                    <div className={styles["flight-input"]}>
                        <input
                            type="text"
                            placeholder="Flying To"
                            value={flyingTo}
                            onChange={(e) => handleFlyingToChange(e)}
                            className={styles.input}
                        />
                        <div className={styles["custom-drop-position"]}>
                            {loadingTo ? (
                                <p>Loading...</p>
                            ) : (
                                toSearchResults.length > 0 && (
                                    <div className={styles["list-cities"]}>
                                        <select onChange={(e) => setFlyingTo(e.target.value)} value={flyingTo} className={styles["select-dropdown"]}>
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
                </>
            )}
            <div>
                <DatePicker
                    selected={departureDate}
                    onChange={(date) => setDepartureDate(date)}
                    minDate={today}
                    placeholderText="Departure Date"
                />
                {tripType === 'round_trip' && (
                    <DatePicker
                        selected={returnDate}
                        onChange={(date) => setReturnDate(date)}
                        minDate={departureDate}
                        placeholderText="Return Date"
                    />
                )}
            </div>
            {tripType === 'MULTISTATE' && (
                <div>
                    {multiStateFlights.map((flight, index) => (
                        <div key={index} className={styles["flight-input"]}>
                            <input
                                type="text"
                                placeholder="Flying From"
                                value={flight.flyingFrom}
                                onChange={(e) => handleFlyingFromChange(e, index)}
                                className={styles.input}
                            />
                            <div className={styles["custom-drop-position"]}>
                                {loadingFrom && <p>Loading...</p>}
                                {fromSearchResults.length > 0 && (
                                    <div className={styles["list-cities"]}>
                                        <select
                                            onChange={(e) => handleFlyingFromChange(e, index)}
                                            value={flight.flyingFrom}
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
                                )}
                            </div>
                            <input
                                type="text"
                                placeholder="Flying To"
                                value={flight.flyingTo}
                                onChange={(e) => handleFlyingToChange(e, index)}
                                className={styles.input}
                            />
                            <div className={styles["custom-drop-position"]}>
                                {loadingTo && <p>Loading...</p>}
                                {toSearchResults.length > 0 && (
                                    <div className={styles["list-cities"]}>
                                        <select
                                            onChange={(e) => handleFlyingToChange(e, index)}
                                            value={flight.flyingTo}
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
                                )}
                            </div>
                            <DatePicker
                                selected={flight.departureDate}
                                onChange={(date) => handleMultiStateFlightChange(index, 'departureDate', date)}
                                minDate={today}
                                placeholderText="Departure Date"
                            />
                        </div>
                    ))}
                    <button onClick={addFlight}>Add Flight</button>
                </div>
            )}
            <div>
                <label>Cabin Class:</label>
                <select value={cabinClass} onChange={(e) => setCabinClass(e.target.value)}>
                    <option value="Economy">Economy</option>
                    <option value="Business">Business</option>
                    <option value="First">First</option>
                </select>
                <label>Adults:</label>
                <input
                    type="number"
                    min="1"
                    value={numAdults}
                    onChange={(e) => setNumAdults(Number(e.target.value))}
                />
                <label>Children:</label>
                <input
                    type="number"
                    min="0"
                    value={numChildren}
                    onChange={(e) => setNumChildren(Number(e.target.value))}
                />
                <label>Infants:</label>
                <input
                    type="number"
                    min="0"
                    value={numInfants}
                    onChange={(e) => setNumInfants(Number(e.target.value))}
                />
            </div>
            <button onClick={handleSearch}>Search Flights</button>
        </div>
    );
};

export default FlightSearch;
