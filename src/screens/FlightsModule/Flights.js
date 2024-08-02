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

const Flights = () => {
  const [fetchSectionData, setFetchSectionData] = useState();
  const [destinationData, setDestinationData] = useState([]);
  const [showFlightInfo, setShowFlightInfo] = useState(false);
  const [flightInfo, setFlightInfo] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchToken = async () => {
    try {
      const response = await axios.post('https://test.api.amadeus.com/v1/security/oauth2/token', 
        new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: 'fbHM2EoHTyvzDBNsGyqFv6sa5uGpt9En',
          client_secret: 'MgnbcTliA1P2cZzH'
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
    }
  };

  useEffect(() => {
    const fetchSectionData = async () => {
      try {
        const response = await axios.get('https://api.launcherr.co/api/Show-Section');
        setFetchSectionData(response.data);
      } catch (error) {
        console.error('Error fetching banner data:', error);
      }
    };

    const fetchDestinationData = async () => {
      try {
        const response = await axios.get('https://api.launcherr.co/api/showDestination');
        setDestinationData(response.data.data);
      } catch (error) {
        console.error('Error fetching destination data:', error);
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

      const response = await axios.get('https://test.api.amadeus.com/v2/shopping/flight-offers', {
        params: {
          originLocationCode: searchParams.flyingFrom,
          destinationLocationCode: searchParams.flyingTo,
          departureDate: searchParams.departureDate,
          returnDate: searchParams.returnDate,
          adults: searchParams.passengerClass.split(' ')[0],
          nonStop: searchParams.directOnly,
          currencyCode: searchParams.currency,
          max: 5
        },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setFlightInfo(response.data.data);
    } catch (error) {
      toast.error(error.response?.data?.errors[0]?.detail || 'Error searching flights');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <MainLayout>
        <ImageLayout Img_url='/images/flight_1.png' heading='Book Flight'>
          <FlightSearch onClick={handleSearchFlight} />
        </ImageLayout>
        {loading && <Loader />}
        {!showFlightInfo && !loading && (
          <div className='destination-flight-inner'>
            <HomeCrumbs
              Crumb_About="Featured Escapes"
              Crumb_Info={fetchSectionData?.Destination?.heading}
              Crumb_Descripton={fetchSectionData?.Destination?.['sub-heading']}
              btn_name="VIEW ALL DESTINATIONS"
              onClick={handleDestination}
            >
              {destinationData?.map((destinationItem, index) => (
                <DestinationCard key={index} {...destinationItem} />
              ))}
            </HomeCrumbs>
          </div>
        )}
        {showFlightInfo && !loading &&
          <div className={styles["showing-flights-main-container"]}>
            {flightInfo.length > 0 ? (
              flightInfo.map((flight, index) => (
                <FlightInfo
                  key={index}
                  currency={flight?.price?.currency}
                  numberOfBookableSeats={flight.numberOfBookableSeats}
                  carrierCode={flight.itineraries[0]?.segments[0]?.carrierCode}
                  segments={flight.itineraries[0]?.segments || []}
                  Price_grandTotal={flight.price?.grandTotal}
                  carrierCode_Round={flight.itineraries[1]?.segments[1]?.carrierCode}
                  segments_Round={flight.itineraries[1]?.segments || []}
                />
              ))
            ) : (
              <>
              <EmptyHotel/>
              </>
            )}
          </div>
        }
      </MainLayout>
    </>
  );
};

export default Flights;
