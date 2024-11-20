import React, { useEffect, useState } from 'react';
import styles from './FlightPriceTable.module.css'
import ModalPopup from '@/components/ModalPopup';
import anim from './anim.json';

const FlightPriceTable = ({ repriceError, priceDetailsNew }) => {
    const [isModalOpen, setModalOpen] = useState(false);


    useEffect(()=> {
        console.log("repriceerrorinner",repriceError?.response?.data?.error?.status)
        if (repriceError?.response?.data?.error?.status === false) {
            setModalOpen(true)
        }
    },[]);
    
    // Check if priceDetails has data
    const priceDetails = priceDetailsNew?.data?.data?.payloads?.data?.rePrice
    if (!priceDetails || !Array.isArray(priceDetails) || priceDetails.length === 0) {
        return <div>No price details available.</div>;
    }

    const handleCloseModal = () => {
        localStorage.removeItem('flightFilter');
        setModalOpen(false);
        window.location.href = "/flights";
    };

 


    return (
        <div>
            {priceDetails?.map((priceDetail, index) => {
                const flight = priceDetail?.Flight;

                return (
                    <div key={index} className="flight-detail">
                        {flight?.Fares?.map((fare, fareIndex) => (
                            <p key={fareIndex} className={styles["avialable-setas-bg"]}>
                                <strong>Seats Available:</strong> {fare?.Seats_Available}
                            </p>
                        ))}
                        <div>

                            <h4 className={styles["flight-details-heading"]}>Fare Details <br /> <span>(Including Taxes & Fees)</span>
                            </h4>
                        </div>
                        {flight?.Fares?.map((fare, fareIndex) => (
                            <div key={fareIndex} className={styles["flightfare"]}>

                                {/* <p>
                                    <strong>Basic Amount:</strong>{fare.FareDetails[0].Currency_Code === 'INR' ? '₹' : fare.FareDetails[0].Currency_Code} {parseFloat(fare.FareDetails[0].Basic_Amount) + parseFloat(fare.FareDetails[0].Trade_Markup_Amount)}
                                </p> */}
                                <p>
                                    <strong>Adult Amount:</strong> {fare?.FareDetails[0]?.Currency_Code === 'INR' ? '₹' : fare?.FareDetails[0]?.Currency_Code} {priceDetailsNew?.data?.adultAmount}
                                </p>
                                <p>
                                    <strong>Child Amount </strong> {fare?.FareDetails[0]?.Currency_Code === 'INR' ? '₹' : fare?.FareDetails[0]?.Currency_Code} {priceDetailsNew?.data?.childAmount}
                                </p>
                                <p>
                                    <strong>Infant Amount</strong>  {fare?.FareDetails[0]?.Currency_Code === 'INR' ? '₹' : fare?.FareDetails[0]?.Currency_Code} {priceDetailsNew?.data?.infantAmount}
                                </p>

                                <p className={styles["totalamount"]}>
                                    <strong>Total Amount:</strong> {fare?.FareDetails[0]?.Currency_Code === 'INR' ? '₹' : fare?.FareDetails[0]?.Currency_Code} {priceDetailsNew?.data?.launcherAmount
                                    }
                                </p>
                                <p className={styles["airporttaxes"]}>
                                    {/* <strong>AirportTaxes</strong>{fare.FareDetails[0].Currency_Code === 'INR' ? '₹' : fare.FareDetails[0].Currency_Code} {priceDetailsNew?.data?.airportTaxes} */}
                                </p>
                                {/* <p>
                                    <strong>Service Fee:</strong> {fare.FareDetails[0].Currency_Code === 'INR' ? '₹' : fare.FareDetails[0].Currency_Code} {fare.FareDetails[0].Service_Fee_Amount}
                                </p>
                                <p>
                                    <strong>Airport Tax Amount:</strong> {fare.FareDetails[0].Currency_Code === 'INR' ? '₹' : fare.FareDetails[0].Currency_Code} {fare.FareDetails[0].AirportTax_Amount}
                                </p> */}
                                <h4>Cancellation Charges:</h4>
                                <ul className={styles["taxes"]}>
                                    {fare.FareDetails[0]?.CancellationCharges?.map((charge, chargeIndex) => (
                                        <li key={chargeIndex}>
                                            From {charge?.DurationFrom} to {charge?.DurationTo} - Charge: ₹{charge?.Value}
                                        </li>
                                    ))}
                                </ul>
                                <h4>Free Baggage:</h4>
                                <p>Check-In: {fare?.FareDetails[0]?.Free_Baggage?.Check_In_Baggage}</p>
                                <p>Hand Baggage: {fare?.FareDetails[0]?.Free_Baggage?.Hand_Baggage}</p>
                            </div>
                        ))}
                    </div>
                );
            })}
            {isModalOpen && (
                <ModalPopup
                    Mainmessage="No Data Found"
                    onClick={handleCloseModal}
                    mylottiJson={anim}
                    Submessage="Please Refresh the page or search again"
                    btnName="Click here"
                />
            )}
        </div>
    );
};

export default FlightPriceTable;
