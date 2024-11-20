import React, { useState, useEffect } from 'react';
import styles from './payment.module.css';
import Lottie from 'react-lottie-player';
import lottieJson from './my-lottie.json';
import { useRouter } from 'next/router';
import axios from 'axios';
import Cookies from 'js-cookie';
import Loader from '@/components/Loader';

const PaymentSuccessProduct = () => {
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);
    const [loading, setLoading] = useState(true);
    const [orderDetails, setOrderDetails] = useState(null); // State to store order details
    const { orderId } = router.query;

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        const authToken = Cookies.get('auth_token');

        const fetchOrderDetails = async () => {
            try {
                if (!orderId) throw new Error('Order ID not available');

                // Fetch order details from the first API
                const response = await axios.post(
                    'https://api.launcherr.co/api/get/Order/Detail',
                    { OrderID: orderId },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${authToken}`,
                        },
                    }
                );

                const data = response.data;

                if (!data.success) throw new Error('Failed to fetch order details');

                setOrderDetails(data); // Set order details to state
                createWooCommerceOrder(orderDetails);
                return data;
            } catch (error) {
                console.error('Error fetching order details:', error.response?.data || error.message);
                throw error;
            }
        };

        const createWooCommerceOrder = async (orderData) => {
            try {
                // Prepare WooCommerce API payload
                const { billing, shipping, products, grand_Total } = orderData;

                const wooCommercePayload = {
                    payment_method: 'bacs',
                    payment_method_title: 'Direct Bank Transfer',
                    set_paid: true,
                    billing: {
                        first_name: billing.firstName,
                        last_name: billing.lastName,
                        address_1: billing.address1,
                        address_2: '',
                        city: billing.city,
                        state: billing.state,
                        postcode: billing.postcode,
                        country: 'IN', // Assuming India
                        email: billing.email,
                        phone: billing.phone,
                    },
                    shipping: {
                        first_name: shipping.firstName,
                        last_name: shipping.lastName,
                        address_1: shipping.address1,
                        address_2: '',
                        city: shipping.city,
                        state: shipping.state,
                        postcode: shipping.postcode,
                        country: 'IN', // Assuming India
                    },
                    line_items: products.map((product) => ({
                        product_id: product.product_id,
                        quantity: product.quantity,
                    })),
                    shipping_lines: [
                        {
                            method_id: 'flat_rate',
                            method_title: 'Flat Rate',
                            total: grand_Total.toString(),
                        },
                    ],
                };

                // WooCommerce API credentials
                const username = 'ck_468f7eb4fc82073df8c1c9515d20562e7dbe37d7';
                const password = 'cs_36993c1a76e77b5c58269bddc4bd3b452319beca';
                const authHeader = 'Basic ' + btoa(`${username}:${password}`);

                // Post to WooCommerce API
                const wooCommerceResponse = await axios.post(
                    'https://ecom.launcherr.co/wp-json/wc/v3/orders',
                    wooCommercePayload,
                    {
                        headers: {
                            Authorization: authHeader,
                            'Content-Type': 'application/json',
                        },
                    }
                );

                console.log('WooCommerce order created successfully:', wooCommerceResponse.data);
            } catch (error) {
                console.error('Error creating WooCommerce order:', error.response?.data || error.message);
                throw error;
            }
        };

        
    }, [orderId]);

    const handleHome = () => {
        router.push('/');
    };

    if (!isClient) {
        return null;
    }

    if (loading) {
        return <Loader />;
    }

    return (
        <div className={styles["paymentsucces-main-container"]}>
            <Lottie
                loop
                animationData={lottieJson}
                play
                style={{ width: 550, height: 750 }}
            />
            <div className={styles["absolute-text"]}>
                <h1>Thank You!</h1>
                <h4>Payment done Successfully</h4>
                <p>Click here to return to the Home page</p>
                <button onClick={handleHome} className="btn-full">
                    Home
                </button>
            </div>
        </div>
    );
};

export default PaymentSuccessProduct;
