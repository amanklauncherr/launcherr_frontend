import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import styles from './FlightSearch.module.css';
import { useRouter } from 'next/router';

const HotelSearch = () => {
    const router = useRouter();
    const [tripType, setTripType] = useState('OneWay');
    const [flyingFrom, setFlyingFrom] = useState('');
    const [flyingTo, setFlyingTo] = useState('');
    const [departureDate, setDepartureDate] = useState(null);
    const [returnDate, setReturnDate] = useState(null);
    const [cabinClass, setCabinClass] = useState('3');
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
                router.push(`/flightDoms?${queryString}`);
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

    return (
        <div className={styles.container}>
            <div className={styles.tripTypeButtons}>
                <h3>Book Domestic and International Hotels</h3>
                {/* <div className={styles["currency-container"]}>
                    <select
                        id="currency"
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className={styles.select}
                    >
                        <option value="INR">INR</option>
                        <option value="USD">USD</option>
                    </select>
                </div> */}
            </div>
            <div className={styles["wrap-container-main-inner"]}>
                <div className={styles["input-container"]}>
                    <div style={{ borderRight: "1px solid rgb(221 221 221)" }} className={styles["input-dropdown-custom"]}>
                        <input
                            type="text"
                            placeholder="Destination"
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

                    {/* <svg width="90px" height="20px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="SvgIconstyled__SvgIconStyled-sc-1i6f60b-0 kvpvkK"><path d="M7.854 12.146a.5.5 0 0 1 .057.638l-.057.07L3.706 17H20.5a.5.5 0 1 1 0 1H3.706l4.148 4.146a.5.5 0 0 1 .057.638l-.057.07a.5.5 0 0 1-.638.057l-.07-.057-5-5a.5.5 0 0 1-.057-.638l.057-.07 5-5a.5.5 0 0 1 .708 0zm8.292-11a.5.5 0 0 1 .638-.057l.07.057 5 5 .057.07a.5.5 0 0 1 0 .568l-.057.07-5 5-.07.057a.5.5 0 0 1-.568 0l-.07-.057-.057-.07a.5.5 0 0 1 0-.568l.057-.07L20.293 7H3.5a.5.5 0 0 1 0-1h16.793l-4.147-4.146-.057-.07a.5.5 0 0 1 .057-.638z"></path></svg> */}

                    {/* <div style={{ borderLeft: "1px solid rgb(221 221 221)" }} className={styles["input-dropdown-custom"]}>
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
                    </div> */}

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
                            placeholderText='Check-in'
                        />
                    </div>
                    <div className={styles["date-container"]}>
                        {/* <label>DEPART</label> */}
                        <DatePicker
                            selected={departureDate}
                            onChange={(date) => setDepartureDate(date)}
                            minDate={today}
                            className={styles.datePickerInput}
                            dateFormat="yyyy-MM-dd"
                            placeholderText='Check-out'
                        />
                    </div>

                </div>

                <div className={styles.passengerSelection}>
                    <div className={styles.passengerButton} onClick={togglePassengerDropdown}>
                        <p> {numAdults} Adults, {numChildren} Children</p>
                        <p>{cabinClass} Start Rating</p>
                    </div>
                    {showPassengerDropdown && (
                        <div className={styles.passengerDropdown}>
                            <div className={styles["cabin-container"]}>
                                <label>Start Rating</label>
                                <select
                                    id="cabinClass"
                                    value={cabinClass}
                                    onChange={(e) => setCabinClass(e.target.value)}
                                    className={styles.select}
                                >
                                    <option value="0">Show All</option>
                                    <option value="1">1 Star or less</option>
                                    <option value="2">2 Star or less</option>
                                    <option value="3">3 Star or less</option>
                                    <option value="4">4 Star or less</option>
                                    <option value="5">5 Star or less</option>
                                    <option value="6">1 Star or More</option>
                                    <option value="7" selected="">2 Star or More</option>
                                    <option value="8">3 Star or More</option>
                                    <option value="9">4 Star or More</option>
                                    <option value="10">5 Star or More</option>
                                </select>
                            </div>
                            <div className={styles.passengerCount}>
                                <label>Adults(12y +)</label>
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
                        </div>
                    )}
                </div>

                <div className={styles["country-main"]}>
                    <select class="form-select tts__input__select tts__traveller_select" name="nationalitycode">
                        <option value="AF">Afghanistan</option>
                        <option value="AX">Aland Islands</option>
                        <option value="AL">Albania</option>
                        <option value="DZ">Algeria</option>
                        <option value="AS">American Samoa</option>
                        <option value="AD">Andorra</option>
                        <option value="AO">Angola</option>
                        <option value="AI">Anguilla</option>
                        <option value="AQ">Antarctica</option>
                        <option value="AG">Antigua And Barbuda</option>
                        <option value="AR">Argentina</option>
                        <option value="AM">Armenia</option>
                        <option value="AW">Aruba</option>
                        <option value="AU">Australia</option>
                        <option value="AT">Austria</option>
                        <option value="AZ">Azerbaijan</option>
                        <option value="BH">Bahrain</option>
                        <option value="BD">Bangladesh</option>
                        <option value="BB">Barbados</option>
                        <option value="BY">Belarus</option>
                        <option value="BE">Belgium</option>
                        <option value="BZ">Belize</option>
                        <option value="BJ">Benin</option>
                        <option value="BM">Bermuda</option>
                        <option value="BT">Bhutan</option>
                        <option value="BO">Bolivia</option>
                        <option value="BQ">Bonaire, Sint Eustatius and Saba</option>
                        <option value="BA">Bosnia and Herzegovina</option>
                        <option value="BW">Botswana</option>
                        <option value="BV">Bouvet Island</option>
                        <option value="BR">Brazil</option>
                        <option value="IO">British Indian Ocean Territory</option>
                        <option value="BN">Brunei</option>
                        <option value="BG">Bulgaria</option>
                        <option value="BF">Burkina Faso</option>
                        <option value="BI">Burundi</option>
                        <option value="KH">Cambodia</option>
                        <option value="CM">Cameroon</option>
                        <option value="CA">Canada</option>
                        <option value="CV">Cape Verde</option>
                        <option value="KY">Cayman Islands</option>
                        <option value="CF">Central African Republic</option>
                        <option value="TD">Chad</option>
                        <option value="CL">Chile</option>
                        <option value="CN">China</option>
                        <option value="CX">Christmas Island</option>
                        <option value="CC">Cocos (Keeling) Islands</option>
                        <option value="CO">Colombia</option>
                        <option value="KM">Comoros</option>
                        <option value="CG">Congo</option>
                        <option value="CK">Cook Islands</option>
                        <option value="CR">Costa Rica</option>
                        <option value="CI">Cote D'Ivoire (Ivory Coast)</option>
                        <option value="HR">Croatia</option>
                        <option value="CU">Cuba</option>
                        <option value="CW">Curaçao</option>
                        <option value="CY">Cyprus</option>
                        <option value="CZ">Czech Republic</option>
                        <option value="CD">Democratic Republic of the Congo</option>
                        <option value="DK">Denmark</option>
                        <option value="DJ">Djibouti</option>
                        <option value="DM">Dominica</option>
                        <option value="DO">Dominican Republic</option>
                        <option value="TL">East Timor</option>
                        <option value="EC">Ecuador</option>
                        <option value="EG">Egypt</option>
                        <option value="SV">El Salvador</option>
                        <option value="GQ">Equatorial Guinea</option>
                        <option value="ER">Eritrea</option>
                        <option value="EE">Estonia</option>
                        <option value="ET">Ethiopia</option>
                        <option value="FK">Falkland Islands</option>
                        <option value="FO">Faroe Islands</option>
                        <option value="FJ">Fiji Islands</option>
                        <option value="FI">Finland</option>
                        <option value="FR">France</option>
                        <option value="GF">French Guiana</option>
                        <option value="PF">French Polynesia</option>
                        <option value="TF">French Southern Territories</option>
                        <option value="GA">Gabon</option>
                        <option value="GM">Gambia The</option>
                        <option value="GE">Georgia</option>
                        <option value="DE">Germany</option>
                        <option value="GH">Ghana</option>
                        <option value="GI">Gibraltar</option>
                        <option value="GR">Greece</option>
                        <option value="GL">Greenland</option>
                        <option value="GD">Grenada</option>
                        <option value="GP">Guadeloupe</option>
                        <option value="GU">Guam</option>
                        <option value="GT">Guatemala</option>
                        <option value="GG">Guernsey and Alderney</option>
                        <option value="GN">Guinea</option>
                        <option value="GW">Guinea-Bissau</option>
                        <option value="GY">Guyana</option>
                        <option value="HT">Haiti</option>
                        <option value="HM">Heard Island and McDonald Islands</option>
                        <option value="HN">Honduras</option>
                        <option value="HK">Hong Kong S.A.R.</option>
                        <option value="HU">Hungary</option>
                        <option value="IS">Iceland</option>
                        <option value="IN" selected="">India</option>
                        <option value="ID">Indonesia</option>
                        <option value="IR">Iran</option>
                        <option value="IQ">Iraq</option>
                        <option value="IE">Ireland</option>
                        <option value="IL">Israel</option>
                        <option value="IT">Italy</option>
                        <option value="JM">Jamaica</option>
                        <option value="JP">Japan</option>
                        <option value="JE">Jersey</option>
                        <option value="JO">Jordan</option>
                        <option value="KZ">Kazakhstan</option>
                        <option value="KE">Kenya</option>
                        <option value="KI">Kiribati</option>
                        <option value="XK">Kosovo</option>
                        <option value="KW">Kuwait</option>
                        <option value="KG">Kyrgyzstan</option>
                        <option value="LA">Laos</option>
                        <option value="LV">Latvia</option>
                        <option value="LB">Lebanon</option>
                        <option value="LS">Lesotho</option>
                        <option value="LR">Liberia</option>
                        <option value="LY">Libya</option>
                        <option value="LI">Liechtenstein</option>
                        <option value="LT">Lithuania</option>
                        <option value="LU">Luxembourg</option>
                        <option value="MO">Macau S.A.R.</option>
                        <option value="MK">Macedonia</option>
                        <option value="MG">Madagascar</option>
                        <option value="MW">Malawi</option>
                        <option value="MY">Malaysia</option>
                        <option value="MV">Maldives</option>
                        <option value="ML">Mali</option>
                        <option value="MT">Malta</option>
                        <option value="IM">Man (Isle of)</option>
                        <option value="MH">Marshall Islands</option>
                        <option value="MQ">Martinique</option>
                        <option value="MR">Mauritania</option>
                        <option value="MU">Mauritius</option>
                        <option value="YT">Mayotte</option>
                        <option value="MX">Mexico</option>
                        <option value="FM">Micronesia</option>
                        <option value="MD">Moldova</option>
                        <option value="MC">Monaco</option>
                        <option value="MN">Mongolia</option>
                        <option value="ME">Montenegro</option>
                        <option value="MS">Montserrat</option>
                        <option value="MA">Morocco</option>
                        <option value="MZ">Mozambique</option>
                        <option value="MM">Myanmar</option>
                        <option value="NA">Namibia</option>
                        <option value="NR">Nauru</option>
                        <option value="NP">Nepal</option>
                        <option value="NL">Netherlands</option>
                        <option value="NC">New Caledonia</option>
                        <option value="NZ">New Zealand</option>
                        <option value="NI">Nicaragua</option>
                        <option value="NE">Niger</option>
                        <option value="NG">Nigeria</option>
                        <option value="NU">Niue</option>
                        <option value="NF">Norfolk Island</option>
                        <option value="KP">North Korea</option>
                        <option value="MP">Northern Mariana Islands</option>
                        <option value="NO">Norway</option>
                        <option value="OM">Oman</option>
                        <option value="PK">Pakistan</option>
                        <option value="PW">Palau</option>
                        <option value="PS">Palestinian Territory Occupied</option>
                        <option value="PA">Panama</option>
                        <option value="PG">Papua new Guinea</option>
                        <option value="PY">Paraguay</option>
                        <option value="PE">Peru</option>
                        <option value="PH">Philippines</option>
                        <option value="PN">Pitcairn Island</option>
                        <option value="PL">Poland</option>
                        <option value="PT">Portugal</option>
                        <option value="PR">Puerto Rico</option>
                        <option value="QA">Qatar</option>
                        <option value="RE">Reunion</option>
                        <option value="RO">Romania</option>
                        <option value="RU">Russia</option>
                        <option value="RW">Rwanda</option>
                        <option value="SH">Saint Helena</option>
                        <option value="KN">Saint Kitts And Nevis</option>
                        <option value="LC">Saint Lucia</option>
                        <option value="PM">Saint Pierre and Miquelon</option>
                        <option value="VC">Saint Vincent And The Grenadines</option>
                        <option value="BL">Saint-Barthelemy</option>
                        <option value="MF">Saint-Martin (French part)</option>
                        <option value="WS">Samoa</option>
                        <option value="SM">San Marino</option>
                        <option value="ST">Sao Tome and Principe</option>
                        <option value="SA">Saudi Arabia</option>
                        <option value="SN">Senegal</option>
                        <option value="RS">Serbia</option>
                        <option value="SC">Seychelles</option>
                        <option value="SL">Sierra Leone</option>
                        <option value="SG">Singapore</option>
                        <option value="SX">Sint Maarten (Dutch part)</option>
                        <option value="SK">Slovakia</option>
                        <option value="SI">Slovenia</option>
                        <option value="SB">Solomon Islands</option>
                        <option value="SO">Somalia</option>
                        <option value="ZA">South Africa</option>
                        <option value="GS">South Georgia</option>
                        <option value="KR">South Korea</option>
                        <option value="SS">South Sudan</option>
                        <option value="ES">Spain</option>
                        <option value="LK">Sri Lanka</option>
                        <option value="SD">Sudan</option>
                        <option value="SR">Suriname</option>
                        <option value="SJ">Svalbard And Jan Mayen Islands</option>
                        <option value="SZ">Swaziland</option>
                        <option value="SE">Sweden</option>
                        <option value="CH">Switzerland</option>
                        <option value="SY">Syria</option>
                        <option value="TW">Taiwan</option>
                        <option value="TJ">Tajikistan</option>
                        <option value="TZ">Tanzania</option>
                        <option value="TH">Thailand</option>
                        <option value="BS">The Bahamas</option>
                        <option value="TG">Togo</option>
                        <option value="TK">Tokelau</option>
                        <option value="TO">Tonga</option>
                        <option value="TT">Trinidad And Tobago</option>
                        <option value="TN">Tunisia</option>
                        <option value="TR">Turkey</option>
                        <option value="TM">Turkmenistan</option>
                        <option value="TC">Turks And Caicos Islands</option>
                        <option value="TV">Tuvalu</option>
                        <option value="UG">Uganda</option>
                        <option value="UA">Ukraine</option>
                        <option value="AE">United Arab Emirates</option>
                        <option value="GB">United Kingdom</option>
                        <option value="US">United States</option>
                        <option value="UM">United States Minor Outlying Islands</option>
                        <option value="UY">Uruguay</option>
                        <option value="UZ">Uzbekistan</option>
                        <option value="VU">Vanuatu</option>
                        <option value="VA">Vatican City State (Holy See)</option>
                        <option value="VE">Venezuela</option>
                        <option value="VN">Vietnam</option>
                        <option value="VG">Virgin Islands (British)</option>
                        <option value="VI">Virgin Islands (US)</option>
                        <option value="WF">Wallis And Futuna Islands</option>
                        <option value="EH">Western Sahara</option>
                        <option value="YE">Yemen</option>
                        <option value="ZM">Zambia</option>
                        <option value="ZW">Zimbabwe</option>
                    </select>
                </div>
                <button onClick={handleSearch} className={styles.searchButton} disabled={loading}>
                    {loading ? 'Searching...' : 'Search'}
                </button>
            </div>
            {/* <div className={styles["flight-serach-footer"]}>
                <div className={styles.checkboxContainer}>
                    <input
                        type="checkbox"
                        checked={directOnly}
                        onChange={(e) => setDirectOnly(e.target.checked)}
                    />
                    <label>Direct Flights Only</label>
                </div>
                <div className={styles.checkboxContainer}>
                    <input type="radio" id="html" name="fav_language" value="HTML" />
                    <label for="html">Regular Fare</label>
                </div>
                <div className={styles.checkboxContainer}>
                    <input type="radio" id="html" name="fav_language" value="HTML" />
                    <label for="html">Student Fares</label>
                </div>
                <div className={styles.checkboxContainer}>
                    <input type="radio" id="html" name="fav_language" value="HTML" />
                    <label for="html">Senior Citizen</label>
                </div>
                <div className={styles.checkboxContainer}>
                    <input type="radio" id="html" name="fav_language" value="HTML" />
                    <label for="html">Armed Forces</label>
                </div>
            </div> */}
        </div>
    );
};

export default HotelSearch;
