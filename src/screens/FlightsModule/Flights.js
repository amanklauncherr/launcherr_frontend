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

const Flights = () => {
  const [fetchSectionData, setFetchSectionData] = useState();
  const [destinationData, setDestinationData] = useState([]);
  const [showFlightInfo, setShowFlightInfo] = useState(false);
  const [flightInfo, setFlightInfo] = useState([]);
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
          currencyCode: 'INR',
          max: 5
        },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setFlightInfo(response.data.data);
    } catch (error) {
      console.error('Error fetching flight offers:', error);
    }
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
              {destinationData?.map((destinationItem, index) => (
                <DestinationCard key={index} {...destinationItem} />
              ))}
            </HomeCrumbs>
          </div>
        )}
        {showFlightInfo &&
          <div className={styles["showing-flights-main-container"]}>
            {flightInfo.map((flight, index) => (
              <FlightInfo
                key={index}
                carrierCode={flight.itineraries[0].segments[0].carrierCode}
                departure_at={flight.itineraries[0].segments[0].departure.at.split('T')[1].slice(0, 5)}
                departure_Date={flight.itineraries[0].segments[0].departure.at.split('T')[0]}
                arrival_Date={flight.itineraries[0].segments[0].arrival.at.split('T')[0]}
                departure_iataCode={flight.itineraries[0].segments[0].departure.iataCode}
                duration={
                  (() => {
                    const duration = flight.itineraries[0].duration;
                    const match = duration.match(/PT(\d+H)?(\d+M)?/);
                    const hours = match[1] ? match[1].slice(0, -1) : '0';
                    const minutes = match[2] ? match[2].slice(0, -1) : '0';
                    return `${hours}h ${minutes}m`;
                  })()
                }
                arrival_at={flight.itineraries[0].segments[0].arrival.at.split('T')[1].slice(0, 5)}
                arrival_iataCode={flight.itineraries[0].segments[0].arrival.iataCode}
                Price_grandTotal={flight.price.grandTotal}
              />
            ))}
          </div>
        }
      </MainLayout>
    </>
  );
};

export default Flights;