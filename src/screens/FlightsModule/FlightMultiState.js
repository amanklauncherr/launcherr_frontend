import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import FlightInfo from '@/screens/FlightsModule/FlightInfo';
import HomeCrumbs from '@/components/HomeCrumbs';
import ImageLayout from '@/components/ImageLayout';
import MainLayout from '@/components/MainLayout';
import DestinationCard from '@/components/DestinationCard';
import styles from './flights.module.css';
import FlightSearch from './FlightSearch';
import Loader from '@/components/Loader';
import toast from 'react-hot-toast';
import EmptyHotel from '@/components/EmptyHotel';
import ProductCard from '@/components/ProductCard';
import FlightSearchMulti from './FlightSearchMulti';

const FlightMultiState = () => {
  const [destinationData, setDestinationData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [flightOffers, setFlightOffers] = useState([]);
  const router = useRouter();


  // const fetchToken = async () => {
  //   try {
  //     const response = await axios.post('https://api.amadeus.com/v1/security/oauth2/token', 
  //       new URLSearchParams({
  //         grant_type: 'client_credentials',
  //         client_id: 'zYssACjlbXv0PDbxMpVN58WRU7kqgGtA',
  //         client_secret: 'IqAniSZnJlFVMtL0'
  //       }),
  //       {
  //         headers: {
  //           'Content-Type': 'application/x-www-form-urlencoded'
  //         }
  //       }
  //     );
  //     return response.data.access_token;
  //   } catch (error) {
  //     console.error('Error fetching token:', error);
  //     toast.error('Failed to fetch token');
  //   }
  // };

  useEffect(() => {
    const fetchSectionData = async () => {
      try {
        const response = await axios.get('https://api.launcherr.co/api/Show-Section');
        setFetchSectionData(response.data);
      } catch (error) {
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

  // const handleSearchFlight = async (searchParams) => {
  //   setShowFlightInfo(true);
  //   setLoading(true);
  //   try {
  //     const token = await fetchToken();
  //     const response = await axios.get('https://api.amadeus.com/v2/shopping/flight-offers', {
  //       params: dom(searchParams),
  //       headers: {
  //         'Authorization': `Bearer ${token}`
  //       }
  //     });
  
  //     const flightData = response.data.data;
  //     setFlightInfo(flightData);

  //     const flightOffers = flightData.map(flight => ({
  //       id: flight.id,
  //       // Add other relevant fields based on your requirements
  //     }));
      
  //     setFlightOffers(flightOffers);
      
  //   } catch (error) {
  //     toast.error(error.response?.data?.errors[0]?.detail || 'Error searching flights');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const fetchPricing = async (token, flightOffers) => {
  //   try {
  //     const pricingResponse = await axios.post(
  //       'https://api.amadeus.com/v1/shopping/flight-offers/pricing?forceClass=false',
  //       { data: flightOffers },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`
  //         }
  //       }
  //     );

  //     console.log('Pricing response:', pricingResponse.data);
  //   } catch (error) {
  //     console.error('Error fetching pricing:', error);
  //     toast.error(error.response?.data?.errors[0]?.detail || 'Error fetching pricing');
  //   }
  // };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const token = await fetchToken();
  //     if (flightOffers.length > 0 && token) {
  //       await fetchPricing(token, flightOffers);
  //     }
  //   };

  //   fetchData();
  // }, [flightOffers]);

  return (
    <>
      <MainLayout>
        <ImageLayout Img_url='/images/flight_1.png'>
        </ImageLayout>
        {loading && <Loader />}
        <div className={styles['destination-flight-inner']}>
          <HomeCrumbs
            // Crumb_About="Featured Escapes"
            // Crumb_Info={fetchSectionData?.Destination?.heading}
            // Crumb_Descripton={fetchSectionData?.Destination?.['sub-heading']}
            // btn_name="VIEW ALL DESTINATIONS"
            // onClick={handleDestination}
          >
            <FlightSearchMulti />
          </HomeCrumbs>
          <HomeCrumbs>
            {destinationData?.map((destinationItem, index) => (
              <DestinationCard key={index} {...destinationItem} />
            ))}
          </HomeCrumbs>
        </div>
      </MainLayout>
    </>
  );
};

export default FlightMultiState;
