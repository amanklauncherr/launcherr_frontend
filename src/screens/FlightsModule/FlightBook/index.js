import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './flightbook.module.css';
import MainLayout from '@/components/MainLayout';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import FlightPriceTable from './FlightPriceTable'
import Loader from '@/components/Loader';

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

    const [passengerDetails, setPassengerDetails] = useState({
        mobile: '',
        whatsApp: '',
        email: '',
        paxDetails: [
            {
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
            }
        ]
    });
    const [gstDetails, setGstDetails] = useState({
        isGst: false,
        gstNumber: '',
        gstName: '',
        gstAddress: ''
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
            deviceInfo: {
                ip: '143.244.130.59', // This can be dynamic if needed
                imeiNumber: '12384659878976879888',
            },
            searchKey: searchKey || '', // Use the searchKey from the URL query
            fareId: Fare_Id || '', // Use the fareId from the URL query
            flightKey: flightKey || '', // Use the flightKey from the URL query
        };

        try {
            const response = await axios.post(
                'https://api.dotmik.in/api/flightBooking/v1/fareRule',
                fareRulesPayload,
                {
                    headers: {
                        'D-SECRET-TOKEN': encryptedToken,
                        'D-SECRET-KEY': encryptedKey,
                        'CROP-CODE': 'DOTMIK160614',
                        'Content-Type': 'application/json',
                    },
                }
            );
            setFareRules(response.data?.payloads?.data?.fareRules || []); // Ensure it's an array
            console.log(response.data?.payloads?.data?.fareRules);
        } catch (error) {
            console.error('Error fetching fare rules:', error);
            // toast.error('Failed to fetch fare rules.');
        }
    };

    // Function to fetch price details
    const fetchPriceDetails = async () => {
        if (!encryptedToken || !encryptedKey) return; // Ensure credentials are available before making the request

        const priceDetailsPayload = {
            deviceInfo: {
                ip: '143.244.130.59', // This can be dynamic if needed
                imeiNumber: '12384659878976879888',
            },
            searchKey: searchKey || '', // Use the searchKey from the URL query
            flightKey: flightKey || '', // Use the flightKey from the URL query
            fareId: Fare_Id || '', // Use the fareId from the URL query
            customerMobile: '9871831224', // Placeholder mobile number, adjust as needed
            GSTIN: '', // Placeholder GSTIN, adjust as needed
        };

        try {
            const response = await axios.post(
                'https://api.dotmik.in/api/flightBooking/v1/rePrice',
                priceDetailsPayload,
                {
                    headers: {
                        'D-SECRET-TOKEN': encryptedToken,
                        'D-SECRET-KEY': encryptedKey,
                        'CROP-CODE': 'DOTMIK160614',
                        'Content-Type': 'application/json',
                    },
                }
            );
            setPriceDetails(response?.data?.payloads?.data?.rePrice || {}); // Save price details to state
            // console.log("repriceinnn", response?.data?.payloads?.data?.rePrice[0]?.Flight?.Fares[0]?.FareDetails[0]?.Total_Amount);
            setNewFlightKey(response?.data?.payloads?.data?.rePrice[0]?.Flight?.Flight_Key)
            setTotalAmount(response?.data?.payloads?.data?.rePrice[0]?.Flight?.Fares[0]?.FareDetails[0]?.Total_Amount)
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

        const bookingData = {
            deviceInfo: {
                ip: '143.244.130.59',
                imeiNumber: '12384659878976879888'
            },
            passengers: {
                mobile: passengerDetails.mobile,
                whatsApp: passengerDetails.whatsApp,
                email: passengerDetails.email,
                paxDetails: passengerDetails.paxDetails
            },
            gst: {
                isGst: gstDetails.isGst.toString(),
                gstNumber: gstDetails.gstNumber,
                gstName: gstDetails.gstName,
                gstAddress: gstDetails.gstAddress
            },
            flightDetails: [
                {
                    searchKey: searchKey || '',
                    flightKey: newFlightKey || '',
                    ssrDetails: []
                }
            ],
            costCenterId: 0,
            projectId: 0,
            bookingRemark: 'Test booking with PAX details',
            corporateStatus: 0,
            corporatePaymentMode: 0,
            missedSavingReason: null,
            corpTripType: null,
            corpTripSubType: null,
            tripRequestId: null,
            bookingAlertIds: null
        };

        try {
            const response = await axios.post(
                'https://api.dotmik.in/api/flightBooking/v1/tempBooking',
                bookingData,
                {
                    headers: {
                        'D-SECRET-TOKEN': encryptedToken,
                        'D-SECRET-KEY': encryptedKey,
                        'CROP-CODE': 'DOTMIK160614',
                        'Content-Type': 'application/json',
                    },
                }
            );
            console.log('Booking successful:', response.data);
            window.location.href = `https://shubhangverma.com/phonepe.php?amount=${paymentTotalAmount}`;
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
                    const response = await axios.get(`http://api.launcherr.co/api/show/Airline?code=${airlineCode}`);
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



    return (
        <MainLayout>
            <div className={styles["flight-booking-main-container"]}>
                <div className={styles.container}>
                    <div className={styles.header}>
                        <button className={styles.backButton}>&lt; Back to Search</button>
                        <h2>Review Your Flight Details</h2>
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
                                            <p className={styles["duration-flight"]}>{segment.Duration}</p>
                                        </div>
                                    ))}
                                </ul>

                            </div>
                        );
                    })}
                    <div className={styles.formSection}>
                        <h3>Contact Details</h3>
                        <div className={styles.formRow}>
                            <div className={styles.contactInputGroup}>
                                <select className={styles.input}>
                                    <option>India (91)</option>
                                    <option>USA (1)</option>
                                </select>
                                <input className={styles.input}
                                    type="text"
                                    placeholder="Mobile Number"
                                    value={passengerDetails.mobile}
                                    onChange={(e) => setPassengerDetails({ ...passengerDetails, mobile: e.target.value })}
                                />
                                <input className={styles.input}
                                    type="text"
                                    placeholder="WhatsApp Number"
                                    value={passengerDetails.whatsApp}
                                    onChange={(e) => setPassengerDetails({ ...passengerDetails, whatsApp: e.target.value })}
                                />
                                <input className={styles.input}
                                    type="email"
                                    placeholder="Email"
                                    value={passengerDetails.email}
                                    onChange={(e) => setPassengerDetails({ ...passengerDetails, email: e.target.value })}
                                />
                            </div>
                        </div>


                        <h3>Traveller Details</h3>
                        <div className={styles.formRow}>
                            <label>Adult X 1</label>
                            <div className={styles.inputGroup}>
                                <select className={styles.input}
                                    value={passengerDetails.paxDetails[0].title}
                                    onChange={(e) => setPassengerDetails({
                                        ...passengerDetails,
                                        paxDetails: [{ ...passengerDetails.paxDetails[0], title: e.target.value }]
                                    })}>
                                    <option>Title</option>
                                    <option value="Mr">Mr.</option>
                                    <option value="Ms">Ms.</option>
                                </select>
                                <input className={styles.input}
                                    type="text"
                                    placeholder="First Name"
                                    value={passengerDetails.paxDetails[0].firstName}
                                    onChange={(e) => setPassengerDetails({
                                        ...passengerDetails,
                                        paxDetails: [{ ...passengerDetails.paxDetails[0], firstName: e.target.value }]
                                    })}
                                />
                                <input className={styles.input}
                                    type="text"
                                    placeholder="Last Name"
                                    value={passengerDetails.paxDetails[0].lastName}
                                    onChange={(e) => setPassengerDetails({
                                        ...passengerDetails,
                                        paxDetails: [{ ...passengerDetails.paxDetails[0], lastName: e.target.value }]
                                    })}
                                />

                            </div>
                            <div className={styles.inputGroup}>
                                <div className={''}>
                                    <label>PAN Card Number</label>
                                    <input type="text" placeholder="PAN Card Number" className={styles.input}
                                        onChange={(e) => setPassengerDetails({ ...passengerDetails, paxDetails: [{ ...passengerDetails.paxDetails[0], pancardNumber: e.target.value }] })}
                                    />
                                </div>
                                <div className={''}>
                                    <label>Date of birth</label>
                                    <input className={styles.input}
                                        type="date"
                                        value={passengerDetails.paxDetails[0].dob}
                                        onChange={(e) => setPassengerDetails({
                                            ...passengerDetails,
                                            paxDetails: [{ ...passengerDetails.paxDetails[0], dob: e.target.value }]
                                        })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Contact Details */}


                        <div className={styles.formRow}>
                            <label>Passport Number</label>
                            <input type="text" placeholder="Passport Number" className={styles.input}
                                onChange={(e) => setPassengerDetails({ ...passengerDetails, paxDetails: [{ ...passengerDetails.paxDetails[0], passportNumber: e.target.value }] })}
                            />
                        </div>
                        <div className={styles.formRow}>
                            <label>Passport Issuing Authority</label>
                            <input type="text" placeholder="Passport Issuing Authority" className={styles.input}
                                onChange={(e) => setPassengerDetails({ ...passengerDetails, paxDetails: [{ ...passengerDetails.paxDetails[0], passportIssuingAuthority: e.target.value }] })}
                            />
                        </div>
                        <div className={styles.formRow}>
                            <label>Passport Expiry Date</label>
                            <input type="date" className={styles.input}
                                onChange={(e) => setPassengerDetails({ ...passengerDetails, paxDetails: [{ ...passengerDetails.paxDetails[0], passportExpire: e.target.value }] })}
                            />
                        </div>
                        <div className={styles.formRow}>
                            <label>Nationality</label>
                            <input type="text" placeholder="Nationality" className={styles.input}
                                onChange={(e) => setPassengerDetails({ ...passengerDetails, paxDetails: [{ ...passengerDetails.paxDetails[0], nationality: e.target.value }] })}
                            />
                        </div>

                        <div className={styles.formRow}>
                            <label>Frequent Flyer Details</label>
                            <input type="text" placeholder="Frequent Flyer Details" className={styles.input}
                                onChange={(e) => setPassengerDetails({ ...passengerDetails, paxDetails: [{ ...passengerDetails.paxDetails[0], frequentFlyerDetails: e.target.value }] })}
                            />
                        </div>

                        {/* GST Details */}
                        <h3>Use GSTIN for this booking (Optional)</h3>
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

                        <button style={{ width: "100%", borderRadius: '5px' }} onClick={handleContinuePayment} className='book-btn-primary'>Continue to Payment</button>
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


