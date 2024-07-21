import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import FlightInfo from '@/components/FlightInfo';
import FlightSearch from '@/components/FlightSearch';
import HomeCrumbs from '@/components/HomeCrumbs';
import ImageLayout from '@/components/ImageLayout';
import MainLayout from '@/components/MainLayout';
import destinationsData from './destinations.json';
import DestinationCard from '@/components/DestinationCard';
import styles from './flights.module.css'

const Flights = () => {
  const [fetchSectionData, setFetchSectionData] = useState();
  const [showFlightInfo, setShowFlightInfo] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchSectionData = async () => {
      try {
        const response = await axios.get('https://api.launcherr.co/api/Show-Section');
        setFetchSectionData(response.data);
      } catch (error) {
        console.error('Error fetching banner data:', error);
      }
    };

    fetchSectionData();
  }, []);

  const handleDestination = () => {
    router.push('/destination');
  };

  const handleSearchFlight = () => {
    setShowFlightInfo(true);
  };

  return (
    <>
      <MainLayout>
        <ImageLayout Img_url='/images/gigsimg.png' heading='Book Flight'>
          <FlightSearch onClick={handleSearchFlight} />
        </ImageLayout>
        {!showFlightInfo && (
          <div className='destination-flight-inner'>
            <HomeCrumbs
              Crumb_About="Featured Escapes"
              Crumb_Info={fetchSectionData?.Destination?.heading}
              Crumb_Descripton={fetchSectionData?.Destination?.['sub-heading']}
              btn_name="VIEW ALL DESTINATIONS"
              onClick={handleDestination}
            >
              {destinationsData.map((destinationItem, index) => (
                <DestinationCard key={index} {...destinationItem} />
              ))}
            </HomeCrumbs>
          </div>
        )}
        {showFlightInfo && 
        <>
        <div className={styles["showing-flights-main-container"]}>
        <FlightInfo />
        </div>
        </>
        }
      </MainLayout>
    </>
  );
};

export default Flights;
