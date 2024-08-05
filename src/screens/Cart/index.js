import CartEmpty from '@/components/CartEmpty';
import Cross from '@/components/Icons/Cross';
import ImageLayout from '@/components/ImageLayout';
import MainLayout from '@/components/MainLayout';
import { getCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Loader from '@/components/Loader'; // Import your Loader component

const Cart = () => {
  const router = useRouter();
  const reduxToken = useSelector((state) => state?.token?.publicToken);
  const [cartItems, setCartItems] = useState([]);
  const [subTotal, setSubTotal] = useState(0);
  const [gstAmt, setGstAmt] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [isRemoving, setIsRemoving] = useState(false); // Track removal state

  useEffect(() => {
    const fetchCartData = async () => {
      const updateCartUrl = 'https://api.launcherr.co/api/showCart';
      let bearerToken = '';
      const cookiesToken = getCookie('auth_token');
      
      if (cookiesToken) {
        bearerToken = cookiesToken;
      } else {
        bearerToken = reduxToken;
      }
      
      try {
        const response = await fetch(updateCartUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${bearerToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch cart data');
        }

        const cartData = await response.json();
        const { products, subTotal, gstAmt, grand_Total: grandTotal } = cartData;

        setCartItems(products);
        setSubTotal(subTotal);
        setGstAmt(gstAmt);
        setGrandTotal(grandTotal);
      } catch (error) {
        console.error('Error fetching cart data:', error);
        setCartItems([]);
        setSubTotal(0);
        setGstAmt(0);
        setGrandTotal(0);
      }
    };

    fetchCartData();
  }, [reduxToken]);

  const handleCheckout = () => {
    router.push('/checkout');
  }

  const handleUpdateCart = async (updatedCartItems) => {
    const updateCartUrl = 'https://api.launcherr.co/api/showCart';
    let bearerToken = '';
    const cookiesToken = getCookie('auth_token');
    
    if (cookiesToken) {
      bearerToken = cookiesToken;
    } else {
      bearerToken = reduxToken;
    }

    try {
      const response = await fetch(updateCartUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${bearerToken}`,
        },
        body: JSON.stringify({
          products: updatedCartItems
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update cart');
      }

      const updatedCartData = await response.json();
      const { products, subTotal, gstAmt, grand_Total: grandTotal } = updatedCartData;

      setCartItems(products);
      setSubTotal(subTotal);
      setGstAmt(gstAmt);
      setGrandTotal(grandTotal);

      console.log('Cart updated successfully');
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  }

  const handleRemoveItem = async (index) => {
    setIsRemoving(true);
    const updatedCartItems = [...cartItems];
    updatedCartItems[index] = {
      ...updatedCartItems[index],
      quantity: 0,
      subTotal: 0,
    };
    setCartItems(updatedCartItems);

    try {
      await handleUpdateCart(updatedCartItems);
    } catch (error) {
      console.error('Error removing item:', error);
    } finally {
      setIsRemoving(false); 
    }
  }

  return (
    <>
      <MainLayout>
        <ImageLayout Img_url='/images/gigsimg.png' heading='Cart' />
        {isRemoving ? (
          <div className="full-page-loader">
            <Loader /> 
          </div>
        ) : cartItems.length === 0 ? (
          <CartEmpty />
        ) : (
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
                    {cartItems.map((item, index) => (
                      <tr key={index}>
                        <td className="" onClick={() => handleRemoveItem(index)}>
                          {isRemoving ? <Loader /> : <Cross />}
                        </td>
                        <td data-column="Product Name">{item?.product_name}</td>
                        <td data-column="Price">₹ {item?.price}</td>
                        <td data-column="Quantity" className="count-input">
                          <div>
                            <input 
                              type="number" 
                              value={item?.quantity || ''}
                              onChange={(e) => {
                                const newQuantity = parseInt(e.target.value, 10) || 0;
                                const updatedCartItems = [...cartItems];
                                updatedCartItems[index] = {
                                  ...item,
                                  quantity: newQuantity,
                                  subTotal: newQuantity * (item.single_price || 0)
                                };
                                setCartItems(updatedCartItems);
                                handleUpdateCart(updatedCartItems);
                              }}
                            />
                          </div>
                        </td>
                        <td data-column="Sub Total">₹ {item?.sub_total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="totalAmountArea">
                <table>
                  <tbody>
                    <tr>
                      <td>Sub Total</td>
                      <td>₹ {subTotal?.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td>GST</td>
                      <td>₹ {gstAmt?.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td>Grand Total</td>
                      <td>₹ {grandTotal?.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div onClick={handleCheckout} className="checkBtnArea text-right">
                <button type="button" className="btn-primary">Checkout</button>
              </div>
            </form>
          </div>
        )}
      </MainLayout>
      <style jsx>{`
        .full-page-loader {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          background: rgba(255, 255, 255, 0.8); /* Semi-transparent background */
          z-index: 1000; /* Make sure it appears above other content */
        }
      `}</style>
    </>
  )
}

export default Cart;
