import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './FlightSearch.module.css';
import { useRouter } from 'next/router';
import SwapIcon from '../../../components/Icons/SwapIcon';
import { format } from 'date-fns';

const FlightSearchRoundTrip = () => {
    const router = useRouter();
    const [tripType, setTripType] = useState('round_trip');
    const [multiStateFlights, setMultiStateFlights] = useState([{ flyingFrom: '', flyingTo: '', departureDate: null }]);
    const [flyingFrom, setFlyingFrom] = useState('');
    const [flyingTo, setFlyingTo] = useState('');
    const [departureDate, setDepartureDate] = useState(null);
    const [returnDate, setReturnDate] = useState(null);
    const [cabinClass, setCabinClass] = useState('Economy');
    const [numAdults, setNumAdults] = useState(1);
    const [numChildren, setNumChildren] = useState(0);
    const [numInfants, setNumInfants] = useState(0);
    const [showPassengerDropdown, setShowPassengerDropdown] = useState(false);
    const [fromSearchResults, setFromSearchResults] = useState([]);
    const [toSearchResults, setToSearchResults] = useState([]);
    const [loadingFrom, setLoadingFrom] = useState(false);
    const [loadingTo, setLoadingTo] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);


    const dropdownRef = useRef(null); // For tracking dropdown

    const today = new Date();

    const handleTripTypeChange = (type) => {
        setTripType(type);
        if (type === 'OneWay') {
            router.push('/flights')
        }
        if (type === 'round_trip') {
            router.push('/flights/roundTrip')
        }
        if (type === 'MULTISTATE') {
            router.push('/flights/multistate')
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
    const handleSearch = async () => {
        setIsLoading(true);
        localStorage.removeItem('formDataSearch');
        localStorage.removeItem('flightFilter');
        try {
            const iataCheckResponse = await axios.get(`https://api.launcherr.co/api/Check/IATA?Origin=${flyingFrom}&Destination=${flyingTo}`);
            const tripInfo = tripType === 'MULTISTATE'
                ? multiStateFlights.map(flight => ({
                    origin: flight.flyingFrom,
                    destination: flight.flyingTo,
                    travelDate: flight.departureDate ? flight.departureDate : ''
                }))
                : [
                    {
                        origin: flyingFrom,
                        destination: flyingTo,
                        travelDate: departureDate ? departureDate : ''
                    },
                    ...(tripType === 'round_trip' ? [{
                        origin: flyingTo,
                        destination: flyingFrom,
                        travelDate: returnDate ? returnDate : ''
                    }] : [])
                ];


            const travelType = iataCheckResponse.data?.data;

            const formData = {
                travelType,
                TYPE: tripType === 'round_trip' ? "ROUNDTRIP" : tripType === 'MULTISTATE' ? "MULTISTATE" : "ONEWAY",
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

            // Serialize formData into query parameters
            const queryString = new URLSearchParams(formData).toString();

            // Redirect to the desired page with the serialized query parameters
            console.log("formData", formData)
            localStorage.removeItem('formDataSearch');
            localStorage.setItem("formDataSearch", JSON.stringify(formData))
            router.push(`/flightinter`);

        } catch (error) {
            console.error("Error during API call:", error);
        } finally {
            // Set loading state to false to reset button after process is complete
            setIsLoading(false);
        }
    };



    const incrementAdults = () => setNumAdults((prev) => prev + 1);
    const decrementAdults = () => setNumAdults((prev) => (prev > 1 ? prev - 1 : 1));
    const incrementChildren = () => setNumChildren((prev) => prev + 1);
    const decrementChildren = () => setNumChildren((prev) => (prev > 0 ? prev - 1 : 0));
    const incrementInfants = () => setNumInfants((prev) => prev + 1);
    const decrementInfants = () => setNumInfants((prev) => (prev > 0 ? prev - 1 : 0));
    const togglePassengerDropdown = () => setShowPassengerDropdown((prev) => !prev);


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowPassengerDropdown(false);
            }
        };

        if (showPassengerDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showPassengerDropdown]);


    const handleviewtickets = () => {
        router.push('/ticketinfo')
    }

    return (
        <>
            <div className={styles.container} >
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
                    <div className={styles.passengerSelection}>
                        <div className={styles.passengerButton} onClick={togglePassengerDropdown}>
                            <p>Travellers&nbsp;&&nbsp;class&nbsp;&nbsp;v</p>
                        </div>
                        {showPassengerDropdown && (
                            <div className={styles.passengerDropdown} ref={dropdownRef}>
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
                                    {/* Cabin Class Selection */}
                                    <label>Cabin Class</label>
                                    <select
                                        value={cabinClass}
                                        onChange={(e) => setCabinClass(e.target.value)}
                                    >
                                        <option value="Economy">Economy</option>
                                        <option value="Business">Business</option>
                                        <option value="First Class">First Class</option>
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>
                    <button onClick={handleviewtickets} className={styles.button} >
                        View Ticket
                    </button>
                </div>
                <div className={styles["wrap-container-main-inner"]}>
                    <div className={styles["input-container"]}>
                        <div style={{ borderRight: "1px solid rgb(221 221 221)" }} className={styles["input-dropdown-custom"]}>
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
                        <SwapIcon />
                        <div style={{ borderLeft: "1px solid rgb(221 221 221)" }} className={styles["input-dropdown-custom"]}>
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
                    </div>
                    <div className={styles.datePickers}>
                        <div className={styles["date-container"]}>
                            <DatePicker
                                selected={departureDate}
                                onChange={(date) => setDepartureDate(format(date, 'MM/dd/yyyy'))}
                                className={styles.datePickerInput}
                                minDate={today}
                                placeholderText="Departure Date"
                            />
                        </div>
                        <div className={styles["date-container"]}>
                            <DatePicker
                                selected={returnDate}
                                onChange={(date) => setReturnDate(format(date, 'MM/dd/yyyy'))}
                                minDate={departureDate}
                                placeholderText="Return Date"
                                className={styles.datePickerInput}
                            />
                        </div>
                    </div>


                </div>
                <div className={styles["view-ticket-mobhide"]}>
                <button onClick={handleSearch} style={{ margin: "0px" }} className={styles.searchButton} disabled={loading}>
                        {isLoading ? "Searching..." : "Search Flights"}
                    </button>
                   
                </div>
                <div className={styles["flight-serach-footer"]}>
                    
                </div>
            </div>

            <div className={styles["view-ticket-webhide"]}>
            <button onClick={handleSearch} style={{ margin: "0px" }} className={styles.searchButton} disabled={loading}>
                        {isLoading ? "Searching..." : "Search Flights"}
                    </button>
            </div>
        </>
    );
};

export default FlightSearchRoundTrip;
