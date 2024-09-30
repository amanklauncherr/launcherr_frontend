import React from 'react';
import styles from './SeatMap.module.css'; // Assuming you're using CSS Modules for styling

const index = () => {


    const seats = [
        {
            "available": "true",
            "baseFare": "8.00",
            "column": "0",
            "doubleBirth": "false",
            "fare": "8.40",
            "ladiesSeat": "false",
            "length": "2",
            "malesSeat": "false",
            "markupFareAbsolute": "0.00",
            "markupFarePercentage": "0",
            "name": "1",
            "operatorServiceChargeAbsolute": "0.00",
            "operatorServiceChargePercent": "0.00",
            "reservedForSocialDistancing": "false",
            "row": "0",
            "serviceTaxAbsolute": "0.40",
            "serviceTaxPercentage": "5",
            "width": "1",
            "zIndex": "0"
        },
        {
            "available": "true",
            "baseFare": "10.00",
            "column": "2",
            "doubleBirth": "false",
            "fare": "10.50",
            "ladiesSeat": "false",
            "length": "2",
            "malesSeat": "false",
            "markupFareAbsolute": "0.00",
            "markupFarePercentage": "0",
            "name": "2",
            "operatorServiceChargeAbsolute": "0.00",
            "operatorServiceChargePercent": "0.00",
            "reservedForSocialDistancing": "false",
            "row": "0",
            "serviceTaxAbsolute": "0.50",
            "serviceTaxPercentage": "5",
            "width": "1",
            "zIndex": "0"
        },
        {
            "available": "true",
            "baseFare": "10.00",
            "column": "4",
            "doubleBirth": "false",
            "fare": "10.50",
            "ladiesSeat": "false",
            "length": "2",
            "malesSeat": "false",
            "markupFareAbsolute": "0.00",
            "markupFarePercentage": "0",
            "name": "3",
            "operatorServiceChargeAbsolute": "0.00",
            "operatorServiceChargePercent": "0.00",
            "reservedForSocialDistancing": "false",
            "row": "0",
            "serviceTaxAbsolute": "0.50",
            "serviceTaxPercentage": "5",
            "width": "1",
            "zIndex": "0"
        },
        {
            "available": "true",
            "baseFare": "10.00",
            "column": "6",
            "doubleBirth": "false",
            "fare": "10.50",
            "ladiesSeat": "false",
            "length": "2",
            "malesSeat": "false",
            "markupFareAbsolute": "0.00",
            "markupFarePercentage": "0",
            "name": "4",
            "operatorServiceChargeAbsolute": "0.00",
            "operatorServiceChargePercent": "0.00",
            "reservedForSocialDistancing": "false",
            "row": "0",
            "serviceTaxAbsolute": "0.50",
            "serviceTaxPercentage": "5",
            "width": "1",
            "zIndex": "0"
        },
        {
            "available": "true",
            "baseFare": "10.00",
            "column": "8",
            "doubleBirth": "false",
            "fare": "10.50",
            "ladiesSeat": "false",
            "length": "2",
            "malesSeat": "false",
            "markupFareAbsolute": "0.00",
            "markupFarePercentage": "0",
            "name": "5",
            "operatorServiceChargeAbsolute": "0.00",
            "operatorServiceChargePercent": "0.00",
            "reservedForSocialDistancing": "false",
            "row": "0",
            "serviceTaxAbsolute": "0.50",
            "serviceTaxPercentage": "5",
            "width": "1",
            "zIndex": "0"
        },
        {
            "available": "false",
            "baseFare": "10.00",
            "column": "10",
            "doubleBirth": "false",
            "fare": "10.50",
            "ladiesSeat": "false",
            "length": "2",
            "malesSeat": "false",
            "markupFareAbsolute": "0.00",
            "markupFarePercentage": "0",
            "name": "6",
            "operatorServiceChargeAbsolute": "0.00",
            "operatorServiceChargePercent": "0.00",
            "reservedForSocialDistancing": "false",
            "row": "0",
            "serviceTaxAbsolute": "0.50",
            "serviceTaxPercentage": "5",
            "width": "1",
            "zIndex": "0"
        },
        {
            "available": "true",
            "baseFare": "10.00",
            "column": "12",
            "doubleBirth": "false",
            "fare": "10.50",
            "ladiesSeat": "false",
            "length": "2",
            "malesSeat": "false",
            "markupFareAbsolute": "0.00",
            "markupFarePercentage": "0",
            "name": "7",
            "operatorServiceChargeAbsolute": "0.00",
            "operatorServiceChargePercent": "0.00",
            "reservedForSocialDistancing": "false",
            "row": "0",
            "serviceTaxAbsolute": "0.50",
            "serviceTaxPercentage": "5",
            "width": "1",
            "zIndex": "0"
        },
        {
            "available": "false",
            "baseFare": "8.00",
            "column": "0",
            "doubleBirth": "false",
            "fare": "8.40",
            "ladiesSeat": "true",
            "length": "2",
            "malesSeat": "false",
            "markupFareAbsolute": "0.00",
            "markupFarePercentage": "0",
            "name": "8",
            "operatorServiceChargeAbsolute": "0.00",
            "operatorServiceChargePercent": "0.00",
            "reservedForSocialDistancing": "false",
            "row": "2",
            "serviceTaxAbsolute": "0.40",
            "serviceTaxPercentage": "5",
            "width": "1",
            "zIndex": "0"
        },
        {
            "available": "true",
            "baseFare": "8.00",
            "column": "0",
            "doubleBirth": "false",
            "fare": "8.40",
            "ladiesSeat": "false",
            "length": "2",
            "malesSeat": "false",
            "markupFareAbsolute": "0.00",
            "markupFarePercentage": "0",
            "name": "a",
            "operatorServiceChargeAbsolute": "0.00",
            "operatorServiceChargePercent": "0.00",
            "reservedForSocialDistancing": "false",
            "row": "0",
            "serviceTaxAbsolute": "0.40",
            "serviceTaxPercentage": "5",
            "width": "1",
            "zIndex": "1"
        },
        {
            "available": "true",
            "baseFare": "8.00",
            "column": "2",
            "doubleBirth": "false",
            "fare": "8.40",
            "ladiesSeat": "false",
            "length": "2",
            "malesSeat": "false",
            "markupFareAbsolute": "0.00",
            "markupFarePercentage": "0",
            "name": "b",
            "operatorServiceChargeAbsolute": "0.00",
            "operatorServiceChargePercent": "0.00",
            "reservedForSocialDistancing": "false",
            "row": "0",
            "serviceTaxAbsolute": "0.40",
            "serviceTaxPercentage": "5",
            "width": "1",
            "zIndex": "1"
        },
        {
            "available": "true",
            "baseFare": "8.00",
            "column": "4",
            "doubleBirth": "false",
            "fare": "8.40",
            "ladiesSeat": "false",
            "length": "2",
            "malesSeat": "false",
            "markupFareAbsolute": "0.00",
            "markupFarePercentage": "0",
            "name": "c",
            "operatorServiceChargeAbsolute": "0.00",
            "operatorServiceChargePercent": "0.00",
            "reservedForSocialDistancing": "false",
            "row": "0",
            "serviceTaxAbsolute": "0.40",
            "serviceTaxPercentage": "5",
            "width": "1",
            "zIndex": "1"
        },
        {
            "available": "true",
            "baseFare": "8.00",
            "column": "6",
            "doubleBirth": "false",
            "fare": "8.40",
            "ladiesSeat": "false",
            "length": "2",
            "malesSeat": "false",
            "markupFareAbsolute": "0.00",
            "markupFarePercentage": "0",
            "name": "d",
            "operatorServiceChargeAbsolute": "0.00",
            "operatorServiceChargePercent": "0.00",
            "reservedForSocialDistancing": "false",
            "row": "0",
            "serviceTaxAbsolute": "0.40",
            "serviceTaxPercentage": "5",
            "width": "1",
            "zIndex": "1"
        },
        {
            "available": "true",
            "baseFare": "8.00",
            "column": "8",
            "doubleBirth": "false",
            "fare": "8.40",
            "ladiesSeat": "false",
            "length": "2",
            "malesSeat": "false",
            "markupFareAbsolute": "0.00",
            "markupFarePercentage": "0",
            "name": "e",
            "operatorServiceChargeAbsolute": "0.00",
            "operatorServiceChargePercent": "0.00",
            "reservedForSocialDistancing": "false",
            "row": "0",
            "serviceTaxAbsolute": "0.40",
            "serviceTaxPercentage": "5",
            "width": "1",
            "zIndex": "1"
        },
        {
            "available": "true",
            "baseFare": "8.00",
            "column": "10",
            "doubleBirth": "false",
            "fare": "8.40",
            "ladiesSeat": "false",
            "length": "2",
            "malesSeat": "false",
            "markupFareAbsolute": "0.00",
            "markupFarePercentage": "0",
            "name": "f",
            "operatorServiceChargeAbsolute": "0.00",
            "operatorServiceChargePercent": "0.00",
            "reservedForSocialDistancing": "false",
            "row": "0",
            "serviceTaxAbsolute": "0.40",
            "serviceTaxPercentage": "5",
            "width": "1",
            "zIndex": "1"
        },
        {
            "available": "true",
            "baseFare": "8.00",
            "column": "12",
            "doubleBirth": "false",
            "fare": "8.40",
            "ladiesSeat": "false",
            "length": "2",
            "malesSeat": "false",
            "markupFareAbsolute": "0.00",
            "markupFarePercentage": "0",
            "name": "g",
            "operatorServiceChargeAbsolute": "0.00",
            "operatorServiceChargePercent": "0.00",
            "reservedForSocialDistancing": "false",
            "row": "0",
            "serviceTaxAbsolute": "0.40",
            "serviceTaxPercentage": "5",
            "width": "1",
            "zIndex": "1"
        },
        {
            "available": "true",
            "baseFare": "10.00",
            "column": "2",
            "doubleBirth": "false",
            "fare": "10.50",
            "ladiesSeat": "false",
            "length": "2",
            "malesSeat": "false",
            "markupFareAbsolute": "0.00",
            "markupFarePercentage": "0",
            "name": "9",
            "operatorServiceChargeAbsolute": "0.00",
            "operatorServiceChargePercent": "0.00",
            "reservedForSocialDistancing": "false",
            "row": "2",
            "serviceTaxAbsolute": "0.50",
            "serviceTaxPercentage": "5",
            "width": "1",
            "zIndex": "0"
        },
    
    ]

  const numRows = Math.max(...seats.map(seat => parseInt(seat.row, 10))) + 1; // Calculate number of rows
  const numCols = Math.max(...seats.map(seat => parseInt(seat.column, 10))) + 1; // Calculate number of columns

  // Create a grid matrix with the seat data
  const seatMatrix = Array.from({ length: numRows }, () => Array(numCols).fill(null));

  // Place seats in the correct row and column in the matrix
  seats.forEach((seat) => {
    const row = parseInt(seat.row, 10);
    const col = parseInt(seat.column, 10);
    seatMatrix[row][col] = seat; // Store seat info in the matrix
  });

  return (
    <div className={styles.seatMapContainer}>
      {seatMatrix.map((row, rowIndex) => (
        <div key={rowIndex} className={styles.row}>
          {row.map((seat, colIndex) => (
            <div key={colIndex} className={styles.seat}>
              {seat ? (
                <button
                  className={seat.available === "true" ? styles.availableSeat : styles.unavailableSeat}
                  disabled={seat.available !== "true"}
                >
                  {seat.name}
                </button>
              ) : (
                <div className={styles.emptySeat} />
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default index;
