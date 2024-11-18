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
        const fetchOrders = async () => {
            const authToken = Cookies.get('auth_token');
            try {
                const response = await axios.get('https://api.launcherr.co/api/get/Order/User', {
                    headers: { Authorization: `Bearer ${authToken}` }
                });
                setOrdersData(response.data.data || []);
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
                            <th>Order ID</th>
                            <th>Product Details</th>
                            <th>Order Status</th>
                            <th>Total Amount</th>
                            <th>Billing Address</th>
                            <th>Shipping Address</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ordersData.map((order) => (
                            <tr key={order.id}>
                                <td>{order.OrderID}</td>
                                <td>
                                    {order.OrderDetails.products.map((product) => (
                                        <div key={product.id}>
                                            {product.product_name} - {product.quantity} x {product.price} ₹
                                        </div>
                                    ))}
                                </td>
                                <td>{order.OrderStatus}</td>
                                <td>{order.OrderDetails.grand_Total} ₹</td>
                                <td>
                                    {`${order.OrderDetails.billing.firstName} ${order.OrderDetails.billing.lastName}, `}
                                    {`${order.OrderDetails.billing.address1}, ${order.OrderDetails.billing.city}, `}
                                    {`${order.OrderDetails.billing.state} - ${order.OrderDetails.billing.postcode}`}
                                </td>
                                <td>
                                    {`${order.OrderDetails.shipping.firstName} ${order.OrderDetails.shipping.lastName}, `}
                                    {`${order.OrderDetails.shipping.address1}, ${order.OrderDetails.shipping.city}, `}
                                    {`${order.OrderDetails.shipping.state} - ${order.OrderDetails.shipping.postcode}`}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Dashboard>
    );
};

export default OrdersDasboard;
