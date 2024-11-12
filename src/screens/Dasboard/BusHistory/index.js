import React, { useEffect, useState } from 'react';
import styles from './bushistory.module.css';
import Dashboard from '..';
import axios from 'axios';
import Cookies from 'js-cookie';

const BusHistory = () => {
    const [historyData, setHistoryData] = useState(null); // To store API response data

    useEffect(() => {
        const authToken = Cookies.get('auth_token');
        
        if (authToken) {
            axios.get('https://api.launcherr.co/api/Bus/Travel/History', {
                headers: { Authorization: `Bearer ${authToken}` }
            })
            .then(response => {
                console.log('API Response:', response.data);
                setHistoryData(response.data); // Set response data in state
            })
            .catch(error => {
                console.error('Error fetching travel history:', error);
            });
        } else {
            console.error('No auth token found. Please log in.');
        }
    }, []);

    return (
        <Dashboard>
            <div className={styles.historyContainer}>
                <h1>Bus Travel History</h1>
                {historyData ? (
                    <pre>{JSON.stringify(historyData, null, 2)}</pre> // Display response data for testing
                ) : (
                    <p>Loading travel history...</p>
                )}
            </div>
        </Dashboard>
    );
}

export default BusHistory;
