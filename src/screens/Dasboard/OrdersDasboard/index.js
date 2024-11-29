import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './order.module.css';
import Dashboard from '..';
import Loader from '@/components/Loader';
import Cookies from 'js-cookie';
import EmptyHotel from '@/components/EmptyHotel';
import { useRouter } from 'next/router';

const OrdersDasboard = () => {
    const router = useRouter();
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
                        router.push('/auth/login')
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

    const cancelOrder = async (orderID) => {
        const authToken = Cookies.get('auth_token');
        if (authToken) {
            try {
                const response = await axios.post(
                    `https://api.launcherr.co/api/Cancel/OrderID?OrderID=${orderID}`,
                    {},
                    { headers: { Authorization: `Bearer ${authToken}` } }
                );

                if (response.data.success) {
                    alert(`Order ${orderID} has been successfully canceled.`);
                    // Remove the canceled order from the state (or refetch orders)
                    setOrdersData(prevOrders => prevOrders.filter(order => order.OrderID !== orderID));
                } else {
                    alert('Failed to cancel the order. Please try again later.');
                }
            } catch (error) {
                console.error('Cancellation error:', error);
                alert('Error occurred while canceling the order.');
            }
        }
    };

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return (
            <Dashboard>
                <EmptyHotel />
            </Dashboard>
        );
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
                            <th>Action</th>
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
                                <td>
                                        {order.OrderStatus === "PaymentSuccess" && (
                                            <button onClick={() => cancelOrder(order.OrderID)}>
                                                Cancel&nbsp;Order
                                            </button>
                                        )}
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
