import Cross from '@/components/Icons/Cross';
import ImageLayout from '@/components/ImageLayout';
import MainLayout from '@/components/MainLayout';
import { getCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const Cart = () => {
  const router = useRouter();
  const reduxToken = useSelector((state) => state?.token?.publicToken);
  const [cartItems, setCartItems] = useState([]);
  const [subTotal, setSubTotal] = useState(0);
  const [gstAmt, setGstAmt] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);

  useEffect(() => {
    const fetchCartData = async () => {
      const updateCartUrl = 'https://api.launcherr.co/api/showCart';
      let bearerToken = '';
      const cookiesToken = getCookie('auth_token');
      
      if (cookiesToken) {
        bearerToken = cookiesToken;
      } else {
        bearerToken = reduxToken; // Assuming reduxToken is accessible here
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

        // Update state with fetched data
        setCartItems(products);
        setSubTotal(subTotal);
        setGstAmt(gstAmt);
        setGrandTotal(grandTotal);
      } catch (error) {
        console.error('Error fetching cart data:', error);
        setCartItems([]); // Set cartItems to an empty array in case of error
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

  const handleUpdateCart = () => {
    const updateCartUrl = 'https://api.launcherr.co/api/showCart';

    let bearerToken = '';
    const cookiesToken = getCookie('auth_token');
    
    if (cookiesToken) {
      bearerToken = cookiesToken;
    } else {
      bearerToken = reduxToken; // Assuming reduxToken is accessible here
    }

    // Update cart item quantities before making the API call
    const updatedCartItems = cartItems.map(item => ({
      ...item,
      subTotal: item.quantity * (item.single_price || 0),
    }));

    fetch(updateCartUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${bearerToken}`,
      },
      body: JSON.stringify({
        products: updatedCartItems
      }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to update cart');
      }
      return response.json();
    })
    .then(updatedCartData => {
      const { products, subTotal, gstAmt, grand_Total: grandTotal } = updatedCartData;

      // Update state with updated data
      setCartItems(products);
      setSubTotal(subTotal);
      setGstAmt(gstAmt);
      setGrandTotal(grandTotal);

      console.log('Cart updated successfully');
    })
    .catch(error => {
      console.error('Error updating cart:', error);
    });
  }

  const handleRemoveItem = (index) => {
    const updatedCartItems = [...cartItems];
    updatedCartItems[index] = {
      ...updatedCartItems[index],
      quantity: 0,
      subTotal: 0,
    };
    setCartItems(updatedCartItems);
    handleUpdateCart();
  }

  return (
    <>
      <MainLayout>
        <ImageLayout Img_url='/images/gigsimg.png' heading='Cart'>
        </ImageLayout>
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
                        <Cross/>
                      </td>
                      <td data-column="Product Name">{item.product_name}</td>
                      <td data-column="Price">₹ {item.single_price}</td>
                      <td data-column="Quantity" className="count-input">
                        <div>
                          <input 
                            type="number" 
                            value={item.quantity || ''}
                            onChange={(e) => {
                              const newQuantity = parseInt(e.target.value, 10) || 0;
                              const updatedCartItems = [...cartItems];
                              updatedCartItems[index] = {
                                ...item,
                                quantity: newQuantity,
                                subTotal: newQuantity * (item.single_price || 0)
                              };
                              setCartItems(updatedCartItems);
                            }}
                          />
                        </div>
                      </td>
                      <td data-column="Sub Total">₹ {item.price ? item.price.toFixed(2) : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="updateArea">
              <button type="button" onClick={handleUpdateCart} className="book-btn-primary">Update Cart</button>
            </div>
            <div className="totalAmountArea">
              <table>
                <tbody>
                  <tr>
                    <td>Sub Total</td>
                    <td>₹ {subTotal.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>GST</td>
                    <td>₹ {gstAmt.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>Grand Total</td>
                    <td>₹ {grandTotal.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div onClick={handleCheckout} className="checkBtnArea text-right">
              <button type="button" className="btn-primary">Checkout</button>
            </div>
          </form>
        </div>
      </MainLayout>
    </>
  )
}

export default Cart;
