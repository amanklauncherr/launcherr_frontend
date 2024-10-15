import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './flightbook.module.css';
import MainLayout from '@/components/MainLayout';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import FlightPriceTable from './FlightPriceTable'
import Loader from '@/components/Loader';
import PhonepayIcon from '@/components/Icons/PhonepayIcon';
import StepProgressBar from './StepProgressBar';
import BackBtn from '@/components/Icons/BackBtn';
import ContactIcon from '@/components/Icons/ContactIcon';
import InfoIcon from '@/components/Icons/InfoIcon';
import BusinessProile from '@/components/Icons/BusinessProile';
import DurationLogo from '@/components/Icons/DurationLogo';

const FlightBookingDetails = () => {
    const router = useRouter(); // Initialize useRouter to access query parameters
    const { searchKey, Fare_Id, flightKey } = router.query; // Destructure to get the required parameters from the URL
    const [encryptedToken, setEncryptedToken] = useState(null);
    const [encryptedKey, setEncryptedKey] = useState(null);
    const [fareRules, setFareRules] = useState([]);
    const [priceDetails, setPriceDetails] = useState(null);
    const [newFlightKey, setNewFlightKey] = useState('')
    const [airlineLogo, setAirlineLogo] = useState(null);
    const [paymentTotalAmount, setTotalAmount] = useState(null)
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
    const [isPaymentEnabled, setIsPaymentEnabled] = useState(false);
    const [bookingRefNumber, setBookingRef] = useState('')
    const [activeButton, setActiveButton] = useState(null);
    const [loading, setLoading] = useState(false);

    // Function to handle selecting the payment method
    const handlePayment = (method) => {
        setSelectedPaymentMethod(method);
        setIsPaymentEnabled(true); // Enable the "Continue to Payment" button
    };

    console.log("paymentTotalAmount", paymentTotalAmount)

    const [passengerDetails, setPassengerDetails] = useState({
        mobile: '',
        whatsApp: '',
        email: '',
        paxId: 1,
        paxType: 0,
        title: '',
        firstName: '',
        lastName: '',
        gender: 0,
        age: null,
        dob: '',
        passportNumber: '',
        passportIssuingAuthority: '',
        passportExpire: '',
        nationality: '',
        pancardNumber: '',
        frequentFlyerDetails: ''
    });

    const [gstDetails, setGstDetails] = useState({
        isGst: false,
        gstNumber: '',
        gstName: '',
        gstAddress: ''
    });


    const [passportDetails, setPassportDetails] = useState({
        isPassport: false,
        passportNumber: '',
        passportIssuingAuthority: '',
        passportExpire: ''
    });


    // Function to get encrypted credentials
    const getEncryptedCredentials = async () => {
        try {
            const response = await axios.get('https://api.launcherr.co/api/AES/Encryption');
            setEncryptedToken(response.data.encrypted_token);
            setEncryptedKey(response.data.encrypted_key);
        } catch (error) {
            console.error('Error encrypting credentials:', error);
            // toast.error('Error fetching encrypted credentials.');
        }
    };

    // Function to fetch fare rules
    const fetchFareRules = async () => {
        if (!encryptedToken || !encryptedKey) return; // Ensure credentials are available before making the request

        const fareRulesPayload = {
            SearchKey: searchKey || '', // Use the searchKey from the URL query
            FlightKey: flightKey, // Use the flightKey from the URL query
            FareID: Fare_Id || '',
            headersToken: encryptedToken,
            headersKey: encryptedKey,
            // CustomerContact : "9898978989"
        };

        try {
            const response = await axios.post(
                'https://api.launcherr.co/api/Fare/Rule',
                fareRulesPayload,
            );
            setFareRules(response.data?.data?.payloads?.data?.fareRules || []); // Ensure it's an array
            console.log("fareRules", response.data?.data?.payloads?.data?.fareRules);
        } catch (error) {
            console.error('Error fetching fare rules:', error);
            // toast.error('Failed to fetch fare rules.');
        }
    };

    // Function to fetch price details
    const fetchPriceDetails = async () => {
        if (!encryptedToken || !encryptedKey) return; // Ensure credentials are available before making the request

        const priceDetailsPayload = {
            SearchKey: searchKey || '', // Use the searchKey from the URL query
            FlightKey: flightKey, // Use the flightKey from the URL query
            FareID: Fare_Id || '',
            headersToken: encryptedToken,
            headersKey: encryptedKey,
            CustomerContact: "9898978989"
        };

        try {
            const response = await axios.post(
                'https://api.launcherr.co/api/Re/Price',
                priceDetailsPayload
            );
            setPriceDetails(response?.data?.data?.payloads?.data?.rePrice || {}); // Save price details to state
            console.log("repriceinnn", response?.data?.data?.payloads?.data?.rePrice[0]?.Flight?.Fares[0]?.FareDetails[0]?.Total_Amount);
            setNewFlightKey(response?.data?.data?.payloads?.data?.rePrice[0]?.Flight?.Flight_Key)
            setTotalAmount(response?.data?.data?.payloads?.data?.rePrice[0]?.Flight?.Fares[0]?.FareDetails[0]?.Total_Amount)
        } catch (error) {
            console.error('Error fetching price details:', error);
            // toast.error('Failed to fetch price details.');
        }
    };
    useEffect(() => {
        const init = async () => {
            await getEncryptedCredentials();

            if (encryptedToken && encryptedKey) {
                await fetchFareRules(); // Call fetchFareRules directly here
                await fetchPriceDetails(); // Fetch price details as well
            }
        };
        init();
    }, []);

    useEffect(() => {
        if (encryptedToken && encryptedKey) {
            fetchFareRules();
            fetchPriceDetails();
        }
    }, [encryptedToken, encryptedKey]);
    !priceDetails || !Array.isArray(priceDetails) || priceDetails.length === 0


    const handleContinuePayment = async () => {
        if (!encryptedToken || !encryptedKey) {
            // toast.error('Encrypted credentials not available.');
            return;
        }

        const bookingData =
        {
            passenger_details: {
                mobile: passengerDetails.mobile,
                whatsApp: passengerDetails.whatsApp,
                email: passengerDetails.email,
                paxId: passengerDetails.paxId,
                paxType: passengerDetails.paxType,
                title: passengerDetails.title,
                firstName: passengerDetails.firstName,
                lastName: passengerDetails.lastName,
                gender: passengerDetails.gender,
                dob: passengerDetails.dob,
                passportNumber: passengerDetails.passportNumber,
                passportIssuingAuthority: passengerDetails.passportIssuingAuthority,
                passportExpire: passengerDetails.passportExpire,
                nationality: passengerDetails.nationality,
                pancardNumber: passengerDetails.pancardNumber,
                frequentFlyerDetails: passengerDetails.frequentFlyerDetails
            },
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
        }

        try {
            const response = await axios.post(
                'https://api.launcherr.co/api/Temp/Booking',
                bookingData,
            );
            setLoading(true);
            console.log('Booking successful:', response.data);

            const bookingRefNumber = response?.data?.data?.payloads?.data?.bookingRef;
            setBookingRef(bookingRefNumber);

            if (!bookingRefNumber) {
                console.error('Booking Reference Number is not available.');
                toast.error('Booking Reference Number is missing. Please try again.');
                return; // Stop further execution if bookingRefNumber is missing
            }

            // Adding a 3-second timeout before redirecting
            setTimeout(() => {
                if (selectedPaymentMethod === 'phonepe') {
                    window.location.href = `https://shubhangverma.com/flight/phonepe.php?amount=${Total_Amount}&BookingRef=${bookingRefNumber}`;
                } else if (selectedPaymentMethod === 'paypal') {
                    window.location.href= `https://api.launcherr.co/api/paypal?price=${Total_Amount}&BookingRef=${bookingRefNumber}`;                    
                } else if (selectedPaymentMethod === 'direct') {
                    router.push(`/flightSuccess?BookingRef=${bookingRefNumber}`);
                }
            }, 3000); // 3000ms = 3 seconds

            toast.success('Booking successful!');
        } catch (error) {
            console.error('Error during booking:', error);
            toast.error('Error during booking');
        }

    };

    useEffect(() => {
        if (priceDetails && Array.isArray(priceDetails)) {
            const fetchAirlineLogo = async (airlineCode) => {
                try {
                    const response = await axios.get(`https://api.launcherr.co/api/show/Airline?code=${airlineCode}`);
                    if (response.data.success) {
                        setAirlineLogo(response.data.data.logo);
                    }
                } catch (error) {
                    console.error('Error fetching airline data:', error);
                }
            };

            priceDetails.forEach(priceDetail => {
                priceDetail.Flight.Segments.forEach(segment => {
                    fetchAirlineLogo(segment.Airline_Code); // Pass the segment's airline code here
                });
            });
        }
    }, [priceDetails]);



    const handleback = () => {
        router.back();
    }


    return (
        <MainLayout>
            <div className={styles["flight-booking-main-container"]}>
                <div className={styles.container}>
                    <div className={styles.header}>
                        <button onClick={handleback} className={styles.backButton}><BackBtn/> Back to Search</button>
                        <h2>My booking</h2>
                    </div>
                    {priceDetails?.map((priceDetail, index) => {
                        const flight = priceDetail.Flight;

                        return (
                            <div key={index} className={styles["flight-detail"]}>
                                {/* <p><strong>Airline:</strong> {flight.Airline_Code} - {flight.Flight_Id}</p> */}
                                <div className={styles["flight-top"]}>
                                    <p>{flight.Origin} - {flight.Destination}</p>
                                    <p><strong>Travel Date:</strong> {flight.TravelDate}</p>
                                </div>
                                <ul>
                                    {flight.Segments.map((segment, segIndex) => (
                                        <div key={segIndex} className={styles["flight-top-container"]}>
                                            <div className={styles["flight-info-inner-info"]}>

                                                {airlineLogo ? (
                                                    <img src={airlineLogo} alt={segment.Airline_Code} style={{ width: '64px', height: '64px' }} />
                                                ) : (
                                                    <p>{segment.Airline_Code}</p>
                                                )}
                                                <div className={styles["flight-or-desti"]}>
                                                    <div>
                                                        <div className={styles["or-des"]}>
                                                            <p>{segment.Origin_City}</p>
                                                        </div>
                                                        <div className={styles.flightDuration}>
                                                            <span>{segment.Departure_DateTime}</span>
                                                        </div>
                                                    </div>
                                                    <p className={styles["duration-flight"]}><DurationLogo/> {segment.Duration}</p>
                                                    <div>
                                                        <div className={styles["or-des"]}>
                                                            <p>
                                                                {segment.Destination_City}
                                                            </p>
                                                        </div>
                                                        <div className={styles.flightDuration}>
                                                            <span> {segment.Arrival_DateTime}</span>
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
                    <StepProgressBar/>
                    <p className={styles["passportValid"]}>
                                    Passport valid for at least 6 months from departure data is required for international travel or transit abroad
                                    <br /><br />
                                    Make sure that the passenger's name is exactly as written in the government issued ID/Passport/Driving License.
                                    Avoid any mistake, becouse some airlines don't allow name corrections after booking
                                </p>
                    <div className={styles.formSection}>
                        <h3 className={styles.heading}><ContactIcon/> Contact details</h3>
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
                                <input className={styles.input}
                                    type="text"
                                    placeholder="Mobile Number"
                                    value={passengerDetails.mobile}
                                    onChange={(e) => setPassengerDetails({ ...passengerDetails, mobile: e.target.value })}
                                />
                            </div>
                            <div className={''}>
                                <label>WhatsApp no.</label>
                                <input className={styles.input}
                                    type="text"
                                    placeholder="WhatsApp Number"
                                    value={passengerDetails.whatsApp}
                                    onChange={(e) => setPassengerDetails({ ...passengerDetails, whatsApp: e.target.value })}
                                />
                            </div>
                        </div>
                            <div className={''}>
                                <label>Email</label>
                                <input className={styles.input}
                                    type="email"
                                    placeholder="Email"
                                    value={passengerDetails.email}
                                    onChange={(e) => setPassengerDetails({ ...passengerDetails, email: e.target.value })}
                                />

                            </div>


                        <h3 className={styles.heading}><InfoIcon/> Passenger details</h3>
                        <div className={styles.formRow}>
                            {/* <label>Adult X 1</label> */}
                            <div className={styles.inputGroup}>
                                <div>
                                    <label>Title</label>
                                    <select
                                        className={styles.input}
                                        value={passengerDetails.title}
                                        onChange={(e) => setPassengerDetails({ ...passengerDetails, title: e.target.value })}
                                    >
                                        <option value="">Select Title</option> {/* Changed this option value to an empty string */}
                                        <option value="Mr">Mr.</option>
                                        <option value="Ms">Ms.</option>
                                    </select>
                                </div>
                                <div>
                                    <label>First Name</label>
                                    <input className={styles.input}
                                        type="text"
                                        placeholder="First Name"
                                        value={passengerDetails.firstName}
                                        onChange={(e) => setPassengerDetails({
                                            ...passengerDetails, firstName: e.target.value
                                        })}
                                    />
                                </div>
                                <div>
                                    <label>Last Name</label>
                                    <input className={styles.input}
                                        type="text"
                                        placeholder="Last Name"
                                        value={passengerDetails.lastName}
                                        onChange={(e) => setPassengerDetails({
                                            ...passengerDetails, lastName: e.target.value
                                        })}
                                    />
                                </div>

                            </div>

                            <div className={styles.inputGroup}>
                                <div className={''} style={{width:"100%"}}>
                                    <label>PAN Card Number</label>
                                    <input type="text" placeholder="PAN Card Number" className={styles.input}
                                        onChange={(e) => setPassengerDetails({ ...passengerDetails, pancardNumber: e.target.value })}
                                    />
                                </div>
                                <div className={''}>
                                    <label>Date of birth</label>
                                    <input className={styles.input}
                                        type="date"
                                        value={passengerDetails.dob}
                                        onChange={(e) => setPassengerDetails({
                                            ...passengerDetails, dob: e.target.value
                                        })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Contact Details */}


                        {/* Passport Details */}
                        <h3 className={styles.heading}><BusinessProile/> Identity (For International)</h3>
                        <div className={styles.formRow2}>
                            <input
                                type="checkbox"
                                checked={passportDetails.isPassport}
                                onChange={(e) => setPassportDetails({ ...passportDetails, isPassport: e.target.checked })}
                            />
                            <label className={styles["labelcheckpassport"]}>Check this if you want to enter passport details</label>
                        </div>
                        {passportDetails.isPassport && (
                            <div>
                                <div className={styles.formRow}>
                                    <label>Passport Number</label>
                                    <input type="text" placeholder="Passport Number" className={styles.input}
                                        value={passengerDetails.passportNumber}
                                        onChange={(e) => setPassengerDetails({ ...passengerDetails, passportNumber: e.target.value })}
                                    />
                                </div>
                                <div className={styles.formRow}>
                                    <label>Passport Issuing Authority</label>
                                    <input type="text" placeholder="Passport Issuing Authority" className={styles.input}
                                        value={passengerDetails.passportIssuingAuthority}
                                        onChange={(e) => setPassengerDetails({ ...passengerDetails, passportIssuingAuthority: e.target.value })}
                                    />
                                </div>
                                <div className={styles.formRow}>
                                    <label>Passport Expiry Date</label>
                                    <input type="date" className={styles.input}
                                        value={passengerDetails.passportExpire}
                                        onChange={(e) => setPassengerDetails({ ...passengerDetails, passportExpire: e.target.value })}
                                    />
                                </div>
                            </div>
                        )}

                        <div className={styles.formRow}>
                            <label>Nationality</label>
                            <input type="text" placeholder="Nationality" className={styles.input}
                                onChange={(e) => setPassengerDetails({ ...passengerDetails, nationality: e.target.value })}
                            />
                        </div>

                        <div className={styles.formRow}>
                            <label>Frequent Flyer Details</label>
                            <input type="text" placeholder="Frequent Flyer Details" className={styles.input}
                                onChange={(e) => setPassengerDetails({ ...passengerDetails, frequentFlyerDetails: e.target.value })}
                            />
                        </div>

                        {/* GST Details */}
                        <h3 className={styles.heading}><BusinessProile/> Use GSTIN for this booking (Optional)</h3>
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
                            {/* Existing form code for Contact Details, Traveller Details, Passport Details, GST Details */}

                            {/* Payment Options */}
                            <h3 className={styles.heading}>Choose Payment Option</h3>
                            <div className={styles.paymentOptions}>
                                <button
                                    className={styles.payButton}
                                    onClick={() => {
                                        handlePayment('phonepe');
                                        setActiveButton('phonepe'); // Set active button
                                    }}
                                    style={{
                                        backgroundColor: activeButton === 'phonepe' ? '#d1e7dd' : '', // Change color based on active state
                                    }}
                                    onMouseDown={() => setActiveButton('phonepe')} // Optional for immediate feedback
                                    onMouseUp={() => setActiveButton(null)} // Reset when mouse up
                                >
                                    <img src="/icons/phonepe-icon.webp" alt="" />
                                    <p>Pay with PhonePe</p>
                                    {/* <PhonepayIcon/> */}
                                </button>
                                <button
                                    className={styles.payButton}
                                    onClick={() => {
                                        handlePayment('paypal');
                                        setActiveButton('paypal'); // Set active button
                                    }}
                                    style={{
                                        backgroundColor: activeButton === 'paypal' ? '#d1e7dd' : '', // Change color based on active state
                                    }}
                                    onMouseDown={() => setActiveButton('paypal')} // Optional for immediate feedback
                                    onMouseUp={() => setActiveButton(null)} // Reset when mouse up
                                >
                                    <img src="/icons/PayPal_Logo_Icon_2014.svg.png" alt="" />
                                   <p>Pay with PayPal</p>
                                </button>
                                {/* <button
                                    className={styles.payButton}
                                    onClick={() => {
                                        handlePayment('direct');
                                        setActiveButton('direct'); // Set active button
                                    }}
                                    style={{
                                        backgroundColor: activeButton === 'direct' ? '#d1e7dd' : '', // Change color based on active state
                                    }}
                                    onMouseDown={() => setActiveButton('direct')} // Optional for immediate feedback
                                    onMouseUp={() => setActiveButton(null)} // Reset when mouse up
                                >
                                    Direct
                                </button> */}
                            </div>
                        </div>

                        <button
                            style={{ width: "100%", borderRadius: '5px' }}
                            onClick={handleContinuePayment}
                            className={styles['book-btn-primary']}
                            disabled={!isPaymentEnabled} // Button is disabled until a payment method is selected
                        >
                            {loading ? 'Processing...' : ' Continue to Payment'}
                        </button>
                    </div>

                </div>
                <div className={styles["flight-info-container"]}>
                    <div className={styles["flight-price-info"]}>
                        <div className={styles.priceBox}>
                            <FlightPriceTable priceDetails={priceDetails} />
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
    );
};

export default FlightBookingDetails;


