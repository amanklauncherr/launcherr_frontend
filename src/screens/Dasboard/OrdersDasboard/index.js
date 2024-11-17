import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './order.module.css';
import Dashboard from '..';
import Loader from '@/components/Loader';
import Cookies from 'js-cookie';


const OrdersDasboard = () => {
    const [ordersData, setOrdersData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            const authToken = Cookies.get('auth_token');
            if (authToken) {
                try {
                    const response = await axios.get('https://api.launcherr.co/api/showUserProfile', {
                        headers: { Authorization: `Bearer ${authToken}` }
                    });
                    if (response.data.success) {
                        setUserData(response.data.user);
                    } else {
                        throw new Error('Failed to fetch user profile');
                    }
                } catch (error) {
                    console.error('Profile fetch error:', error);
                    if (error?.response?.data?.success === 0) {
                        alert('Your session has expired. Please log in again.');
                        Cookies.remove('auth_token');
                    }
                    setError('Failed to fetch user profile');
                }
            } else {
                setError('No authentication token found');
            }
            setLoading(false);
        };

        fetchUserProfile();
    }, []);

    useEffect(() => {
        // const fetchOrders = async () => {
        //     if (userData?.email) {
        //         const username = 'ck_468f7eb4fc82073df8c1c9515d20562e7dbe37d7';
        //         const password = 'cs_36993c1a76e77b5c58269bddc4bd3b452319beca';
        //         const token = btoa(`${username}:${password}`); // Base64 encode the credentials

        //         // const apiUrl = `https://ecom.launcherr.co/wp-json/wc/v3/orders?search=${userData.email}`;
        //         const apiUrl = ``

        //         try {
        //             const response = await axios.get(apiUrl, {
        //                 headers: {
        //                     Authorization: `Basic ${token}`,
        //                 },
        //             });
        //             setOrdersData(response.data);
        //         } catch (error) {
        //             setError('Failed to fetch orders');
        //         }
        //     }
        // };
        const fetchOrders = async () => {
            const authToken = Cookies.get('auth_token');
            try {
                const response = await axios.get('https://api.launcherr.co/api/get/Order/User', {
                    headers: { Authorization: `Bearer ${authToken}` }
                });
                setOrdersData(response.data);
            } catch (error) {
                setError('Failed to fetch orders');
            }
        };

        if (userData) {
            fetchOrders();
        }
    }, [userData]);

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <Dashboard>
            <h1 className={styles["youb"]}>Hi {userData?.name}, your orders:</h1>
            <div className={styles["orders-table"]}>
                <table className={styles['text-nowrap']}>
                    <thead>
                        <tr>
                            <th>Product Name</th>
                            <th>Ordered Created</th>
                            <th>Status</th>
                            <th>Total Amount</th>
                            <th>Shipping Address</th>
                            <th>Payment Method</th>
                            <th>Quantity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ordersData.map((order) => (
                            <tr key={order.id}>
                                <td>
                                    {order.line_items.map((item) => (
                                        <div key={item.id}>
                                            {item.name} - {item.quantity} x {item.price}
                                        </div>
                                    ))}
                                </td>
                                <td>{new Date(order.date_created).toLocaleDateString()}</td>
                                <td>{order.status}</td>
                                <td>{`${order.currency_symbol}${order.total}`}</td>
                                <td>{`${order.shipping.address_1}, ${order.shipping.city}, ${order.shipping.state}, ${order.shipping.country} - ${order.shipping.postcode}`}</td>
                                <td>{order.payment_method_title}</td>
                                <td>{order.line_items.length}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Dashboard>
    );
};

export default OrdersDasboard;
