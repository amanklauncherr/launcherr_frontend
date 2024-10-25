import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './flightbook.module.css';
import MainLayout from '@/components/MainLayout';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import Loader from '@/components/Loader';
import PhonepayIcon from '@/components/Icons/PhonepayIcon';
import StepProgressBar from './StepProgressBar';
import BackBtn from '@/components/Icons/BackBtn';
import ContactIcon from '@/components/Icons/ContactIcon';
import InfoIcon from '@/components/Icons/InfoIcon';
import BusinessProile from '@/components/Icons/BusinessProile';
import DurationLogo from '@/components/Icons/DurationLogo';
import FlightPriceTable from './FlightPriceTable';

const FlightBookingDetails = () => {
    const router = useRouter();
    const { searchKey, Fare_Id, flightKey } = router.query;
    const [repriceError, setRepriceError] = useState();
    const [encryptedToken, setEncryptedToken] = useState(null);
    const [encryptedKey, setEncryptedKey] = useState(null);
    const [fareRules, setFareRules] = useState([]);
    const [priceDetails, setPriceDetails] = useState(null);
    const [priceDetailsNew, setPriceDetailsNew] = useState(null)
    const [newFlightKey, setNewFlightKey] = useState('');
    const [airlineLogo, setAirlineLogo] = useState(null);
    const [activeButton, setActiveButton] = useState(null);
    const [paymentTotalAmount, setTotalAmount] = useState(null);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchPayload, setSearchPayload] = useState({});
    const [passengerDetails, setPassengerDetails] = useState([]);
    const [isPaymentEnabled, setIsPaymentEnabled] = useState(false);
    const [loadingLaod, setLoadingLaod] = useState(true)
    const [bookingRefNumber, setBookingRef] = useState('');
    const [passportDetails, setPassportDetails] = useState({
        isPassport: false,
    });
    const [gstDetails, setGstDetails] = useState({
        isGst: false,
        gstNumber: '',
        gstName: '',
        gstAddress: ''
    });

    const [contactDetails, setContactDetails] = useState({
        mobile: "",
        whatsApp: "",
        email: ""
    });


    // Initialize passenger details based on search data
    useEffect(() => {
        const storedSearchingData = localStorage.getItem('formDataSearch');
        if (storedSearchingData) {
            const searchData = JSON.parse(storedSearchingData);
            if (searchData.adultCount >= 0 && searchData.childCount >= 0 && searchData.infantCount >= 0) {
                setSearchPayload(searchData);
                setPassengerDetails(createInitialPassengerDetails(searchData));
            } else {
                console.error("Invalid passenger counts in searchData", searchData);
                setPassengerDetails([]);
            }
        }
    }, []);

    const createInitialPassengerDetails = (searchData) => {
        const adults = Array.from({ length: searchData.adultCount }, () => ({
            paxType: 0,
            title: '',
            firstName: '',
            lastName: '',
            gender: '',
            age: "",
            dob: "",
            passportNumber: "",
            passportIssuingAuthority: "",
            passportExpire: "",
            nationality: "",
            pancardNumber: "",
            frequentFlyerDetails: ""
        }));
        const children = Array.from({ length: searchData.childCount }, () => ({
            paxType: 1,
            title: '',
            firstName: '',
            lastName: '',
            gender: '',
            age: "",
            dob: "",
            passportNumber: "",
            passportIssuingAuthority: "",
            passportExpire: "",
            nationality: "",
            pancardNumber: "",
            frequentFlyerDetails: ""
        }));
        const infants = Array.from({ length: searchData.infantCount }, () => ({
            paxType: 2,
            title: '',
            firstName: '',
            lastName: '',
            gender: '',
            age: "",
            dob: "",
            passportNumber: "",
            passportIssuingAuthority: "",
            passportExpire: "",
            nationality: "",
            pancardNumber: "",
            frequentFlyerDetails: ""
        }));
        return [...adults, ...children, ...infants];
    };

    // Handle change for passenger input
    const handlePassengerChange = (index, key, value) => {
        const updatedPassengers = [...passengerDetails];
        if (updatedPassengers[index]) {
            updatedPassengers[index][key] = value;
            setPassengerDetails(updatedPassengers);
        } else {
            console.error('Index out of bounds:', index);
        }
    };

    // Get encrypted credentials from API
    const getEncryptedCredentials = async () => {
        try {
            const response = await axios.get('https://api.launcherr.co/api/AES/Encryption');
            setEncryptedToken(response.data.encrypted_token);
            setEncryptedKey(response.data.encrypted_key);
        } catch (error) {
            console.error('Error encrypting credentials:', error);
        }
    };

    // Fetch fare rules from API
    const fetchFareRules = async () => {
        if (!encryptedToken || !encryptedKey) return;
        const fareRulesPayload = {
            SearchKey: searchKey || '',
            FlightKey: flightKey,
            FareID: Fare_Id || '',
            headersToken: encryptedToken,
            headersKey: encryptedKey,
        };

        try {
            const response = await axios.post('https://api.launcherr.co/api/Fare/Rule', fareRulesPayload);
            setFareRules(response.data?.data?.payloads?.data?.fareRules || []);
        } catch (error) {
            console.error('Error fetching fare rules:', error);
        }
    };

    // Fetch price details from API
    const fetchPriceDetails = async () => {
        if (!encryptedToken || !encryptedKey) return;

        const priceDetailsPayload = {
            SearchKey: searchKey || '',
            FlightKey: flightKey,
            FareID: Fare_Id || '',
            headersToken: encryptedToken,
            headersKey: encryptedKey,
            CustomerContact: "9898978989",
            childCount: searchPayload.childCount,
            adultCount: searchPayload.adultCount,
            infantCount: searchPayload.infantCount,
        };

        try {
            const response = await axios.post('https://api.launcherr.co/api/Re/Price', priceDetailsPayload);
            setPriceDetails(response?.data?.data?.payloads?.data?.rePrice || {});
            setPriceDetailsNew(response)
            console.log("totalamount", response?.data?.totalAmount);
            setNewFlightKey(response?.data?.data?.payloads?.data?.rePrice[0]?.Flight?.Flight_Key)
            setTotalAmount(response?.data?.totalAmount)
            setLoadingLaod(false)
        } catch (error) {
            setRepriceError(error)
            console.error('Error fetching price details:', error);
            setLoadingLaod(false)
        }
    };

    // Fetch fare rules and price details on component mount
    useEffect(() => {
        const init = async () => {
            await getEncryptedCredentials();
            if (encryptedToken && encryptedKey) {
                await fetchFareRules();
                await fetchPriceDetails();
            }
        };
        init();
    }, []);

    // Fetch fare rules and price details when tokens change
    useEffect(() => {
        if (encryptedToken && encryptedKey) {
            fetchFareRules();
            fetchPriceDetails();
        }
    }, [encryptedToken, encryptedKey]);

    // Handle payment method selection
    const handlePayment = (method) => {
        setSelectedPaymentMethod(method);
        setIsPaymentEnabled(true);
    };

    // Handle continue to payment
    const handleContinuePayment = async () => {
        if (!encryptedToken || !encryptedKey) return;

        const TotalCount = (Number(searchPayload.childCount) + Number(searchPayload.adultCount) + Number(searchPayload.infantCount)).toString();
        const bookingData = {
            totalCount: TotalCount,
            mobile: contactDetails.mobile,
            whatsApp: contactDetails.whatsApp,
            email: contactDetails.email,
            passenger_details: passengerDetails, // This now contains all passengers
            gst: {
                isGst: gstDetails.isGst.toString(),
                gstNumber: gstDetails.gstNumber,
                gstName: gstDetails.gstName,
                gstAddress: gstDetails.gstAddress
            },
            headersToken: encryptedToken,
            headersKey: encryptedKey,
            searchKey: searchKey || '',
            FlightKey: newFlightKey || '',
        };

        try {
            const response = await axios.post('https://api.launcherr.co/api/Temp/Booking', bookingData);
            const bookingRefNumber = response.data?.data?.payloads?.data?.bookingRef;
            setBookingRef(bookingRefNumber);

            if (!bookingRefNumber) {
                toast.error('Booking Reference Number is missing. Please try again.');
                return;
            }

            const redirectUrl = selectedPaymentMethod === 'phonepe'
                ? `https://shubhangverma.com/flight/phonepe.php?amount=${paymentTotalAmount}&BookingRef=${bookingRefNumber}`
                : `https://api.launcherr.co/api/paypal?price=${paymentTotalAmount}&BookingRef=${bookingRefNumber}`;

            setTimeout(() => {
                window.location.href = redirectUrl;
            }, 3000);

            toast.success('Booking successful!');
        } catch (error) {
            console.error('Error during booking:', error);
            toast.error('Error during booking');
        }
    };

    // Fetch airline logo based on price details
    useEffect(() => {
        if (priceDetails && Array.isArray(priceDetails)) {
            const fetchAirlineLogo = async (airlineCode) => {
                try {
                    const response = await axios.get(`https://api.launcherr.co/api/show/Airline?code=${airlineCode}`);
                    if (response?.data?.success) {
                        setAirlineLogo(response?.data?.data?.logo);
                    }
                } catch (error) {
                    console.error('Error fetching airline data:', error);
                }
            };
            priceDetails?.forEach(priceDetail => {
                priceDetail?.Flight?.Segments?.forEach(segment => {
                    fetchAirlineLogo(segment?.AirlineCode);
                });
            });
        }
    }, [priceDetails]);



    const handleback = () => {
        router.back();
    }

    return (
        <>
         {loadingLaod ?
         <>
         <Loader/>
         </> : <>        
        <MainLayout>
            <div className={styles["flight-booking-main-container"]}>
                <div className={styles.container}>
                    <div className={styles.header}>
                        <button onClick={handleback} className={styles.backButton}><BackBtn /> Back to Search</button>
                        <h2>My booking</h2>
                    </div>
                    {priceDetails?.map((priceDetail, index) => {
                        const flight = priceDetail.Flight;
                        return (
                            <div key={index} className={styles["flight-detail"]}>
                                <div className={styles["flight-top"]}>
                                    <p>{flight?.Origin} - {flight?.Destination}</p>
                                    <p><strong>Travel Date:</strong> {flight?.TravelDate}</p>
                                </div>
                                <ul>
                                    {flight?.Segments?.map((segment, segIndex) => (
                                        <div key={segIndex} className={styles["flight-top-container"]}>
                                            <div className={styles["flight-info-inner-info"]}>

                                                {airlineLogo ? (
                                                    <img src={airlineLogo} alt={segment?.Airline_Code} style={{ width: '64px', height: '64px' }} />
                                                ) : (
                                                    <p>{segment?.Airline_Code}</p>
                                                )}
                                                <div className={styles["flight-or-desti"]}>
                                                    <div>
                                                        <div className={styles["or-des"]}>
                                                            <p>{segment?.Origin_City}</p>
                                                        </div>
                                                        <div className={styles.flightDuration}>
                                                            <span>{segment?.Departure_DateTime}</span>
                                                        </div>
                                                    </div>
                                                    <p className={styles["duration-flight"]}><DurationLogo /> {segment?.Duration}</p>
                                                    <div>
                                                        <div className={styles["or-des"]}>
                                                            <p>
                                                                {segment?.Destination_City}
                                                            </p>
                                                        </div>
                                                        <div className={styles?.flightDuration}>
                                                            <span> {segment?.Arrival_DateTime}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    ))}
                                </ul>

                            </div>
                        );
                    })}
                    <StepProgressBar />
                    <p className={styles["passportValid"]}>
                        Passport valid for at least 6 months from departure data is required for international travel or transit abroad
                        <br /><br />
                        Make sure that the passenger's name is exactly as written in the government issued ID/Passport/Driving License.
                        Avoid any mistake, becouse some airlines don't allow name corrections after booking
                    </p>
                    <div className={styles.formSection}>
                        <h3 className={styles.heading}><ContactIcon /> Contact details</h3>

                        <div className={styles.inputGroup}>
                            <div className={''}>
                                <label>Country code</label>
                                <select className={styles.input}>
                                    <option>India (91)</option>
                                    <option>USA (1)</option>
                                </select>
                            </div>
                            <div className={''}>
                                <label>Mobile no.</label>
                                <input
                                    className={styles.input}
                                    type="text"
                                    placeholder="Mobile Number"
                                    value={contactDetails.mobile}
                                    onChange={(e) => setContactDetails({ ...contactDetails, mobile: e.target.value })}
                                />
                            </div>
                            <div className={''}>
                                <label>WhatsApp no.</label>
                                <input className={styles.input}
                                    type="text"
                                    placeholder="WhatsApp Number"
                                    value={contactDetails.whatsApp}
                                    onChange={(e) => setContactDetails({ ...contactDetails, whatsApp: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className={''}>
                            <label>Email</label>
                            <input className={styles.input}
                                type="email"
                                placeholder="Email"
                                value={contactDetails.email}
                                onChange={(e) => setContactDetails({ ...contactDetails, email: e.target.value })}
                            />
                        </div>
                        <div className={styles["passenger-main-top-container"]}>
                            <>
                                <h3 className={styles.heading}><InfoIcon /> Passenger details</h3>
                                {passengerDetails?.map((passenger, index) => (
                                    <div key={index} className={styles.passengerForm}>

                                        {passenger.paxType === 0 && ( // Adult
                                            <div className={styles.inputGroupDo}>
                                                <div>
                                                    <div className={styles.heading_inner_main}>
                                                        <p>
                                                            {`Adult ${index + 1}`}
                                                        </p>
                                                    </div>
                                                    <div className={styles.formRow}>
                                                        <div className={styles.inputGroup}>
                                                            <div>
                                                                <label>Title</label>
                                                                <select
                                                                    className={styles.input}
                                                                    value={passenger.title}
                                                                    onChange={(e) => handlePassengerChange(index, 'title', e.target.value)}
                                                                >
                                                                    <option value="">Select Title</option>
                                                                    <option value="Mr">Mr</option>
                                                                    <option value="Mrs">Mrs</option>
                                                                    <option value="Ms">Ms</option>
                                                                </select>
                                                            </div>
                                                            <div>
                                                                <label>First Name</label>

                                                                <input
                                                                    type="text"
                                                                    className={styles.input}
                                                                    placeholder="First Name"
                                                                    value={passenger.firstName}
                                                                    onChange={(e) => handlePassengerChange(index, 'firstName', e.target.value)}
                                                                />
                                                            </div>
                                                            <div>
                                                                <label>Last Name</label>
                                                                <input
                                                                    type="text"
                                                                    className={styles.input}
                                                                    placeholder="Last Name"
                                                                    value={passenger.lastName}
                                                                    onChange={(e) => handlePassengerChange(index, 'lastName', e.target.value)}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className={styles.inputGroup}>

                                                            <div>
                                                                <label>Gender</label>
                                                                <select
                                                                    className={styles.input}
                                                                    value={passenger.gender}
                                                                    onChange={(e) => handlePassengerChange(index, 'gender', e.target.value)}
                                                                >
                                                                    <option value="">Select Gender</option>
                                                                    <option value="0">Male</option>
                                                                    <option value="1">Female</option>
                                                                    <option value="2">Non-Binary</option>
                                                                    <option value="3">Prefer not to say</option>
                                                                </select>
                                                            </div>
                                                            <div>
                                                                <label>Age</label>
                                                                <input
                                                                    type="text"
                                                                    placeholder="Age"
                                                                    className={styles.input}
                                                                    value={passenger.age}
                                                                    onChange={(e) => handlePassengerChange(index, 'age', e.target.value)}
                                                                />
                                                            </div>
                                                            <div>
                                                                <label>Date of Birth</label>
                                                                <input
                                                                    type="date"
                                                                    placeholder="Date of Birth"
                                                                    className={styles.input}
                                                                    value={passenger.dob}
                                                                    onChange={(e) => handlePassengerChange(index, 'dob', e.target.value)}
                                                                />
                                                            </div>
                                                            <div>
                                                                <label >Pancard Number</label>
                                                                <input
                                                                    type="text"
                                                                    className={styles.input}
                                                                    placeholder="Pancard Number"
                                                                    value={passenger.pancardNumber}
                                                                    onChange={(e) => handlePassengerChange(index, 'pancardNumber', e.target.value)}
                                                                />
                                                            </div>
                                                        </div>
                                                        <h3 className={styles.heading}><BusinessProile /> Identity (For International)</h3>
                                                        <div className={styles.formRow2}>
                                                            <input
                                                                type="checkbox"
                                                                checked={passportDetails.isPassport}
                                                                onChange={(e) => setPassportDetails({ ...passportDetails, isPassport: e.target.checked })}
                                                            />
                                                            <label className={styles["labelcheckpassport"]}>Check this if you want to enter passport details</label>
                                                        </div>
                                                        {passportDetails.isPassport && (
                                                            <>
                                                                <div>
                                                                    <label>Passport Number</label>
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Passport Number"
                                                                        className={styles.input}
                                                                        value={passenger.passportNumber}
                                                                        onChange={(e) => handlePassengerChange(index, 'passportNumber', e.target.value)}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label>Passport Issuing Authority</label>
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Passport Issuing Authority"
                                                                        className={styles.input}
                                                                        value={passenger.passportIssuingAuthority}
                                                                        onChange={(e) => handlePassengerChange(index, 'passportIssuingAuthority', e.target.value)}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label>Passport Expire</label>
                                                                    <input
                                                                        type="date"
                                                                        placeholder="Passport Expire"
                                                                        value={passenger.passportExpire}
                                                                        className={styles.input}
                                                                        onChange={(e) => handlePassengerChange(index, 'passportExpire', e.target.value)}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label>Nationality</label>
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Nationality"
                                                                        className={styles.input}
                                                                        value={passenger.nationality}
                                                                        onChange={(e) => handlePassengerChange(index, 'nationality', e.target.value)}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label>Frequent FlyerDetails</label>
                                                                    <input
                                                                        type="text"
                                                                        placeholder="frequentFlyerDetails"
                                                                        className={styles.input}
                                                                        value={passenger.frequentFlyerDetails}
                                                                        onChange={(e) => handlePassengerChange(index, 'frequentFlyerDetails', e.target.value)}
                                                                    />
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}


                                        {passenger.paxType === 1 && ( // Child
                                            <div className={styles.inputGroupDo}>
                                                <div>
                                                    <div className={styles.heading_inner_main}>
                                                        <p>
                                                            {`Child ${index - searchPayload.adultCount + 1}`}
                                                        </p>
                                                    </div>
                                                    <div className={styles.formRow}>
                                                        <div className={styles.inputGroup}>
                                                            <div>
                                                                <label>Title</label>
                                                                <select
                                                                    className={styles.input}
                                                                    value={passenger.title}
                                                                    onChange={(e) => handlePassengerChange(index, 'title', e.target.value)}
                                                                >
                                                                    <option value="">Select Title</option>
                                                                    <option value="Mstr">Mstr</option>
                                                                    <option value="Miss">Miss</option>
                                                                </select>
                                                            </div>
                                                            <div>
                                                                <label>First Name</label>

                                                                <input
                                                                    type="text"
                                                                    className={styles.input}
                                                                    placeholder="First Name"
                                                                    value={passenger.firstName}
                                                                    onChange={(e) => handlePassengerChange(index, 'firstName', e.target.value)}
                                                                />
                                                            </div>
                                                            <div>
                                                                <label>Last Name</label>
                                                                <input
                                                                    type="text"
                                                                    className={styles.input}
                                                                    placeholder="Last Name"
                                                                    value={passenger.lastName}
                                                                    onChange={(e) => handlePassengerChange(index, 'lastName', e.target.value)}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className={styles.inputGroup}>
                                                        <div>
                                                                <label>Gender</label>
                                                                <select
                                                                    className={styles.input}
                                                                    value={passenger.gender}
                                                                    onChange={(e) => handlePassengerChange(index, 'gender', e.target.value)}
                                                                >
                                                                    <option value="">Select Gender</option>
                                                                    <option value="0">Male</option>
                                                                    <option value="1">Female</option>
                                                                    <option value="2">Non-Binary</option>
                                                                    <option value="3">Prefer not to say</option>
                                                                </select>
                                                            </div>
                                                            <div>
                                                                <label>Age</label>
                                                                <input
                                                                    type="text"
                                                                    placeholder="Age"
                                                                    className={styles.input}
                                                                    value={passenger.age}
                                                                    onChange={(e) => handlePassengerChange(index, 'age', e.target.value)}
                                                                />
                                                            </div>
                                                            <div>
                                                                <label>Date of Birth</label>
                                                                <input
                                                                    type="date"
                                                                    placeholder="Date of Birth"
                                                                    className={styles.input}
                                                                    value={passenger.dob}
                                                                    onChange={(e) => handlePassengerChange(index, 'dob', e.target.value)}
                                                                />
                                                            </div>
                                                            <div>
                                                                <label >Pancard Number</label>
                                                                <input
                                                                    type="text"
                                                                    className={styles.input}
                                                                    placeholder="Pancard Number"
                                                                    value={passenger.pancardNumber}
                                                                    onChange={(e) => handlePassengerChange(index, 'pancardNumber', e.target.value)}
                                                                />
                                                            </div>
                                                        </div>
                                                        <h3 className={styles.heading}><BusinessProile /> Identity (For International)</h3>
                                                        <div className={styles.formRow2}>
                                                            <input
                                                                type="checkbox"
                                                                checked={passportDetails.isPassport}
                                                                onChange={(e) => setPassportDetails({ ...passportDetails, isPassport: e.target.checked })}
                                                            />
                                                            <label className={styles["labelcheckpassport"]}>Check this if you want to enter passport details</label>
                                                        </div>
                                                        {passportDetails.isPassport && (
                                                            <>
                                                                <div>
                                                                    <label>Passport Number</label>
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Passport Number"
                                                                        className={styles.input}
                                                                        value={passenger.passportNumber}
                                                                        onChange={(e) => handlePassengerChange(index, 'passportNumber', e.target.value)}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label>Passport Issuing Authority</label>
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Passport Issuing Authority"
                                                                        className={styles.input}
                                                                        value={passenger.passportIssuingAuthority}
                                                                        onChange={(e) => handlePassengerChange(index, 'passportIssuingAuthority', e.target.value)}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label>Passport Expire</label>
                                                                    <input
                                                                        type="date"
                                                                        placeholder="Passport Expire"
                                                                        value={passenger.passportExpire}
                                                                        className={styles.input}
                                                                        onChange={(e) => handlePassengerChange(index, 'passportExpire', e.target.value)}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label>Nationality</label>
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Nationality"
                                                                        className={styles.input}
                                                                        value={passenger.nationality}
                                                                        onChange={(e) => handlePassengerChange(index, 'nationality', e.target.value)}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label>Frequent FlyerDetails</label>
                                                                    <input
                                                                        type="text"
                                                                        placeholder="frequentFlyerDetails"
                                                                        className={styles.input}
                                                                        value={passenger.frequentFlyerDetails}
                                                                        onChange={(e) => handlePassengerChange(index, 'frequentFlyerDetails', e.target.value)}
                                                                    />
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {passenger.paxType === 2 && ( // Infant
                                            <div className={styles.inputGroupDo}>

                                                <div>
                                                    <div className={styles.heading_inner_main}>
                                                        <p>
                                                            {`Infant ${index - searchPayload.adultCount - searchPayload.childCount + 1}`}
                                                        </p>
                                                    </div>
                                                    <div className={styles.formRow}>
                                                        <div className={styles.inputGroup}>
                                                            <div>
                                                                <label>Title</label>
                                                                <select
                                                                    className={styles.input}
                                                                    value={passenger.title}
                                                                    onChange={(e) => handlePassengerChange(index, 'title', e.target.value)}
                                                                >
                                                                    <option value="">Select Title</option>
                                                                    <option value="Mstr">Mstr</option>
                                                                    <option value="Miss">Miss</option>
                                                                </select>
                                                            </div>
                                                            <div>
                                                                <label>First Name</label>

                                                                <input
                                                                    type="text"
                                                                    className={styles.input}
                                                                    placeholder="First Name"
                                                                    value={passenger.firstName}
                                                                    onChange={(e) => handlePassengerChange(index, 'firstName', e.target.value)}
                                                                />
                                                            </div>
                                                            <div>
                                                                <label>Last Name</label>
                                                                <input
                                                                    type="text"
                                                                    className={styles.input}
                                                                    placeholder="Last Name"
                                                                    value={passenger.lastName}
                                                                    onChange={(e) => handlePassengerChange(index, 'lastName', e.target.value)}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className={styles.inputGroup}>
                                                        <div>
                                                                <label>Gender</label>
                                                                <select
                                                                    className={styles.input}
                                                                    value={passenger.gender}
                                                                    onChange={(e) => handlePassengerChange(index, 'gender', e.target.value)}
                                                                >
                                                                    <option value="">Select Gender</option>
                                                                    <option value="0">Male</option>
                                                                    <option value="1">Female</option>
                                                                    <option value="2">Non-Binary</option>
                                                                    <option value="3">Prefer not to say</option>
                                                                </select>
                                                            </div>
                                                            <div>
                                                                <label>Age</label>
                                                                <input
                                                                    type="text"
                                                                    placeholder="Age"
                                                                    className={styles.input}
                                                                    value={passenger.age}
                                                                    onChange={(e) => handlePassengerChange(index, 'age', e.target.value)}
                                                                />
                                                            </div>
                                                            <div>
                                                                <label>Date of Birth</label>
                                                                <input
                                                                    type="date"
                                                                    placeholder="Date of Birth"
                                                                    className={styles.input}
                                                                    value={passenger.dob}
                                                                    onChange={(e) => handlePassengerChange(index, 'dob', e.target.value)}
                                                                />
                                                            </div>
                                                            <div>
                                                                <label >Pancard Number</label>
                                                                <input
                                                                    type="text"
                                                                    className={styles.input}
                                                                    placeholder="Pancard Number"
                                                                    value={passenger.pancardNumber}
                                                                    onChange={(e) => handlePassengerChange(index, 'pancardNumber', e.target.value)}
                                                                />
                                                            </div>
                                                        </div>
                                                        <h3 className={styles.heading}><BusinessProile /> Identity (For International)</h3>
                                                        <div className={styles.formRow2}>
                                                            <input
                                                                type="checkbox"
                                                                checked={passportDetails.isPassport}
                                                                onChange={(e) => setPassportDetails({ ...passportDetails, isPassport: e.target.checked })}
                                                            />
                                                            <label className={styles["labelcheckpassport"]}>Check this if you want to enter passport details</label>
                                                        </div>
                                                        {passportDetails.isPassport && (
                                                            <>
                                                                <div>
                                                                    <label>Passport Number</label>
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Passport Number"
                                                                        className={styles.input}
                                                                        value={passenger.passportNumber}
                                                                        onChange={(e) => handlePassengerChange(index, 'passportNumber', e.target.value)}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label>Passport Issuing Authority</label>
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Passport Issuing Authority"
                                                                        className={styles.input}
                                                                        value={passenger.passportIssuingAuthority}
                                                                        onChange={(e) => handlePassengerChange(index, 'passportIssuingAuthority', e.target.value)}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label>Passport Expire</label>
                                                                    <input
                                                                        type="date"
                                                                        placeholder="Passport Expire"
                                                                        value={passenger.passportExpire}
                                                                        className={styles.input}
                                                                        onChange={(e) => handlePassengerChange(index, 'passportExpire', e.target.value)}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label>Nationality</label>
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Nationality"
                                                                        className={styles.input}
                                                                        value={passenger.nationality}
                                                                        onChange={(e) => handlePassengerChange(index, 'nationality', e.target.value)}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label>Frequent FlyerDetails</label>
                                                                    <input
                                                                        type="text"
                                                                        placeholder="frequentFlyerDetails"
                                                                        className={styles.input}
                                                                        value={passenger.frequentFlyerDetails}
                                                                        onChange={(e) => handlePassengerChange(index, 'frequentFlyerDetails', e.target.value)}
                                                                    />
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                        )}
                                    </div>
                                ))}
                            </>
                        </div>

                        <h3 className={styles.heading}><BusinessProile /> Use GSTIN for this booking (Optional)</h3>
                        <div className={styles.formRow2}>
                            <input
                                type="checkbox"
                                checked={gstDetails.isGst}
                                onChange={(e) => setGstDetails({ ...gstDetails, isGst: e.target.checked })}
                            />
                            <label>Check this if you want to enter GST details</label>
                        </div>
                        {gstDetails.isGst && (
                            <div className={styles.formRow}>
                                <input
                                    className={styles.input}
                                    type="text"
                                    placeholder="GST Number"
                                    value={gstDetails.gstNumber}
                                    onChange={(e) => setGstDetails({ ...gstDetails, gstNumber: e.target.value })}
                                />
                                <input
                                    className={styles.input}
                                    type="text"
                                    placeholder="GST Name"
                                    value={gstDetails.gstName}
                                    onChange={(e) => setGstDetails({ ...gstDetails, gstName: e.target.value })}
                                />
                                <input
                                    className={styles.input}
                                    type="text"
                                    placeholder="GST Address"
                                    value={gstDetails.gstAddress}
                                    onChange={(e) => setGstDetails({ ...gstDetails, gstAddress: e.target.value })}
                                />
                            </div>
                        )}

                        <div className={styles.formSection}>
                            <h3 className={styles.heading}>Choose Payment Option</h3>
                            <div className={styles.paymentOptions}>
                                <button
                                    className={styles.payButton}
                                    onClick={() => {
                                        handlePayment('phonepe');
                                        setActiveButton('phonepe');
                                    }}
                                    style={{
                                        backgroundColor: activeButton === 'phonepe' ? '#d1e7dd' : '',
                                    }}
                                    onMouseDown={() => setActiveButton('phonepe')}
                                    onMouseUp={() => setActiveButton(null)}
                                >
                                    <img src="/icons/phonepe-icon.webp" alt="" />
                                    <p>Pay with PhonePe</p>
                                </button>
                                <button
                                    className={styles.payButton}
                                    onClick={() => {
                                        handlePayment('paypal');
                                        setActiveButton('paypal');
                                    }}
                                    style={{
                                        backgroundColor: activeButton === 'paypal' ? '#d1e7dd' : '',
                                    }}
                                    onMouseDown={() => setActiveButton('paypal')}
                                    onMouseUp={() => setActiveButton(null)}
                                >
                                    <img src="/icons/PayPal_Logo_Icon_2014.svg.png" alt="" />
                                    <p>Pay with PayPal</p>
                                </button>
                            </div>
                        </div>
                        <button
                            style={{ width: "100%", borderRadius: '5px' }}
                            onClick={handleContinuePayment}
                            className={styles['book-btn-primary']}
                            disabled={!isPaymentEnabled}
                        >
                            {loading ? 'Processing...' : ' Continue to Payment'}
                        </button>
                    </div>
                </div>
                <div className={styles["flight-info-container"]}>
                    <div className={styles["flight-price-info"]}>
                        <div className={styles.priceBox}>
                            <FlightPriceTable repriceError={repriceError} priceDetailsNew={priceDetailsNew} />
                        </div>
                    </div>
                    <div className={styles["flight-about"]}>
                        {fareRules.length > 0 ? (
                            fareRules.map((rule, index) => (
                                <div className={styles["farerules"]} key={index} dangerouslySetInnerHTML={{ __html: rule.FareRuleDesc }} />
                            ))
                        ) : (
                            <p>No fare rules available.</p>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
         </>}
        </>
    );
};

export default FlightBookingDetails;
