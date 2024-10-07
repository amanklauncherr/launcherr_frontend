import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { getCookie } from 'cookies-next';
import styles from './CheckoutPage.module.css';

const CheckoutForm = () => {
  const reduxToken = useSelector((state) => state?.auth?.token);
  const [cartData, setCartData] = useState(null);
  const [paymentTotalAmout, setPaymentTotalAmount] = useState('')
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
  const [isLoading, setIsLoading] = useState(false);

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
        console.log('Cart data:', response.data.subTotal);
        setPaymentTotalAmount(response.data.subTotal)
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
    setIsLoading(true);

    // Basic validation for billing details
    if (!billingDetails.firstName || !billingDetails.lastName || !billingDetails.address1 || !billingDetails.city || !billingDetails.postcode || !billingDetails.email || !billingDetails.phone) {
      alert('Please fill out all required billing details.');
      setIsLoading(false);
      return;
    }

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
        setIsLoading(false);

        if (orderResponse.data) {
          // const grandTotal = cartData.grand_Total;
          const TotalPrice = cartData?.subTotal
          console.log("TotalPrice", TotalPrice)
          window.location.href = `https://shubhangverma.com/phonepe.php?amount=${TotalPrice}`;
        }
      } catch (error) {
        setIsLoading(false);
        console.error('Error processing order:', error);
        alert('There was an error processing your order. Please try again.');
      }
    } else {
      setIsLoading(false);
      alert(`Oh no! The Payment Gateway isn't approved yet! 🙁`);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleFormSubmit}>
        <h2 className={styles.formTitle}>Billing Details</h2>
        <div className={styles.gridContainer}>
          <div className={styles.gridItem}>
            <label htmlFor="billingFirstName">First Name *</label>
            <input
              type="text"
              id="billingFirstName"
              name="firstName"
              value={billingDetails.firstName}
              onChange={(e) => handleInputChange(e, setBillingDetails)}
              required
            />
          </div>
          <div className={styles.gridItem}>
            <label htmlFor="billingLastName">Last Name *</label>
            <input
              type="text"
              id="billingLastName"
              name="lastName"
              value={billingDetails.lastName}
              onChange={(e) => handleInputChange(e, setBillingDetails)}
              required
            />
          </div>
        </div>

        <div className={styles.gridContainer}>
          <div className={styles.gridItem}>
            <label htmlFor="billingAddress1">Address 1 *</label>
            <input
              type="text"
              id="billingAddress1"
              name="address1"
              value={billingDetails.address1}
              onChange={(e) => handleInputChange(e, setBillingDetails)}
              required
            />
          </div>
          <div className={styles.gridItem}>
            <label htmlFor="billingAddress2">Address 2</label>
            <input
              type="text"
              id="billingAddress2"
              name="address2"
              value={billingDetails.address2}
              onChange={(e) => handleInputChange(e, setBillingDetails)}
            />
          </div>
        </div>

        <div className={styles.gridContainer}>
          <div className={styles.gridItem}>
            <label htmlFor="billingCity">City *</label>
            <input
              type="text"
              id="billingCity"
              name="city"
              value={billingDetails.city}
              onChange={(e) => handleInputChange(e, setBillingDetails)}
              required
            />
          </div>
          <div className={styles.gridItem}>
            <label htmlFor="billingState">State *</label>
            <input
              type="text"
              id="billingState"
              name="state"
              value={billingDetails.state}
              onChange={(e) => handleInputChange(e, setBillingDetails)}
              required
            />
          </div>
          <div className={styles.gridItem}>
            <label htmlFor="billingPostcode">Postcode *</label>
            <input
              type="text"
              id="billingPostcode"
              name="postcode"
              value={billingDetails.postcode}
              onChange={(e) => handleInputChange(e, setBillingDetails)}
              required
            />
          </div>
        </div>

        <div className={styles.gridContainer}>
          <div className={styles.gridItem}>
            <label htmlFor="billingEmail">Email *</label>
            <input
              type="email"
              id="billingEmail"
              name="email"
              value={billingDetails.email}
              onChange={(e) => handleInputChange(e, setBillingDetails)}
              required
            />
          </div>
          <div className={styles.gridItem}>
            <label htmlFor="billingPhone">Phone *</label>
            <input
              type="tel"
              id="billingPhone"
              name="phone"
              value={billingDetails.phone}
              onChange={(e) => handleInputChange(e, setBillingDetails)}
              required
            />
          </div>
        </div>

        <h2 className={styles.formTitle}>Shipping Details</h2>
        <div className={styles.gridContainer}>
          <div className={styles.gridItem}>
            <label htmlFor="shippingFirstName">First Name</label>
            <input
              type="text"
              id="shippingFirstName"
              name="firstName"
              value={shippingDetails.firstName}
              onChange={(e) => handleInputChange(e, setShippingDetails)}
            />
          </div>
          <div className={styles.gridItem}>
            <label htmlFor="shippingLastName">Last Name</label>
            <input
              type="text"
              id="shippingLastName"
              name="lastName"
              value={shippingDetails.lastName}
              onChange={(e) => handleInputChange(e, setShippingDetails)}
            />
          </div>
        </div>

        <div className={styles.gridContainer}>
          <div className={styles.gridItem}>
            <label htmlFor="shippingAddress1">Address 1</label>
            <input
              type="text"
              id="shippingAddress1"
              name="address1"
              value={shippingDetails.address1}
              onChange={(e) => handleInputChange(e, setShippingDetails)}
            />
          </div>
          <div className={styles.gridItem}>
            <label htmlFor="shippingAddress2">Address 2</label>
            <input
              type="text"
              id="shippingAddress2"
              name="address2"
              value={shippingDetails.address2}
              onChange={(e) => handleInputChange(e, setShippingDetails)}
            />
          </div>
        </div>

        <div className={styles.gridContainer}>
          <div className={styles.gridItem}>
            <label htmlFor="shippingCity">City</label>
            <input
              type="text"
              id="shippingCity"
              name="city"
              value={shippingDetails.city}
              onChange={(e) => handleInputChange(e, setShippingDetails)}
            />
          </div>
          <div className={styles.gridItem}>
            <label htmlFor="shippingState">State</label>
            <input
              type="text"
              id="shippingState"
              name="state"
              value={shippingDetails.state}
              onChange={(e) => handleInputChange(e, setShippingDetails)}
            />
          </div>
          <div className={styles.gridItem}>
            <label htmlFor="shippingPostcode">Postcode</label>
            <input
              type="text"
              id="shippingPostcode"
              name="postcode"
              value={shippingDetails.postcode}
              onChange={(e) => handleInputChange(e, setShippingDetails)}
            />
          </div>
        </div>

        <div className={styles.gridContainer}>
          <div className={styles.gridItem}>
            <label htmlFor="shippingPhone">Phone</label>
            <input
              type="tel"
              id="shippingPhone"
              name="phone"
              value={shippingDetails.phone}
              onChange={(e) => handleInputChange(e, setShippingDetails)}
            />
          </div>
        </div>

        <button type="submit" className="book-btn-primary" style={{width:"100%"}} disabled={isLoading}>
          {isLoading ? 'Processing...' : 'Place Order'}
        </button>
      </form>
      {cartData && (
        <div className={styles.cartSummary}>
          <h2>Cart Summary</h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {cartData.products.map((product) => (
                <tr key={product.id}>
                  <td>{product.product_name}</td>
                  <td>₹{product.price}</td>
                  <td>{product.quantity}</td>
                  <td>₹{product.sub_total}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3"><b>Total:</b></td>
                <td><b>₹{cartData.subTotal}</b></td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
};

export default CheckoutForm;
