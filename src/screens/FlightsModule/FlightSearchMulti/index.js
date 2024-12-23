import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './FlightSearch.module.css';
import { useRouter } from 'next/router';
import { format } from 'date-fns';
import SwapIcon from '@/components/Icons/SwapIcon';

const FlightSearchMulti = () => {
    const router = useRouter();
    const [tripType, setTripType] = useState('MULTISTATE');
    const [flyingFrom, setFlyingFrom] = useState('');
    const [flyingTo, setFlyingTo] = useState('');
    const [departureDate, setDepartureDate] = useState(null);
    const [returnDate, setReturnDate] = useState(null);
    const [showPassengerDropdown, setShowPassengerDropdown] = useState(false);
    const [multiStateFlights, setMultiStateFlights] = useState([{ flyingFrom: '', flyingTo: '', departureDate: null, fromSearchResults: [], toSearchResults: [], loadingFrom: false, loadingTo: false }]);
    const [cabinClass, setCabinClass] = useState('Economy');
    const [directOnly, setDirectOnly] = useState(false);
    const [currency, setCurrency] = useState('INR');
    const [numAdults, setNumAdults] = useState(1);
    const [numChildren, setNumChildren] = useState(0);
    const [numInfants, setNumInfants] = useState(0);
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


    const incrementAdults = () => setNumAdults((prev) => prev + 1);
    const decrementAdults = () => setNumAdults((prev) => (prev > 1 ? prev - 1 : 1));
    const incrementChildren = () => setNumChildren((prev) => prev + 1);
    const decrementChildren = () => setNumChildren((prev) => (prev > 0 ? prev - 1 : 0));
    const incrementInfants = () => setNumInfants((prev) => prev + 1);
    const decrementInfants = () => setNumInfants((prev) => (prev > 0 ? prev - 1 : 0));
    const togglePassengerDropdown = () => setShowPassengerDropdown((prev) => !prev);


    const handleMultiStateFlightChange = (index, field, value) => {
        const updatedFlights = [...multiStateFlights];
        updatedFlights[index][field] = field === 'departureDate' ? new Date(value) : value;
        setMultiStateFlights(updatedFlights);
    };

    const addFlight = () => {
        setMultiStateFlights([...multiStateFlights, { flyingFrom: '', flyingTo: '', departureDate: null, fromSearchResults: [], toSearchResults: [], loadingFrom: false, loadingTo: false }]);
    };

    const fetchIataCodes = async (query, index, isFrom = true) => {
        const updatedFlights = [...multiStateFlights];
        const loadingSetter = isFrom ? 'loadingFrom' : 'loadingTo';
        const searchResultsSetter = isFrom ? 'fromSearchResults' : 'toSearchResults';

        updatedFlights[index][loadingSetter] = true;
        setMultiStateFlights(updatedFlights);

        try {
            const response = await axios.get(`https://api.launcherr.co/api/showIata/airport?query=${query}`);
            const results = response.data?.data || [];
            updatedFlights[index][searchResultsSetter] = results;
        } catch (error) {
            console.error("Error fetching IATA codes:", error);
        } finally {
            updatedFlights[index][loadingSetter] = false;
            setMultiStateFlights(updatedFlights);
        }
    };

    const handleFlyingFromChange = (index, value) => {
        const updatedFlights = [...multiStateFlights];
        updatedFlights[index].flyingFrom = value;

        if (value) {
            fetchIataCodes(value, index, true);
        } else {
            updatedFlights[index].fromSearchResults = [];
        }

        setMultiStateFlights(updatedFlights);
    };

    const handleFlyingToChange = (index, value) => {
        const updatedFlights = [...multiStateFlights];
        updatedFlights[index].flyingTo = value;

        if (value) {
            fetchIataCodes(value, index, false);
        } else {
            updatedFlights[index].toSearchResults = [];
        }

        setMultiStateFlights(updatedFlights);
    };

    const handleSearch = async () => {
        setIsLoading(true);
        localStorage.removeItem('formDataSearch');
        localStorage.removeItem('flightFilter');
        try {
            const iataResponses = tripType === 'MULTISTATE'
                ? await Promise.all(
                    multiStateFlights.map(flight =>
                        axios.get(`https://api.launcherr.co/api/Check/IATA?Origin=${flight.flyingFrom}&Destination=${flight.flyingTo}`)
                    )
                )
                : [];
            const tripInfo = tripType === 'MULTISTATE' ? multiStateFlights.map(flight => ({
                origin: flight.flyingFrom,
                destination: flight.flyingTo,
                travelDate: flight.departureDate ? format(new Date(flight.departureDate), 'MM/dd/yyyy') : ''

            })) : [
                {
                    origin: flyingFrom,
                    destination: flyingTo,
                    travelDate: flight.departureDate ? format(new Date(flight.departureDate), 'MM/dd/yyyy') : ''
                }
            ];
            const statusCodes = iataResponses.map(response => response.data?.data);

            // Determine travelType based on status codes
            let travelType;
            if (statusCodes.every(code => code === "000" || code === "00" || code === "0")) {
                // Case 1: All codes are 0-like values ("000", "00", "0")
                travelType = '0';
            } else if (statusCodes.some(code => code === "1" || code === "11" || code === "111")) {
                // Case 2: At least one code is 1-like values ("1", "11", "111")
                travelType = '1';
            } else if (statusCodes.every(code => code === "111" || code === "11" || code === "1")) {
                // Case 3: All codes are 1-like values ("111", "11", "1")
                travelType = '0';
            }


            const formData = {
                travelType,
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
            localStorage.removeItem('formDataSearch');
            localStorage.setItem("formDataSearch", JSON.stringify(formData))
            router.push(`/flightinter`);
        }
        catch (error) {
            console.error("Error during API call:", error);
        } finally {
            // Set loading state to false to reset button after process is complete
            setIsLoading(false);
        }
    };




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

    const removeFlight = (index) => {
        const updatedFlights = multiStateFlights.filter((_, i) => i !== index);
        setMultiStateFlights(updatedFlights);
    };

    const handleviewtickets = () => {
        router.push('/ticketinfo')
    }

    return (
        <>
            <div className={styles.container} >
                <div className={styles.tripTypeButtons}>
                    <button
                        onClick={() => handleTripTypeChange('OneWay')}
                        className={`${styles.button} ${tripType === 'OneWay' ? styles.selected : ''}`}
                    >
                        One&nbsp;Way
                    </button>
                    <button
                        onClick={() => handleTripTypeChange('round_trip')}
                        className={`${styles.button} ${tripType === 'round_trip' ? styles.selected : ''}`}
                    >
                        Round&nbsp;Trip
                    </button>
                    <button
                        onClick={() => handleTripTypeChange('MULTISTATE')}
                        className={`${styles.button} ${tripType === 'MULTISTATE' ? styles.selected : ''}`}
                    >
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
                    <button onClick={handleviewtickets} className={styles.searchButton} >
                        View Ticket
                    </button>
                </div>

                {multiStateFlights.map((flight, index) => (
                    <div key={index} className={styles["wrap-container-main-inner"]}>
                        <div className={styles["input-container"]}>
                            <div style={{ borderRight: "1px solid rgb(221 221 221)" }} className={styles["input-dropdown-custom"]}>
                                <input
                                    type="text"
                                    placeholder="Flying From"
                                    value={flight.flyingFrom}
                                    onChange={(e) => handleFlyingFromChange(index, e.target.value)}
                                    onFocus={() => fetchIataCodes(flight.flyingFrom, index, true)}
                                    className={styles.input}
                                />
                                <div className={styles["custom-drop-position"]}>
                                    {flight.loadingFrom ? (
                                        <p>Loading...</p>
                                    ) : (
                                        flight.fromSearchResults.length > 0 && (
                                            <div className={styles["list-cities"]}>
                                                <select onChange={(e) => handleFlyingFromChange(index, e.target.value)} value={flight.flyingFrom} className={styles["select-dropdown"]}>
                                                    <option value="">Select origin</option>
                                                    {flight.fromSearchResults.map(result => (
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
                                    value={flight.flyingTo}
                                    onChange={(e) => handleFlyingToChange(index, e.target.value)}
                                    onFocus={() => fetchIataCodes(flight.flyingTo, index, false)}
                                    className={styles.input}
                                />
                                <div className={styles["custom-drop-position"]}>
                                    {flight.loadingTo ? (
                                        <p>Loading...</p>
                                    ) : (
                                        flight.toSearchResults.length > 0 && (
                                            <div className={styles["list-cities"]}>
                                                <select
                                                    onChange={(e) => handleFlyingToChange(index, e.target.value)}
                                                    value={flight.flyingTo}
                                                    className={styles["select-dropdown"]}
                                                >
                                                    <option value="">Select destination</option>
                                                    {flight.toSearchResults.map(result => (
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
                                    selected={flight.departureDate}
                                    onChange={(date) => handleMultiStateFlightChange(index, 'departureDate', date)}
                                    minDate={today}
                                    className={styles.datePickerInput}
                                    placeholderText="Departure Date"
                                />
                            </div>
                        </div>

                        <button onClick={() => removeFlight(index)} className={styles.removeButton}>
                            <svg width="23" height="22" viewBox="0 0 23 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="0.75" y="0.75" width="21.4565" height="20.5" rx="9.25" stroke="#3E494E" stroke-width="1.5" />
                                <path d="M5.73914 10.5217H18.1739" stroke="#3E494E" stroke-width="1.5" stroke-linecap="round" />
                            </svg>
                        </button>
                    </div>
                ))}
                {multiStateFlights.length < 3 && (
                    <div className={styles["addflight-btn"]}>
                        <button onClick={addFlight}>
                            Add Flight
                            <svg width="23" height="22" viewBox="0 0 23 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="0.75" y="0.75" width="21.4565" height="20.5" rx="9.25" stroke="#2DAEFF" stroke-width="1.5" />
                                <path d="M5.5 11H17.9348" stroke="#2DAEFF" stroke-width="1.5" stroke-linecap="round" />
                                <path d="M11.5 5L11.5 17.4348" stroke="#2DAEFF" stroke-width="1.5" stroke-linecap="round" />
                            </svg>
                        </button>
                    </div>
                )}

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

export default FlightSearchMulti;
