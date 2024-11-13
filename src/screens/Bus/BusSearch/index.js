import React, { useState, useEffect, useCallback } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import Select from 'react-select';
import styles from './FlightSearch.module.css';
import { useRouter } from 'next/router';
import debounce from 'lodash.debounce';

const BusSearch = () => {
    const router = useRouter();
    const [busFrom, setBusFrom] = useState(null);
    const [busTo, setBusTo] = useState(null);
    const [departureDate, setDepartureDate] = useState(null);
    const [cityOptions, setCityOptions] = useState([]);
    const today = new Date();

    // Fetch cities based on search input
    const fetchCities = async (inputValue) => {
        if (!inputValue) return;
        try {
            const response = await axios.get(
                `https://api.launcherr.co/api/Get/Source/Cities?city=${inputValue}`
            );
            const cities = response.data?.data || [];
            const options = cities.map(city => ({
                value: city.City_ID,
                label: `${city.City_Name}, ${city.State_Name}`,
            }));
            setCityOptions(options);
        } catch (error) {
            console.error('Error fetching cities:', error);
        }
    };

    // Debounce function wrapped in useCallback for better performance
    const debouncedFetchCities = useCallback(debounce(fetchCities, 500), []);

    const handleInputChange = (inputValue) => {
        debouncedFetchCities(inputValue);
    };

    const handleSearch = () => {
        if (!busFrom || !busTo || !departureDate) {
            alert('Please select both source and destination cities, and choose a travel date.');
            return;
        }

        const searchParams = {
            sourceId: busFrom.value,
            destinationId: busTo.value,
            date: departureDate.toISOString().split('T')[0],
        };
        localStorage.removeItem('Bus_Search_data');
        localStorage.setItem('Bus_Search_data', JSON.stringify(searchParams));

        router.push('/bus/busResult');
    };

    return (
        <div className={styles.container}>
            <div className={styles.tripTypeButtons}>
                <h3>Bus Ticket Booking</h3>
            </div>
            <div className={styles["wrap-container-main-inner"]}>
                <div className={styles["input-container"]}>
                    <div style={{ borderRight: "1px solid rgb(221 221 221)" }} className={styles["input-dropdown-custom"]}>
                        <Select
                            value={busFrom}
                            onChange={setBusFrom}
                            onInputChange={handleInputChange}
                            options={cityOptions}
                            placeholder="From"
                            classNamePrefix="react-select"
                            className={styles.input}
                            isClearable
                            isSearchable
                            noOptionsMessage={() => "No cities found"}
                        />
                    </div>

                    <svg width="90px" height="20px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="SvgIconstyled__SvgIconStyled-sc-1i6f60b-0 kvpvkK"><path d="M7.854 12.146a.5.5 0 0 1 .057.638l-.057.07L3.706 17H20.5a.5.5 0 1 1 0 1H3.706l4.148 4.146a.5.5 0 0 1 .057.638l-.057.07a.5.5 0 0 1-.638.057l-.07-.057-5-5a.5.5 0 0 1-.057-.638l.057-.07 5-5a.5.5 0 0 1 .708 0zm8.292-11a.5.5 0 0 1 .638-.057l.07.057 5 5 .057.07a.5.5 0 0 1 0 .568l-.057.07-5 5-.07.057a.5.5 0 0 1-.568 0l-.07-.057-.057-.07a.5.5 0 0 1 0-.568l.057-.07L20.293 7H3.5a.5.5 0 0 1 0-1h16.793l-4.147-4.146-.057-.07a.5.5 0 0 1 .057-.638z"></path></svg>

                    <div style={{ borderLeft: "1px solid rgb(221, 221, 221)", borderRight: "1px solid rgb(221, 221, 221)" }}
                        className={styles["input-dropdown-custom"]}>
                        <Select
                            value={busTo}
                            onChange={setBusTo}
                            onInputChange={handleInputChange}
                            options={cityOptions}
                            placeholder="To"
                            classNamePrefix="react-select"
                            className={styles.input}
                            isClearable
                            isSearchable
                            noOptionsMessage={() => "No cities found"}
                        />
                    </div>
                </div>

                <div className={styles.datePickers}>
                    <div className={styles["date-container"]}>
                        <DatePicker
                            selected={departureDate}
                            onChange={(date) => setDepartureDate(date)}
                            minDate={today}
                            className={styles.datePickerInput}
                            dateFormat="yyyy-MM-dd"
                            placeholderText='Travel Date'
                        />
                    </div>
                </div>

                <button onClick={handleSearch} className={styles.searchButton}>
                    Search
                </button>
            </div>
        </div>
    );
};

export default BusSearch;
