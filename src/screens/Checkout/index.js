import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { getCookie } from 'cookies-next';
import styles from './CheckoutPage.module.css';

const CheckoutForm = () => {
  const reduxToken = useSelector((state) => state?.auth?.token);
  const [cartData, setCartData] = useState(null);
  const [paymentTotalAmout, setPaymentTotalAmount] = useState('');
  const [isSameAsBilling, setIsSameAsBilling] = useState(false);
  const [orderIdMain, setOrderId] = useState();
 
  const userdata = JSON.parse(localStorage.getItem('launcherr_UserProfileData'));
  const billingDetails = {
    firstName: userdata.user.name,
    lastName: userdata.user.last_name,
    address1: userdata.userprofile.user_Address,
    address2: userdata.userprofile.fbd,
    city: userdata.userprofile.user_City,
    state: userdata.userprofile.user_State,
    postcode: userdata.userprofile.user_PinCode,
    email: userdata.user.email,
    phone: userdata.userprofile.user_Number,
  };

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
      const bearerToken = getCookie('auth_token') || reduxToken;
      const headers = { Authorization: `Bearer ${bearerToken}` };

      try {
        const response = await axios.post('https://api.launcherr.co/api/showCart', {}, { headers });
        setCartData(response.data);
        setPaymentTotalAmount(response.data.subTotal);
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

  const handleCheckboxChange = () => {
    setIsSameAsBilling(!isSameAsBilling);

    if (!isSameAsBilling) {
      setShippingDetails({
        ...billingDetails,
      });
    } else {
      setShippingDetails({
        firstName: '',
        lastName: '',
        address1: '',
        address2: '',
        city: '',
        state: '',
        postcode: '',
        phone: '',
      });
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

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
        const headers = { Authorization: `Bearer ${getCookie('auth_token') || reduxToken}` };
        const orderResponse = await axios.post('https://api.launcherr.co/api/OrderID', payload, { headers });
        setIsLoading(false);
        // console.log('orderid', orderResponse.data.order.OrderID)
        // setOrderId(orderResponse.data.order.OrderID)
        const TotalPrice = cartData?.subTotal;
        window.location.href = `https://shubhangverma.com/phonepe.php?amount=${TotalPrice}&orderId=${orderResponse.data.order.OrderID}`;

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
        <h2 className={styles.formTitle}>Shipping Details</h2>
        <div className={styles.checkboxContainer}>
          <label>
            <input
              type="checkbox"
              checked={isSameAsBilling}
              onChange={handleCheckboxChange}
            />
            Shipping address is the same as billing address
          </label>
        </div>
        <div className={styles.gridContainer}>
          <div className={styles.gridItem}>
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              value={shippingDetails.firstName}
              onChange={(e) => handleInputChange(e, setShippingDetails)}
            />
          </div>
          <div className={styles.gridItem}>
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={shippingDetails.lastName}
              onChange={(e) => handleInputChange(e, setShippingDetails)}
            />
          </div>
          <div className={styles.gridItem}>
            <label>Address 1</label>
            <input
              type="text"
              name="address1"
              value={shippingDetails.address1}
              onChange={(e) => handleInputChange(e, setShippingDetails)}
            />
          </div>
          <div className={styles.gridItem}>
            <label>Address 2</label>
            <input
              type="text"
              name="address2"
              value={shippingDetails.address2}
              onChange={(e) => handleInputChange(e, setShippingDetails)}
            />
          </div>
          <div className={styles.gridItem}>
            <label>City</label>
            <input
              type="text"
              name="city"
              value={shippingDetails.city}
              onChange={(e) => handleInputChange(e, setShippingDetails)}
            />
          </div>
          <div className={styles.gridItem}>
            <label>State</label>
            <input
              type="text"
              name="state"
              value={shippingDetails.state}
              onChange={(e) => handleInputChange(e, setShippingDetails)}
            />
          </div>
          <div className={styles.gridItem}>
            <label>Postcode</label>
            <input
              type="text"
              name="postcode"
              value={shippingDetails.postcode}
              onChange={(e) => handleInputChange(e, setShippingDetails)}
            />
          </div>
          <div className={styles.gridItem}>
            <label>Phone</label>
            <input
              type="text"
              name="phone"
              value={shippingDetails.phone}
              onChange={(e) => handleInputChange(e, setShippingDetails)}
            />
          </div>
        </div>
        <button type="submit" className="book-btn-primary" disabled={isLoading}>
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
