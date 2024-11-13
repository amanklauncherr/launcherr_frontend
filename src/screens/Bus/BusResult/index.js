import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/MainLayout';
import FilterDataBox from '@/components/FilterDataBox';
import ImageLayout from '@/components/ImageLayout';
import styles from './stays.module.css';
import axios from 'axios';
import { useRouter } from 'next/router';
import BusTicketCard from '../BusTicketCard';
import FilterSidebar from './FilterSidebar'

const BusResult = () => {
    const [availableTrips, setAvailableTrips] = useState([]);
    const [encryptedToken, setEncryptedToken] = useState('');
    const [encryptedKey, setEncryptedKey] = useState('');
    const router = useRouter();

    const { sourceName, sourceId, destinationName, destinationId, date } = JSON.parse(localStorage.getItem('Bus_Search_data')) || {};
    const savedFilters = JSON.parse(localStorage.getItem('BusFilter'));

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
            "headersToken": encryptedToken,
            "headersKey": encryptedKey,
            sourceId: sourceId || '1406', // Default to '1406' if not provided
            destinationId: destinationId || '1492', // Default to '1492' if not provided
            date: date || '2024-11-07', // Default to a specific date if not provided
            AC: (savedFilters?.ac || ''), // Placeholder for optional filters
            Seater: (savedFilters?.seater || ''),
            Sleeper: (savedFilters?.sleeper || ''),
            Arrival: (savedFilters?.arrivalTimes || ''),
            Departure: (savedFilters?.departureTimes || '')
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


    const handleModify = () => {
    localStorage.removeItem('BusFilter');
    router.push('/bus')
    }

    return (
        <>
            <MainLayout>
                <ImageLayout Img_url='/images/f3.png'>
                    <FilterDataBox onclickbtn={handleModify} btn_name="Reset">
                        <div className={styles["modify-filter-inner"]}>
                            <p>From
                                <span>{sourceName}</span>
                            </p>
                            <p>
                                To
                                <span>{destinationName}</span>
                            </p>
                         
                            <p>
                                Date
                                <span>{date}</span>
                            </p>
                        </div>
                    </FilterDataBox>
                </ImageLayout>
                <div className={styles.hotelSearchContainer}>
                 <FilterSidebar/>
                    <main className={styles.hotelList}>

                        {availableTrips.map((trip) => (
                            <BusTicketCard 
                                encryptedKey={encryptedKey}
                                encryptedToken={encryptedToken}
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
