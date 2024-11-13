import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/MainLayout';
import FilterDataBox from '@/components/FilterDataBox';
import ImageLayout from '@/components/ImageLayout';
import styles from './stays.module.css';
import axios from 'axios';
import { useRouter } from 'next/router';
import BusTicketCard from '../BusTicketCard';
import FilterSidebar from './FilterSidebar';

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
        }
    };

    const fetchAvailableTrips = async () => {
        if (!encryptedToken || !encryptedKey) return;

        const payload = {
            headersToken: encryptedToken,
            headersKey: encryptedKey,
            sourceId: sourceId || '1406',
            destinationId: destinationId || '1492',
            date: date || '2024-11-07',
            AC: savedFilters?.ac || '',
            Seater: savedFilters?.seater || '',
            Sleeper: savedFilters?.sleeper || '',
            Arrival: savedFilters?.arrivalTimes || '',
            Departure: savedFilters?.departureTimes || ''
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

            const tripsData = response.data.payloads.data.avaliableTrips;
            // Ensure `availableTrips` is always an array
            setAvailableTrips(Array.isArray(tripsData) ? tripsData : [tripsData]);
        } catch (error) {
            console.error('Error fetching available trips:', error);
        }
    };

    useEffect(() => {
        getEncryptedCredentials();
    }, []);

    useEffect(() => {
        if (encryptedToken && encryptedKey) {
            fetchAvailableTrips();
        }
    }, [encryptedToken, encryptedKey]);

    const handleModify = () => {
        localStorage.removeItem('BusFilter');
        router.push('/bus');
    };

    return (
        <>
            <MainLayout>
                <ImageLayout Img_url='/images/f3.png'>
                    <div className='mobhide'>
                        <FilterDataBox onclickbtn={handleModify} btn_name="Reset">
                            <div className={styles["modify-filter-inner"]}>
                                <p>From
                                    <span>{sourceName}</span>
                                </p>
                                <p>To
                                    <span>{destinationName}</span>
                                </p>
                                <p>Date
                                    <span>{date}</span>
                                </p>
                            </div>
                        </FilterDataBox>
                    </div>
                </ImageLayout>
                <div className='webhide'>
                    <FilterDataBox onclickbtn={handleModify} btn_name="Reset">
                        <div className={styles["modify-filter-inner"]}>
                            <p>From
                                <span>{sourceName}</span>
                            </p>
                            <p>To
                                <span>{destinationName}</span>
                            </p>
                            <p>Date
                                <span>{date}</span>
                            </p>
                        </div>
                    </FilterDataBox>
                </div>
                <div className={styles.hotelSearchContainer}>
                    <FilterSidebar />
                    <main className={styles.hotelList}>
                        {Array.isArray(availableTrips) && availableTrips.length > 0 ? (
                            availableTrips.map((trip) => (
                                <BusTicketCard 
                                    encryptedKey={encryptedKey}
                                    encryptedToken={encryptedToken}
                                    key={trip.id} 
                                    trip={trip} 
                                    sourceId={sourceId} 
                                    destinationId={destinationId} 
                                />
                            ))
                        ) : (
                            <p>No trips available.</p>
                        )}
                    </main>
                </div>
            </MainLayout>
        </>
    );
};

export default BusResult;
