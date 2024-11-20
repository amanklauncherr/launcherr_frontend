import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import styles from './TicketComponent.module.css';
import Loader from '@/components/Loader';
import Cookies from 'js-cookie';

const TicketComponent = () => {
    const [encryptedToken, setEncryptedToken] = useState(null);
    const [encryptedKey, setEncryptedKey] = useState(null);
    const [ticketData, setTicketData] = useState(null);
    const router = useRouter();
    const { bookingRef } = router.query; // Extract bookingRef from URL

    useEffect(() => {
        const fetchEncryptedCredentials = async () => {
            try {
                const response = await axios.get('https://api.launcherr.co/api/AES/Encryption');
                setEncryptedToken(response.data.encrypted_token);
                setEncryptedKey(response.data.encrypted_key);
            } catch (error) {
                console.error('Error encrypting credentials:', error);
            }
        };

        fetchEncryptedCredentials();
    }, []);

    useEffect(() => {
        if (encryptedToken && encryptedKey && bookingRef) {
            const fetchTicketData = async () => {
                const authToken = Cookies.get('auth_token');
                if (authToken) {
                    try {
                        const payload = {
                            headersToken: encryptedToken,
                            headersKey: encryptedKey,
                            bookingRef: bookingRef,
                            pnr: "", // Add your PNR here, if available
                        };

                        const response = await axios.post('https://api.launcherr.co/api/Re/Print/Ticket', payload, {
                            headers: {
                                Authorization: `Bearer ${authToken}`
                            }
                        });
                        setTicketData(response.data); // Set ticket data
                    } catch (error) {
                        console.error('Error fetching ticket data:', error);
                    }
                };
            }
            fetchTicketData();
        }
    }, [encryptedToken, encryptedKey, bookingRef]);

    if (!ticketData) {
        return <>
            <Loader />
        </>;
    }

    // Destructure the data you need from the ticketData
    const { pnrDetails } = ticketData?.data?.payloads?.data?.rePrintTicket || {};
    const flight = pnrDetails?.[0]?.Flights?.[0];
    const fares = flight?.Fares?.[0]?.FareDetails?.[0];
    console.log("flight", flight)

    const Invoice_Number = ticketData?.data?.payloads?.data?.rePrintTicket?.Invoice_Number
    const PAX_EmailId = ticketData?.data?.payloads?.data?.rePrintTicket?.PAX_EmailId
    const PAX_Mobile = ticketData?.data?.payloads?.data?.rePrintTicket?.PAX_Mobile
    const Fistname = ticketData?.data?.payloads?.data?.rePrintTicket?.pnrDetails?.[0]?.PAXTicketDetails?.[0]?.First_Name
    const Lastname = ticketData?.data?.payloads?.data?.rePrintTicket?.pnrDetails?.[0]?.PAXTicketDetails?.[0]?.Last_Name

    const pdfUrl = ticketData?.pdf_url

    const handleDownload = () => {
        if (pdfUrl) {
            const link = document.createElement("a");
            link.href = pdfUrl; // Use the PDF URL from the ticket data
            link.setAttribute("download", "ticket.pdf"); // Name for the downloaded file
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            console.error("PDF URL not found.");
        }
    };

    return (
        <>
            <div className={styles.ticket}>
                <div className={styles.leftticket}>
                    <div className={styles.header}>
                        <div className={styles.passengerInfo}>
                            <h3 className={styles.h3}>Airline PNR</h3>
                            <p className={styles.p}>{pnrDetails?.[0]?.Airline_PNR}</p>
                        </div>
                        <div className={styles.flightInfo}>
                            <h3 className={styles.h3}>Flight Number</h3>
                            <p className={styles.p}>{flight?.Segments?.[0]?.Flight_Number}</p>
                        </div>
                        <div className={styles.seatInfo}>
                            <h3 className={styles.h3}>From</h3>
                            <p className={styles.p}>{flight?.Origin}</p>
                        </div>
                        <div className={styles.seatInfo}>
                            <h3 className={styles.h3}>To</h3>
                            <p className={styles.p}>{flight?.Destination}</p>
                        </div>
                    </div>

                    <div className={styles.mainInfo}>
                        <div className={styles.route}>
                            <h1>{flight?.Origin} ✈ {flight?.Destination}</h1>
                        </div>
                    </div>

                    <div className={styles.foote}>
                        <div className={styles.departure}>
                            <h3 className={styles.h3f}>Departure</h3>
                            <p className={styles.pf}>{flight?.Segments?.[0]?.Departure_DateTime}</p>
                        </div>
                        <div className={styles.departure}>
                            <h3 className={styles.h3f}>Arrival</h3>
                            <p className={styles.pf}>{flight?.Segments?.[0]?.Arrival_DateTime}</p>
                        </div>
                    </div>
                </div>
                <div>
                    <div className={styles.additionalInfo}>
                        <h3>Fare Details</h3>
                        <p>Base Fare: {fares?.Basic_Amount} {fares?.Currency_Code}</p>
                        <p>Airport Taxes: {fares?.AirportTax_Amount}</p>
                        <p>Total Fare: {fares?.Total_Amount}</p>
                    </div>

                    <div className={styles.additionalInfo}>
                        <h3>Passenger Details</h3>
                        <p>Name {Fistname}&nbsp;{Lastname}</p>
                        <p>Mobile {PAX_Mobile}</p>
                        <p>EmailId {PAX_EmailId}</p>
                        {/* <p>Invoice_Number {Invoice_Number}</p> */}
                    </div>
                </div>
            </div>
            <button className={styles["ticket-btn"]} onClick={handleDownload}>
                Download Ticket
            </button>
        </>
    );
};

export default TicketComponent;
