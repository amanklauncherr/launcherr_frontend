import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './bookingform.module.css';

const BookingForm = () => {
  const [departureDate, setDepartureDate] = useState(null);
  const [gender, setGender] = useState('');

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.signInNotice}>Sign in for faster booking!</span>
        <button className={styles.signInButton}>Sign in</button>
      </div>

      <div className={styles.bookingInfo}>
        <div className={styles.flightInfo}>
          <h2>New Delhi and NCR → Mumbai</h2>
          <p>11 Aug · 8 Passengers · Economy</p>
          <div className={styles.flightDetails}>
            <p>IndiGo</p>
            <p>New Delhi and NCR (DEL) → Mumbai (BOM)</p>
            <p>11 Aug · 03:35 - 05:40 · 2h 5m</p>
            <a href="#">Details</a>
            <a href="#">Baggage Allowance & Policies</a>
            <a href="#">Airline baggage fee information</a>
          </div>
        </div>

        <div className={styles.priceBreakdown}>
          <h3>Price breakdown</h3>
          <div className={styles.priceItem}>
            <p>Adult</p>
            <p>Rs. 3,946.76 x 4</p>
          </div>
          <div className={styles.priceItem}>
            <p>Base fare</p>
            <p>Rs. 3,190.02</p>
          </div>
          <div className={styles.priceItem}>
            <p>Taxes and fees</p>
            <p>Rs. 756.74</p>
          </div>
          <div className={styles.priceItem}>
            <p>Infant</p>
            <p>Rs. 1,540.51 x 4</p>
          </div>
          <div className={styles.priceItem}>
            <p>Base fare</p>
            <p>Rs. 1,500.01</p>
          </div>
          <div className={styles.priceItem}>
            <p>Taxes and fees</p>
            <p>Rs. 40.50</p>
          </div>
          <div className={styles.priceItem}>
            <p>Discount</p>
            <p>-Rs. 0.04</p>
          </div>
          <div className={styles.priceItem}>
            <p>Processing fee</p>
            <p>FREE</p>
          </div>
          <div className={styles.total}>
            <p>Total</p>
            <p>Rs. 21,949.04</p>
          </div>
        </div>
      </div>

      <form className={styles.form}>
        <h3>Contact details</h3>
        <div className={styles.formGroup}>
          <input type="text" placeholder="First name" />
          <input type="text" placeholder="Last name" />
        </div>
        <div className={styles.formGroup}>
          <select>
            <option value="">Country code</option>
            <option value="+91">+91</option>
            <option value="+1">+1</option>
          </select>
          <input type="text" placeholder="Mobile number" />
        </div>
        <div className={styles.formGroup}>
          <input type="email" placeholder="Email" />
        </div>

        <h3>Passenger 1: Adult</h3>
        <p>Please be careful - Passenger details must match your passport or photo ID.</p>
        <div className={styles.gender}>
          <label>
            <input
              type="radio"
              value="male"
              checked={gender === 'male'}
              onChange={() => setGender('male')}
            />
            Male
          </label>
          <label>
            <input
              type="radio"
              value="female"
              checked={gender === 'female'}
              onChange={() => setGender('female')}
            />
            Female
          </label>
        </div>
        <div className={styles.formGroup}>
          <input type="text" placeholder="First and middle name" />
          <input type="text" placeholder="Last name" />
        </div>
        <div className={styles.formGroup}>
          <DatePicker
            selected={departureDate}
            onChange={(date) => setDepartureDate(date)}
            placeholderText="Date of birth"
          />
          <select>
            <option value="">Nationality</option>
            <option value="India">India</option>
            <option value="USA">USA</option>
          </select>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;
