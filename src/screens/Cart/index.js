import ImageLayout from '@/components/ImageLayout';
import MainLayout from '@/components/MainLayout';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { getCookie } from 'cookies-next';
import styles from './cart.module.css'
import CartEmpty from '@/components/CartEmpty';

const Cart = () => {
  const router = useRouter();
  const [cartData, setCartData] = useState(null);
  const [products, setProducts] = useState([]);
  const [editableQuantities, setEditableQuantities] = useState({});

  const reduxToken = useSelector((state) => state?.auth?.token);

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
        setProducts(response.data.products);
        // Initialize editableQuantities state
        const initialEditableQuantities = {};
        response.data.products.forEach(product => {
          initialEditableQuantities[product.id] = product.quantity.toString();
        });
        setEditableQuantities(initialEditableQuantities);
        console.log('Cart data:', response.data);
      } catch (error) {
        console.error('Error fetching cart data:', error);
      }
    };

    fetchCartData();
  }, [reduxToken]);

  const handleCheckout = () => {
    router.push('/checkout');
  };

  // const handleUpdateCart = async () => {
  //   let bearerToken = '';
  //   const cookiesToken = getCookie('auth_token');
  //   if (cookiesToken) {
  //     bearerToken = cookiesToken;
  //   } else {
  //     bearerToken = reduxToken;
  //   };

  //   const headers = {
  //     Authorization: `Bearer ${bearerToken}`,
  //   };

  //   const payload = {
  //     products: products.map(product => ({
  //       product_id: product.id,
  //       quantity: product.quantity,
  //       price: product.price
  //     }))
  //   };

  //   console.log('Sending payload:', payload); // Log payload before sending

  //   try {
  //     const response = await axios.post('https://api.launcherr.co/api/updateCart', payload, { headers });
  //     setCartData(response.data);
  //     console.log('Updated cart data:', response.data);
  //   } catch (error) {
  //     console.error('Error updating cart data:', error);
  //   }
  // };


  const handleUpdateCart = () => {
    router.back();
  }

  const handleQuantityChange = (id, value) => {
    const updatedProducts = products.map(product =>
      product.id === id ? { ...product, quantity: parseInt(value, 10) } : product
    );
    setProducts(updatedProducts);
    console.log('Updated products:', updatedProducts); // Log updated products state
  };

  return (
    <>
      <MainLayout>
        <ImageLayout Img_url='/images/gigsimg.png' heading='Cart' />
        {products.length === 0 || !cartData ?(
           <CartEmpty/>
        ) : (
          <>
            <div className="cart-list-inner">
              <form action="#">
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th></th>
                        <th>Product Name</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Sub Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartData.products.map(product => (
                        <tr key={product.id}>
                          <td>
                            <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M1.64016 0.27L5.50016 4.13L9.34016 0.29C9.42498 0.199717 9.52716 0.127495 9.64058 0.0776622C9.75399 0.0278298 9.87629 0.00141434 10.0002 0C10.2654 0 10.5197 0.105357 10.7073 0.292893C10.8948 0.48043 11.0002 0.734784 11.0002 1C11.0025 1.1226 10.9797 1.24439 10.9333 1.35788C10.8869 1.47138 10.8178 1.57419 10.7302 1.66L6.84016 5.5L10.7302 9.39C10.895 9.55124 10.9916 9.76959 11.0002 10C11.0002 10.2652 10.8948 10.5196 10.7073 10.7071C10.5197 10.8946 10.2654 11 10.0002 11C9.87272 11.0053 9.74557 10.984 9.62678 10.9375C9.508 10.8911 9.40017 10.8204 9.31016 10.73L5.50016 6.87L1.65016 10.72C1.56567 10.8073 1.46473 10.8769 1.35316 10.925C1.2416 10.9731 1.12163 10.9986 1.00016 11C0.734946 11 0.480592 10.8946 0.293056 10.7071C0.10552 10.5196 0.000162707 10.2652 0.000162707 10C-0.00216879 9.8774 0.0205781 9.75561 0.0670076 9.64212C0.113437 9.52862 0.18257 9.42581 0.270163 9.34L4.16016 5.5L0.270163 1.61C0.105348 1.44876 0.00870232 1.23041 0.000162707 1C0.000162707 0.734784 0.10552 0.48043 0.293056 0.292893C0.480592 0.105357 0.734946 0 1.00016 0C1.24016 0.003 1.47016 0.1 1.64016 0.27Z" fill="black" />
                            </svg> &nbsp;&nbsp;
                            <span className="cartImage"></span>
                          </td>
                          <td data-column="Product Name">{product.product_name}</td>
                          <td data-column="Price">₹ {product.price / product.quantity}</td>
                          <td data-column="Quantity" className="count-input" >
                            <div >
                              <input
                                type="text"
                                value={editableQuantities[product.id]}
                                onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                                style={{ border: "0px", boxShadow: "none" }}
                              />
                            </div>
                          </td>
                          <td data-column="Sub Total">₹ {product.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="updateArea">
                  <div className="input-group">
                    {/* <input type="text" className="form-control" placeholder="I have a discount coupon" /> */}
                    {/* <a href="#" className="btn-primary">apply&nbsp;coupon</a> */}
                  </div>
                  <button type="button" onClick={handleUpdateCart} className="book-btn-primary">Edit cart</button>
                </div>
                <div className="totalAmountArea">
                  <table>
                    <tbody>
                      <tr>
                        <td>Sub Total</td>
                        <td>₹ {cartData.subTotal}</td>
                      </tr>
                      {/* <tr>
                    <td>Delivery</td>
                    <td>₹ {cartData.delivery}</td>
                  </tr> */}
                      <tr>
                        <td>GST</td>
                        <td>₹ {cartData.gstAmt}</td>
                      </tr>
                      <tr>
                        <td>Grand Total </td>
                        <td>₹ {cartData.grand_Total}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div onClick={handleCheckout} className="checkBtnArea text-right">
                  <a href="#" className="btn-primary">checkout</a>
                </div>
              </form>
            </div>
          </>)}

      </MainLayout>
    </>
  );
}

export default Cart;
