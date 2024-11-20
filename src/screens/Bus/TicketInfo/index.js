import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router'; // Import useRouter
import MainLayout from '@/components/MainLayout';
import FilterDataBox from '@/components/FilterDataBox';
import ImageLayout from '@/components/ImageLayout';
import DestinationCard from '@/components/DestinationCard';
import HomeCrumbs from '@/components/HomeCrumbs';
import styles from '../../FlightsModule/flights.module.css';
import toast from 'react-hot-toast';
import axios from 'axios';

const TicketInfo = () => {
    const [destinationData, setDestinationData] = useState([]);
    const [referenceId, setreferenceId] = useState(''); // State to hold the booking reference
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
        if (referenceId) {
            // Navigate to the new route with bookingRef
            router.push(`/bus/busTicket?referenceId=${referenceId}`);
        } else {
            toast.error('Please enter a booking reference'); // Alert if input is empty
        }
    };

    return (
        <>
            <MainLayout>
                <ImageLayout Img_url='/images/f3.png' heading="jsdkfkfs">
                    <FilterDataBox onclickbtn={handleSearch} btn_name='Search'>
                        <div className={styles.inputcontainer}>
                            <label htmlFor="">Enter Reference Id</label>
                            <input 
                                type="text" 
                                value={referenceId} 
                                onChange={(e) => setreferenceId(e.target.value)} // Update state on input change
                            />
                        </div>
                    </FilterDataBox>
                </ImageLayout>
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
