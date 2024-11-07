import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/MainLayout';
import FilterDataBox from '@/components/FilterDataBox';
import ImageLayout from '@/components/ImageLayout';
import styles from './stays.module.css';
import axios from 'axios';
import { useRouter } from 'next/router';
import BusTicketCard from '../BusTicketCard';

const BusResult = () => {
    const [availableTrips, setAvailableTrips] = useState([]);
    const [encryptedToken, setEncryptedToken] = useState('');
    const [encryptedKey, setEncryptedKey] = useState('');
    const router = useRouter();

    const { sourceId, destinationId, date } = router.query; // Destructure the query parameters

    const getEncryptedCredentials = async () => {
        try {
            const response = await axios.get('https://api.launcherr.co/api/AES/Encryption');
            setEncryptedToken(response.data.encrypted_token);
            setEncryptedKey(response.data.encrypted_key);
        } catch (error) {
            console.error('Error encrypting credentials:', error);
            // You can use toast here for error notification
        }
    };

    // Function to fetch available trips
    const fetchAvailableTrips = async () => {
        if (!encryptedToken || !encryptedKey) return; // Ensure credentials are available before making the request

        const payload = {
            sourceId: sourceId || '1406', // Default to '1406' if not provided
            destinationId: destinationId || '1492', // Default to '1492' if not provided
            date: date || '2024-11-07', // Default to a specific date if not provided
            AC: '', // Placeholder for optional filters
            Seater: '',
            Sleeper: '',
            Arrival: '',
            Departure: ''
        };

        try {
            const response = await axios.post(
                'https://api.launcherr.co/api/Avaliable/Trip',
                payload,
                {
                    headers: {
                        'D-SECRET-TOKEN': encryptedToken,
                        'D-SECRET-KEY': encryptedKey,
                        'CROP-CODE': 'DOTMIK160614',
                        'Content-Type': 'application/json',
                    },
                }
            );
                setAvailableTrips(response.data.payloads.data.avaliableTrips);
                console.log(response.data.payloads.data.avaliableTrips);
        } catch (error) {
            console.error('Error fetching available trips:', error);
            // You can use toast here for error notification
        }
    };

    useEffect(() => {
        getEncryptedCredentials(); // Fetch encrypted credentials first
    }, []);

    useEffect(() => {
        if (encryptedToken && encryptedKey) {
            fetchAvailableTrips(); // Fetch available trips when credentials are available
        }
    }, [encryptedToken, encryptedKey]);

    return (
        <>
            <MainLayout>
                <ImageLayout Img_url='/images/f3.png'>
                    <FilterDataBox onclickbtn={'handleModify'} btn_name="Modify">
                        <div className={styles["modify-filter-inner"]}>
                            <p>From
                                <span>Delhi</span>
                            </p>
                            <p>
                                To
                                <span>Lucknow</span>
                            </p>
                            <p>
                                Nights
                                <span>1</span>
                            </p>
                            <p>
                                Date
                                <span>20 Oct 24</span>
                            </p>
                        </div>
                    </FilterDataBox>
                </ImageLayout>
                <div className={styles.hotelSearchContainer}>
                    <aside className={styles.filterSidebar}>
                        <div className={styles.filterSection}>
                            <h3>Filter Results</h3>
                            <button className={styles.resetButton}>Reset All</button>
                        </div>
                        <div className={styles.priceFilter}>
                            <h4>Price</h4>
                            <div className={styles.sliderContainer}>
                                <input type="range" min="1219.82" max="72099.89" className={styles.slider} />
                            </div>
                        </div>
                        <div className={styles.textFilter}>
                            <h4>Travel Operators</h4>
                            <input type="text" placeholder="Search Travel Operators" className={styles.textInput} />
                        </div>
                        <div className={styles.starFilter}>
                            <h4>Bus Type</h4>
                            {/* Checkbox filters can be added here */}
                        </div>
                        {/* Other filters can be added here */}
                    </aside>
                    <main className={styles.hotelList}>

                        {availableTrips.map((trip) => (
                            <BusTicketCard 
                                key={trip.id} 
                                trip={trip} 
                                sourceId={sourceId} 
                                destinationId={destinationId} 
                            />
                        ))}
                    </main>
                </div>
            </MainLayout>
        </>
    );
};

export default BusResult;
