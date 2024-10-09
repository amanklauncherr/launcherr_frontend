import React, { useEffect, useState } from 'react'
import MainLayout from '@/components/MainLayout';
import FilterDataBox from '@/components/FilterDataBox';
import ImageLayout from '@/components/ImageLayout';
import DestinationCard from '@/components/DestinationCard';
import HomeCrumbs from '@/components/HomeCrumbs';
import styles from '../flights.module.css'
import toast from 'react-hot-toast';
import axios from 'axios';

const TicketInfo = () => {
    const [destinationData, setDestinationData] = useState([]);

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

      }

    return (
        <>
            <MainLayout>
                <ImageLayout Img_url='/images/f3.png'
                heading="jsdkfkfs"
                >
                <FilterDataBox onclickbtn={handleSearch} btn_name='Search'>
                       <div className={styles.inputcontainer}>
                        <label htmlFor="">Enter pnr</label>
                         <input type="text" />
                       </div>
                       <div className={styles.inputcontainer}>
                        <label htmlFor="">Enter Booking ref</label>
                         <input type="text" />
                       </div>
                    </FilterDataBox>
                </ImageLayout>
                    <div className={styles['destination-flight-inner']}>
                        <HomeCrumbs
                        // Crumb_About="Featured Escapes"
                        // Crumb_Info={fetchSectionData?.Destination?.heading}
                        // Crumb_Descripton={fetchSectionData?.Destination?.['sub-heading']}
                        // btn_name="VIEW ALL DESTINATIONS"
                        // onClick={handleDestination}
                        >
                            {destinationData?.map((destinationItem, index) => (
                                <DestinationCard key={index} {...destinationItem} />
                            ))}
                        </HomeCrumbs>
                    </div>
            </MainLayout>

        </>
    )
}

export default TicketInfo