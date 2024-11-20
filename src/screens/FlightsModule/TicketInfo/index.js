import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router'; // Import useRouter
import MainLayout from '@/components/MainLayout';
import FilterDataBox from '@/components/FilterDataBox';
import ImageLayout from '@/components/ImageLayout';
import DestinationCard from '@/components/DestinationCard';
import HomeCrumbs from '@/components/HomeCrumbs';
import styles from '../flights.module.css';
import toast from 'react-hot-toast';
import axios from 'axios';

const TicketInfo = () => {
    const [destinationData, setDestinationData] = useState([]);
    const [bookingRef, setBookingRef] = useState(''); // State to hold the booking reference
    const router = useRouter(); // Initialize router

    useEffect(() => {
        const fetchDestinationData = async () => {
            try {
                const response = await axios.get('https://api.launcherr.co/api/showDestination');
                setDestinationData(response.data.data);
            } catch (error) {
                console.error('Error fetching destination data:', error);
                toast.error('Failed to fetch destination data');
            }
        };
        fetchDestinationData();
    }, []);

    const handleSearch = () => {
        if (bookingRef) {
            // Navigate to the new route with bookingRef
            router.push(`/flightTicket?bookingRef=${bookingRef}`);
        } else {
            toast.error('Please enter a booking reference'); // Alert if input is empty
        }
    };

    return (
        <>
            <MainLayout>
                <ImageLayout Img_url='/images/f3.png' heading="Ticke Info">
                </ImageLayout>
                <div className={styles["ticket-info-saerch"]}>
                    <FilterDataBox onclickbtn={handleSearch} btn_name='Search'>
                        <div className={styles.inputcontainer}>
                            <label htmlFor="">Enter Booking ref</label>
                            <input 
                                type="text" 
                                value={bookingRef} 
                                onChange={(e) => setBookingRef(e.target.value)} // Update state on input change
                            />
                        </div>
                    </FilterDataBox>
                </div>
                {/* <div className={styles['destination-flight-inner']}>
                    <HomeCrumbs>
                        {destinationData?.map((destinationItem, index) => (
                            <DestinationCard key={index} {...destinationItem} />
                        ))}
                    </HomeCrumbs>
                </div> */}
            </MainLayout>
        </>
    );
}

export default TicketInfo;
