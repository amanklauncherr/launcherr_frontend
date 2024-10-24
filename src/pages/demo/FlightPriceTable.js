import React from 'react';
import styles from './FlightPriceTable.module.css'

const FlightPriceTable = ({ priceDetailsNew }) => {

    console.log("priceDetailsNew", priceDetailsNew)
    // Check if priceDetails has data
    const priceDetails = priceDetailsNew?.data?.data?.payloads?.data?.rePrice
    if (!priceDetails || !Array.isArray(priceDetails) || priceDetails.length === 0) {
        return <div>No price details available.</div>;
    }


    return (
        <div>
            {priceDetails.map((priceDetail, index) => {
                const flight = priceDetail.Flight;

                return (
                    <div key={index} className="flight-detail">
                        {flight.Fares.map((fare, fareIndex) => (
                            <p key={fareIndex} className={styles["avialable-setas-bg"]}>
                                <strong>Seats Available:</strong> {fare.Seats_Available}
                            </p>
                        ))}
                        <h4 className={styles["flight-details-heading"]}>Fare Details <br /> <span>(Including Taxes & Fees)</span></h4>
                        {flight.Fares.map((fare, fareIndex) => ( 
                            <div key={fareIndex} className={styles["flightfare"]}>
                                {/* <p>
                                    <strong>Basic Amount:</strong>{fare.FareDetails[0].Currency_Code === 'INR' ? '₹' : fare.FareDetails[0].Currency_Code} {parseFloat(fare.FareDetails[0].Basic_Amount) + parseFloat(fare.FareDetails[0].Trade_Markup_Amount)}
                                </p> */}
                                <p>
                                    <strong>Adult Amount:</strong> {fare.FareDetails[0].Currency_Code === 'INR' ? '₹' : fare.FareDetails[0].Currency_Code} {priceDetailsNew?.data?.adultAmount} 
                                </p>
                                <p>
                                  <strong>Child Amount </strong> {fare.FareDetails[0].Currency_Code === 'INR' ? '₹' : fare.FareDetails[0].Currency_Code} {priceDetailsNew?.data?.childAmount} 
                                </p>
                                <p>
                                    <strong>Infant Amount</strong>  {fare.FareDetails[0].Currency_Code === 'INR' ? '₹' : fare.FareDetails[0].Currency_Code} {priceDetailsNew?.data?.infantAmount} 
                                </p>
                          
                                <p className={styles["totalamount"]}>
                                    <strong>Total Amount:</strong> {fare.FareDetails[0].Currency_Code === 'INR' ? '₹' : fare.FareDetails[0].Currency_Code} {priceDetailsNew?.data?.totalAmount
                                    } 
                                </p>
                                {/* <p>
                                    <strong>Service Fee:</strong> {fare.FareDetails[0].Currency_Code === 'INR' ? '₹' : fare.FareDetails[0].Currency_Code} {fare.FareDetails[0].Service_Fee_Amount}
                                </p>
                                <p>
                                    <strong>Airport Tax Amount:</strong> {fare.FareDetails[0].Currency_Code === 'INR' ? '₹' : fare.FareDetails[0].Currency_Code} {fare.FareDetails[0].AirportTax_Amount}
                                </p> */}
                                <h4>Cancellation Charges:</h4>
                                <ul className={styles["taxes"]}>
                                    {fare.FareDetails[0].CancellationCharges.map((charge, chargeIndex) => (
                                        <li key={chargeIndex}>
                                            From {charge.DurationFrom} to {charge.DurationTo} - Charge: {charge.Value}
                                        </li>
                                    ))}
                                </ul>
                                <h4>Free Baggage:</h4>
                                <p>Check-In: {fare.FareDetails[0].Free_Baggage.Check_In_Baggage}</p>
                                <p>Hand Baggage: {fare.FareDetails[0].Free_Baggage.Hand_Baggage}</p>
                            </div>
                        ))}
                    </div>
                );
            })}
        </div>
    );
};

export default FlightPriceTable;
