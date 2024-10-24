import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './flightbook.module.css';
import MainLayout from '@/components/MainLayout';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import FlightPriceTable from './FlightPriceTable';
import Loader from '@/components/Loader';
import PhonepayIcon from '@/components/Icons/PhonepayIcon';
import StepProgressBar from '../demo/StepProgressBar';
import BackBtn from '@/components/Icons/BackBtn';
import ContactIcon from '@/components/Icons/ContactIcon';
import InfoIcon from '@/components/Icons/InfoIcon';
import BusinessProile from '@/components/Icons/BusinessProile';
import DurationLogo from '@/components/Icons/DurationLogo';

const FlightBookingDetails = () => {
    const router = useRouter(); 
    const { searchKey, Fare_Id, flightKey } = router.query; 
    const [encryptedToken, setEncryptedToken] = useState(null);
    const [encryptedKey, setEncryptedKey] = useState(null);
    const [fareRules, setFareRules] = useState([]);
    const [priceDetails, setPriceDetails] = useState(null);
    const [priceDetailsNew, setPriceDetailsNew] = useState(null);
    const [newFlightKey, setNewFlightKey] = useState('');
    const [airlineLogo, setAirlineLogo] = useState(null);
    const [paymentTotalAmount, setTotalAmount] = useState(null);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
    const [isPaymentEnabled, setIsPaymentEnabled] = useState(false);
    const [bookingRefNumber, setBookingRef] = useState('');
    const [activeButton, setActiveButton] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchPayload, setSearchPayload] = useState();

    const handlePayment = (method) => {
        setSelectedPaymentMethod(method);
        setIsPaymentEnabled(true);
    };

    useEffect(() => {
        const storedSearchingData = localStorage.getItem('formDataSearch');
        if (storedSearchingData) {
            const searchData = JSON.parse(storedSearchingData);
            setSearchPayload(searchData);
        }
    }, []);

    const [passengerDetails, setPassengerDetails] = useState([]);
    const [gstDetails, setGstDetails] = useState({
        isGst: false,
        gstNumber: '',
        gstName: '',
        gstAddress: ''
    });
    const [passportDetails, setPassportDetails] = useState({
        isPassport: false,
    });

    const getEncryptedCredentials = async () => {
        try {
            const response = await axios.get('https://api.launcherr.co/api/AES/Encryption');
            setEncryptedToken(response.data.encrypted_token);
            setEncryptedKey(response.data.encrypted_key);
        } catch (error) {
            console.error('Error encrypting credentials:', error);
        }
    };

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
            const response = await axios.post(
                'https://api.launcherr.co/api/Fare/Rule',
                fareRulesPayload,
            );
            setFareRules(response.data?.data?.payloads?.data?.fareRules || []);
            console.log("fareRules", response.data?.data?.payloads?.data?.fareRules);
        } catch (error) {
            console.error('Error fetching fare rules:', error);
        }
    };

    const fetchPriceDetails = async () => {
        if (!encryptedToken || !encryptedKey) return;

        const priceDetailsPayload = {
            SearchKey: searchKey || '',
            FlightKey: flightKey,
            FareID: Fare_Id || '',
            headersToken: encryptedToken,
            headersKey: encryptedKey,
            CustomerContact: "9898978989",
            "childCount": searchPayload.childCount,
            "adultCount": searchPayload.adultCount,
            "infantCount": searchPayload.infantCount,
        };

        try {
            const response = await axios.post(
                'https://api.launcherr.co/api/Re/Price',
                priceDetailsPayload
            );
            setPriceDetails(response?.data?.data?.payloads?.data?.rePrice || {});
            setPriceDetailsNew(response)
            console.log("totalamount", response?.data?.totalAmount);
            setNewFlightKey(response?.data?.data?.payloads?.data?.rePrice[0]?.Flight?.Flight_Key);
            setTotalAmount(response?.data?.totalAmount);
        } catch (error) {
            console.error('Error fetching price details:', error);
        }
    };

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

    useEffect(() => {
        if (encryptedToken && encryptedKey) {
            fetchFareRules();
            fetchPriceDetails();
        }
    }, [encryptedToken, encryptedKey]);

    const handleContinuePayment = async () => {
        if (!encryptedToken || !encryptedKey) {
            return;
        }

        const TotalCount = (Number(searchPayload.childCount) + Number(searchPayload.adultCount) + Number(searchPayload.infantCount)).toString();

        const bookingData = {
            totalCount: TotalCount.toString(),
            mobile: passengerDetails.map(p => p.mobile).join(', '),
            whatsApp: passengerDetails.map(p => p.whatsApp).join(', '),
            email: passengerDetails.map(p => p.email).join(', '),
            passenger_details: passengerDetails.map(p => ({
                paxType: p.paxType,
                title: p.title,
                firstName: p.firstName,
                lastName: p.lastName,
                gender: p.gender,
                dob: p.dob,
                passportNumber: p.passportNumber,
                passportIssuingAuthority: p.passportIssuingAuthority,
                passportExpire: p.passportExpire,
                nationality: p.nationality,
                pancardNumber: p.pancardNumber,
                frequentFlyerDetails: p.frequentFlyerDetails,
            })),
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
                return;
            }

            setTimeout(() => {
                if (selectedPaymentMethod === 'phonepe') {
                    window.location.href = `https://shubhangverma.com/flight/phonepe.php?amount=${paymentTotalAmount}&BookingRef=${bookingRefNumber}`;
                } else if (selectedPaymentMethod === 'paypal') {
                    window.location.href = `https://api.launcherr.co/api/paypal?price=${paymentTotalAmount}&BookingRef=${bookingRefNumber}`;
                }
            }, 3000);

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
                    fetchAirlineLogo(segment.Airline_Code);
                });
            });
        }
    }, [priceDetails]);

    const handleback = () => {
        router.back();
    }

    // Function to handle passenger details form change
    const handlePassengerChange = (index, key, value) => {
        const updatedPassengers = [...passengerDetails];
        updatedPassengers[index][key] = value;
        setPassengerDetails(updatedPassengers);
    };

    // Render passenger details form based on counts
    const renderPassengerDetails = () => {
        const adults = Array.from({ length: searchPayload?.adultCount }, (_, index) => (
            <div key={index} className={styles.formRow}>
                <h4>Adult {index + 1}</h4>
                <input
                    type="text"
                    placeholder="First Name"
                    onChange={(e) => handlePassengerChange(index, 'firstName', e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Last Name"
                    onChange={(e) => handlePassengerChange(index, 'lastName', e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Mobile Number"
                    onChange={(e) => handlePassengerChange(index, 'mobile', e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Email"
                    onChange={(e) => handlePassengerChange(index, 'email', e.target.value)}
                />
                <select
                    onChange={(e) => handlePassengerChange(index, 'gender', e.target.value)}
                >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>
            </div>
        ));

        const children = Array.from({ length: searchPayload?.childCount }, (_, index) => (
            <div key={index + searchPayload.adultCount} className={styles.formRow}>
                <h4>Child {index + 1}</h4>
                <input
                    type="text"
                    placeholder="First Name"
                    onChange={(e) => handlePassengerChange(index + searchPayload.adultCount, 'firstName', e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Last Name"
                    onChange={(e) => handlePassengerChange(index + searchPayload.adultCount, 'lastName', e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Mobile Number"
                    onChange={(e) => handlePassengerChange(index + searchPayload.adultCount, 'mobile', e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Email"
                    onChange={(e) => handlePassengerChange(index + searchPayload.adultCount, 'email', e.target.value)}
                />
            </div>
        ));

        const infants = Array.from({ length: searchPayload?.infantCount }, (_, index) => (
            <div key={index + searchPayload.adultCount + searchPayload.childCount} className={styles.formRow}>
                <h4>Infant {index + 1}</h4>
                <input
                    type="text"
                    placeholder="First Name"
                    onChange={(e) => handlePassengerChange(index + searchPayload.adultCount + searchPayload.childCount, 'firstName', e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Last Name"
                    onChange={(e) => handlePassengerChange(index + searchPayload.adultCount + searchPayload.childCount, 'lastName', e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Mobile Number"
                    onChange={(e) => handlePassengerChange(index + searchPayload.adultCount + searchPayload.childCount, 'mobile', e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Email"
                    onChange={(e) => handlePassengerChange(index + searchPayload.adultCount + searchPayload.childCount, 'email', e.target.value)}
                />
            </div>
        ));

        return (
            <div>
                {adults}
                {children}
                {infants}
            </div>
        );
    };

    return (
        <MainLayout>
            <div className={styles.bookingContainer}>
                <BackBtn onClick={handleback} />
                <StepProgressBar step={2} />
                <h1>Flight Booking Details</h1>
                {loading ? (
                    <Loader />
                ) : (
                    <div>
                        {renderPassengerDetails()}
                        <h2>Total Amount: {paymentTotalAmount}</h2>
                        <div className={styles.paymentMethods}>
                            <button onClick={() => handlePayment('phonepe')}>Pay with PhonePe</button>
                            <button onClick={() => handlePayment('paypal')}>Pay with PayPal</button>
                        </div>
                        {isPaymentEnabled && (
                            <button onClick={handleContinuePayment}>Continue to Payment</button>
                        )}
                    </div>
                )}
            </div>
        </MainLayout>
    );
};

export default FlightBookingDetails;
