import React from 'react';
import styles from './FlightPriceTable.module.css'

const FlightPriceTable = ({ priceDetails }) => {
    // Check if priceDetails has data
    if (!priceDetails || !Array.isArray(priceDetails) || priceDetails.length === 0) {
        return <div>No price details available.</div>;
    }

    return (
        <div>
            {priceDetails.map((priceDetail, index) => {
                const flight = priceDetail.Flight;

                return (
                    <div key={index} className="flight-detail">
                        <h4>Fare Details:</h4>
                        {flight.Fares.map((fare, fareIndex) => (
                            <div key={fareIndex} className={styles["flightfare"]}>
                                <p><strong>Basic Amount:</strong> {fare.FareDetails[0].Basic_Amount}</p>
                                <p><strong>Total Amount:</strong> {fare.FareDetails[0].Total_Amount}</p>
                                <p><strong>Currency:</strong> {fare.FareDetails[0].Currency_Code}</p>
                                <p><strong>Seats Available:</strong> {fare.Seats_Available}</p>
                                <h4>Price Breakdown:</h4>
                                <ul className={styles["taxes"]}>
                                    <li> <strong>Airport Tax Amount:</strong>  {fare.FareDetails[0].AirportTax_Amount}</li>
                                    {fare.FareDetails[0].AirportTaxes.map((tax, taxIndex) => (
                                        <li key={taxIndex}>
                                            <strong>{tax.Tax_Desc}:</strong>
                                             {tax.Tax_Amount}
                                        </li>
                                    ))}
                                </ul>
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