// components/CheckoutForm.js

import styles from './CheckoutPage.module.css';

const CheckoutForm = () => {
  return (
    <div className={styles.container}>
      <form className={styles.form}>
        <h3>Please enter your details</h3>
        {/* <p>We collect this information to help combat fraud, and to keep your payment secure.</p> */}
        <label>Email address</label>
        <input type="email" className={styles.input} required />
        <label>Address</label>
        <input type="email" className={styles.input} required />
        <label>State</label>
        <select className={styles.select}>
          <option>UTTAR PRADESH</option>
          {/* Add more options as needed */}
        </select>
        <label>City</label>
        <select className={styles.select}>
          <option>NOIDA</option>
          {/* Add more options as needed */}
        </select>
        <label>Pincode</label>
        <input type="text" className={styles.input} required />
        <div className={styles["checkbox-container"]}>
          <input type="checkbox" className={styles.checkbox} /> 
        <a href="#">Terms & Conditions</a> | <a href="#">Privacy Policy</a>
        </div>
      
        <button className='book-btn-primary '>Continue</button>
      </form>
      <div className={styles.itemsTable}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Product name</th>
              <th>Price name</th>
              <th>Quantity</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>AeroEdit Pro</td>
              <td>Monthly (per seat)</td>
              <td>10</td>
              <td>25048.00</td>
            </tr>
            <tr>
              <td>VIP support</td>
              <td>Monthly (recurring addon)</td>
              <td>1</td>
              <td>20873.36</td>
            </tr>
            <tr>
              <td>Custom domains</td>
              <td>One-time addon</td>
              <td>1</td>
              <td>16615.20</td>
            </tr>
          </tbody>
        </table>
        <div className={styles.totals}>
          <div className={styles.totalRow}>
            <span>One-time charges</span>
            <span>16615.20</span>
          </div>
          <div className={styles.totalRow}>
            <span>Recurring charges</span>
            <span>45921.36</span>
          </div>
          <div className={styles.totalRow}>
            <span>Discount</span>
            <span>0.00</span>
          </div>
          <div className={styles.totalRow}>
            <span>Taxes</span>
            <span>11256.58</span>
          </div>
          <div className={styles.totalRow}>
            <strong>Total today</strong>
            <strong>73793.14</strong>
          </div>
        </div>
        <button style={{maginTop:"20px"}} className='book-btn-primary '>Switch plan</button>
      </div>
    </div>
  );
};

export default CheckoutForm;
