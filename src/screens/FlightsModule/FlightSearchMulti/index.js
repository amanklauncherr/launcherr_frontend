import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios'; 
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './FlightSearch.module.css';
import { useRouter } from 'next/router';

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

    const dropdownRef = useRef(null); // For tracking dropdown

    const today = new Date();

    const handleTripTypeChange = (type) => {
        setTripType(type);
        if (type === 'OneWay') {
           router.push('/flights')
        }
        if(type === 'round_trip'){
           router.push('/flights/roundTrip')
        }
        if(type === 'MULTISTATE'){
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

    const handleSearch = () => {
        const tripInfo = tripType === 'MULTISTATE' ? multiStateFlights.map(flight => ({
            origin: flight.flyingFrom,
            destination: flight.flyingTo,
            travelDate: flight.departureDate ? flight.departureDate.toLocaleDateString() : ''
        })) : [
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
        // Further API call or navigation logic can be added here
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

    return (
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
            </div>


            {/* Multi-State Flights Section */}
            {tripType === 'MULTISTATE' && (
                <div>
                    {multiStateFlights.map((flight, index) => (
                        <div key={index} className={styles["flight-input"]}>
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
                                            <select
                                                onChange={(e) => handleFlyingFromChange(index, e.target.value)}
                                                value={flight.flyingFrom}
                                                className={styles["select-dropdown"]}
                                            >
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
            

            {/* Search Button */}
            <button onClick={handleSearch}>Search Flights</button>
        </div>
    );
};

export default FlightSearchMulti;
