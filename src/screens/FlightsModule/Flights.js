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

const Flights = () => {
  const [fetchSectionData, setFetchSectionData] = useState();
  const [destinationData, setDestinationData] = useState([]);
  const [showFlightInfo, setShowFlightInfo] = useState(false);
  const [flightInfo, setFlightInfo] = useState([]);
  const [loading, setLoading] = useState(false);
  const [flightOffers, setFlightOffers] = useState([]);
  const [fetchedProductData, setFetchedProductData] = useState([]);
  const router = useRouter();


  useEffect(() => {
    const fetchProductData = async () => {
      const username = 'ck_468f7eb4fc82073df8c1c9515d20562e7dbe37d7';
      const password = 'cs_36993c1a76e77b5c58269bddc4bd3b452319beca';
      const authHeader = 'Basic ' + btoa(`${username}:${password}`);

      try {
        const response = await axios.get('https://ecom.launcherr.co/wp-json/wc/v3/products?per_page=100', {
          headers: {
            Authorization: authHeader,
          },
        });
        setFetchedProductData(response.data);
        console.log("product ka datadfedfd", response.data);
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    };

    fetchProductData();
  }, []);


  const handleproduct = () => {
    router.push('/products');
  };

  const fetchToken = async () => {
    try {
      const response = await axios.post('https://api.amadeus.com/v1/security/oauth2/token', 
        new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: 'zYssACjlbXv0PDbxMpVN58WRU7kqgGtA',
          client_secret: 'IqAniSZnJlFVMtL0'
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
      return response.data.access_token;
    } catch (error) {
      console.error('Error fetching token:', error);
      toast.error('Failed to fetch token');
    }
  };

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

  const handleSearchFlight = async (searchParams) => {
    setShowFlightInfo(true);
    setLoading(true);
    try {
      const token = await fetchToken();
      const response = await axios.get('https://api.amadeus.com/v2/shopping/flight-offers', {
        params: dom(searchParams),
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      const flightData = response.data.data;
      setFlightInfo(flightData);

      const flightOffers = flightData.map(flight => ({
        id: flight.id,
        // Add other relevant fields based on your requirements
      }));
      
      setFlightOffers(flightOffers);
      
    } catch (error) {
      toast.error(error.response?.data?.errors[0]?.detail || 'Error searching flights');
    } finally {
      setLoading(false);
    }
  };

  const fetchPricing = async (token, flightOffers) => {
    try {
      const pricingResponse = await axios.post(
        'https://api.amadeus.com/v1/shopping/flight-offers/pricing?forceClass=false',
        { data: flightOffers },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log('Pricing response:', pricingResponse.data);
    } catch (error) {
      console.error('Error fetching pricing:', error);
      toast.error(error.response?.data?.errors[0]?.detail || 'Error fetching pricing');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = await fetchToken();
      if (flightOffers.length > 0 && token) {
        await fetchPricing(token, flightOffers);
      }
    };

    fetchData();
  }, [flightOffers]);

  return (
    <>
      <MainLayout>
        <ImageLayout Img_url='/images/flight_1.png'>
          <FlightSearch onClick={handleSearchFlight} />
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
            {destinationData?.map((destinationItem, index) => (
              <DestinationCard key={index} {...destinationItem} />
            ))}
          </HomeCrumbs>
          <HomeCrumbs
          id="explore-products"
          Crumb_About="Wanderlust Essentials"
          Crumb_Info={fetchSectionData?.Products?.heading}
          Crumb_Descripton={fetchSectionData?.Products?.['sub-heading']}
          btn_name="VIEW ALL PRODUCTS"
          onClick={handleproduct}
        >
          {fetchedProductData.length > 0 ? (
            fetchedProductData
              .filter(productItem => productItem.status !== 'draft') // Filter out products with 'draft' status
              .slice(0, 3) // Limit the result to the first 3 products
              .map((productItem) => (
                <ProductCard
                  key={productItem?.id}
                  ProductId={productItem?.id}
                  about={productItem?.name}
                  status={productItem?.status}
                  description={productItem?.description}
                  img_url={productItem?.images?.length > 0 ? productItem.images[0].src : ''}
                  regular_price={productItem.regular_price}
                  amount={productItem.price}
                  average_rating={productItem.average_rating}
                  rating_count={productItem.rating_count}
                  short_description={productItem?.short_description}
                />
              ))
          ) : (
            <>
              <EmptyHotel />
            </>
          )}
        </HomeCrumbs>
        </div>
      </MainLayout>
    </>
  );
};

export default Flights;
