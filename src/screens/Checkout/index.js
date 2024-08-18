import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import styles from './CheckoutPage.module.css';
import { getCookie } from 'cookies-next';

const CheckoutForm = () => {
  const reduxToken = useSelector((state) => state?.auth?.token);
  const [cartData, setCartData] = useState(null); // State to store fetched cart data

  useEffect(() => {
    const fetchCartData = async () => {
      let bearerToken = '';
      const cookiesToken = getCookie('auth_token');
      if (cookiesToken) {
        bearerToken = cookiesToken;
      } else {
        bearerToken = reduxToken;
      }

      const headers = {
        Authorization: `Bearer ${bearerToken}`,
      };

      try {
        const response = await axios.post('https://api.launcherr.co/api/showCart', {}, { headers });
        setCartData(response.data);
        console.log('Cart data:', response.data);
      } catch (error) {
        console.error('Error fetching cart data:', error);
      }
    };

    fetchCartData();
  }, [reduxToken]);

  const handlePopup = (e) => {
    e.preventDefault();
    if (cartData) {
      const grandTotal = cartData.grand_Total;
      window.location.href = `https://shubhangverma.com/phonepe.php?amount=${grandTotal}`;
    } else {
      alert(`Oh no! The Payment Gateway isn't approved yet! 🙁`);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form}>
        <h3>Please enter your details</h3>
        <label>Email address</label>
        <input type="email" className={styles.input} required />
        <label>Address</label>
        <input type="text" className={styles.input} required />
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
          <input type="checkbox" className={styles.checkbox} required /> 
          <a href='https://launcherr.co/TermsConditions.html' target='_blank'>Terms & Conditions</a> | <a href="https://launcherr.co/PrivacyPolicy.html" target='_blank'>Privacy Policy</a>
        </div>
        <button onClick={handlePopup} className='book-btn-primary'>Continue</button>
      </form>

      {cartData && (
        <div className={styles.itemsTable}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Product name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Sub Total</th>
              </tr>
            </thead>
            <tbody>
              {cartData.products.map((product) => (
                <tr key={product.id}>
                  <td>{product.product_name}</td>
                  <td>{product.price / product.quantity}</td>
                  <td>{product.quantity}</td>
                  <td>{product.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={styles.totals}>
            <div className={styles.totalRow}>
              <span>Total</span>
              <span>₹ {cartData.subTotal}</span>
            </div>
            {/* <div className={styles.totalRow}>
              <span>Taxes</span>
              <span>₹ {cartData.gstAmt}</span>
            </div>
            <div className={styles.totalRow}>
              <strong>Grand Total</strong>
              <strong>₹ {cartData.grand_Total}</strong>
            </div> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutForm;
