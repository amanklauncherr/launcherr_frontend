import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import styles from './CheckoutPage.module.css';
import { getCookie } from 'cookies-next';

const CheckoutForm = () => {
  const reduxToken = useSelector((state) => state?.auth?.token);
  const [cartData, setCartData] = useState(null);
  const [billingDetails, setBillingDetails] = useState({
    firstName: '',
    lastName: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    postcode: '',
    email: '',
    phone: '',
  });
  const [shippingDetails, setShippingDetails] = useState({
    firstName: '',
    lastName: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    postcode: '',
    phone: '',
  });

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

  const handleInputChange = (e, setDetails) => {
    const { name, value } = e.target;
    setDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (cartData) {
      const payload = {
        OrderDetails: {
          ...cartData,
          billing: billingDetails,
          shipping: shippingDetails,
        },
      };

      try {
        console.log('Payload:', payload);
        const headers = {
          Authorization: `Bearer ${getCookie('auth_token') || reduxToken}`,
        };

        // Sending the payload to the OrderID API
        const orderResponse = await axios.post('https://api.launcherr.co/api/OrderID', payload, { headers });
        console.log('Order ID response:', orderResponse.data);

        if (orderResponse.data) {
          const grandTotal = cartData.grand_Total;
           window.location.href = `https://shubhangverma.com/phonepe.php?amount=${grandTotal}`;
        }
      } catch (error) {
        console.error('Error processing order:', error);
        alert('There was an error processing your order. Please try again.');
      }
    } else {
      alert(`Oh no! The Payment Gateway isn't approved yet! 🙁`);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleFormSubmit}>
        {/* Form fields for billing and shipping details */}
        {/* ... */}

        <div className={styles['checkbox-container']}>
          <input type="checkbox" className={styles.checkbox} required />
          <a href='https://launcherr.co/TermsConditions.html' target='_blank'>Terms & Conditions</a> | <a href="https://launcherr.co/PrivacyPolicy.html" target='_blank'>Privacy Policy</a>
        </div>
        <button type="submit" className='book-btn-primary'>Continue</button>
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
                  <td>₹ {product.price / product.quantity}</td>
                  <td>{product.quantity}</td>
                  <td>₹ {product.sub_total}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={styles.totals}>
            <div className={styles.totalRow}>
              <span>Total</span>
              <span>₹ {cartData.subTotal}</span>
            </div>
            <div className={styles.totalRow}>
              <span>GST</span>
              <span>₹ {cartData.gstAmt}</span>
            </div>
            <div className={styles.totalRow}>
              <strong>Grand Total</strong>
              <strong>₹ {cartData.grand_Total}</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutForm;
