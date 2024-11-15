import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import FlightInfo from '@/screens/FlightsModule/FlightInfo';
import HomeCrumbs from '@/components/HomeCrumbs';
import ImageLayout from '@/components/ImageLayout';
import MainLayout from '@/components/MainLayout';
import DestinationCard from '@/components/DestinationCard';
import styles from './staysmain.module.css';
import FlightSearch from './BusSearch';
import Loader from '@/components/Loader';
import toast from 'react-hot-toast';
import EmptyHotel from '@/components/EmptyHotel';
import BusSearch from './BusSearch';

const Bus = () => {
  const [fetchSectionData, setFetchSectionData] = useState();
  const [destinationData, setDestinationData] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();


  useEffect(() => {
    const fetchSectionData = async () => {
      try {
        const response = await axios.get('https://api.launcherr.co/api/Show-Section');
        setFetchSectionData(response.data);
      } catch (error) {
        console.error('Error fetching banner data:', error);
        toast.error('Failed to fetch section data');
      }
    };

    const fetchDestinationData = async () => {
      try {
        const response = await axios.get('https://api.launcherr.co/api/showDestination');
        setDestinationData(response.data.data);
      } catch (error) {
        console.error('Error fetching destination data:', error);
        toast.error('Failed to fetch destination data');
      }
    };

    fetchSectionData();
    fetchDestinationData();
  }, []);

  const handleDestination = () => {
    router.push('/destination');
  };


  return (
    <>
      <MainLayout>
        <ImageLayout Img_url='/images/hotelbooking.png'>
        <div className='mobhide'>
        <BusSearch/>
        </div>
        </ImageLayout>
        <div className='webhide'>
          <BusSearch/>
        </div>
        {loading && <Loader />}
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
  );
};

export default Bus;
