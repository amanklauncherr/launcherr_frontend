import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import FlightInfo from '@/screens/FlightsModule/FlightInfo';
import MainLayout from '@/components/MainLayout';
import Loader from '@/components/Loader';
import toast from 'react-hot-toast';
import styles from './flights.module.css';
import ImageLayout from '@/components/ImageLayout';
import FilterDataBox from '@/components/FilterDataBox';

const FlightDoms = () => {
  const [fetchSectionData, setFetchSectionData] = useState();
  const [destinationData, setDestinationData] = useState([]);
  const [showFlightInfo, setShowFlightInfo] = useState(false);
  const [flightInfo, setFlightInfo] = useState([]);
  const [loading, setLoading] = useState(false);
  const [flightOffers, setFlightOffers] = useState([]);
  const [dataInfo, setdataInfo] = useState();
  const router = useRouter();


  console.log('dataInfo', dataInfo)

  // Fetch the token for API authentication
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
      toast.error('Failed to fetch authentication token. Please try again.');
      return null;  // Handle the case where token fetching fails
    }
  };

  const fetchData = async () => {
    try {
      const [sectionResponse, destinationResponse] = await Promise.all([
        axios.get('https://api.launcherr.co/api/Show-Section'),
        axios.get('https://api.launcherr.co/api/showDestination')
      ]);
      setFetchSectionData(sectionResponse.data);
      setDestinationData(destinationResponse.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch section or destination data. Please try again.');
    }
  };

  const handleSearchFlight = async (searchParams) => {
    setShowFlightInfo(true);
    setLoading(true);
    setdataInfo(searchParams)
    try {
      const token = await fetchToken();
      if (!token) return;

      // Construct params object with conditional returnDate
      const params = {
        originLocationCode: searchParams.flyingFrom,
        destinationLocationCode: searchParams.flyingTo,
        departureDate: searchParams.departureDate,
        adults: searchParams.passengerClass.split(' ')[0],
        nonStop: searchParams.directOnly,
        currencyCode: searchParams.currency,
        cabin: searchParams.cabin,
        max: 5
      };

      // Add returnDate only if it is defined
      if (searchParams.returnDate) {
        params.returnDate = searchParams.returnDate;
      }

      const response = await axios.get('https://api.amadeus.com/v2/shopping/flight-offers', {
        params: params,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const flightData = response.data.data;
      setFlightInfo(flightData);

      const flightOffers = flightData.map(flight => ({
        id: flight.id,
        price: flight.price.grandTotal,
        currency: flight.price.currency,
        carrierCode: flight.itineraries[0]?.segments[0]?.carrierCode,
        segments: flight.itineraries[0]?.segments || [],
      }));

      setFlightOffers(flightOffers); // Store flightOffers for later use
    } catch (error) {
      // toast.error(error.response?.data?.errors[0]?.detail || 'Error searching flights');
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
      // toast.error('Failed to fetch flight pricing. Please try again.');
    }
  };

  useEffect(() => {
    fetchData();

    const handleQueryParams = async () => {
      const { query } = router;
      const searchParams = {
        flyingFrom: query.flyingFrom,
        flyingTo: query.flyingTo,
        departureDate: query.departureDate,
        returnDate: query.returnDate || '', // Handle 'undefined' case
        passengerClass: query.passengerClass,
        directOnly: query.directOnly === 'true',
        currency: query.currency
      };

      await handleSearchFlight(searchParams);
    };

    handleQueryParams();
  }, [router.query]);

  useEffect(() => {
    const fetchDataForPricing = async () => {
      const token = await fetchToken();
      if (flightOffers.length > 0 && token) {
        await fetchPricing(token, flightOffers);
      }
    };

    fetchDataForPricing();
  }, [flightOffers]);


  const handleModify = () => {
    router.push('/flights')
  }

  return (
    <MainLayout>
      <ImageLayout Img_url='/images/f3.png' heading='Book Flight'>
      </ImageLayout>
        <FilterDataBox
          onclickbtn={handleModify}
          btn_name="Modify"
        >
          <p><strong>Flying From:</strong> <br /> {dataInfo?.flyingFrom}</p>
          <p><strong>Flying To:</strong> <br /> {dataInfo?.flyingTo}</p>
          <p><strong>Departure Date:</strong> <br /> {dataInfo?.departureDate}</p>
          {dataInfo?.returnDate && <p><strong>Return Date:</strong> <br /> {dataInfo?.returnDate}</p>}
          <p><strong>Passenger Class:</strong> <br /> {dataInfo?.passengerClass}</p>
          <p><strong>Direct Only:</strong> <br /> {dataInfo?.directOnly ? 'Yes' : 'No'}</p>
          <p><strong>Currency:</strong> <br /> {dataInfo?.currency}</p>
        </FilterDataBox>
      {loading && <Loader />}
      {!loading && showFlightInfo && flightInfo.length > 0 ? (
        <div className={styles["showing-flights-main-container"]}>
          {flightInfo.map((flight, index) => (
            <FlightInfo
              key={index}
              flight_id={flight?.id}
              source_payload={flight?.source}
              travelerPricings={flight?.travelerPricings}
              instantTicketingRequired={flight?.instantTicketingRequired}
              nonHomogeneous={flight?.nonHomogeneous}
              oneWay={flight?.oneWay}
              isUpsellOffer={flight?.isUpsellOffer}
              lastTicketingDate={flight?.lastTicketingDate}
              lastTicketingDateTime={flight?.lastTicketingDateTime}
              validatingAirlineCodes={flight?.validatingAirlineCodes}
              pricingOptions={flight?.pricingOptions}
              price_payalod={flight?.price}
              itineraries_payalod={flight?.itineraries}
              currency={flight?.price?.currency}
              numberOfBookableSeats={flight.numberOfBookableSeats}
              carrierCode={flight.itineraries[0]?.segments[0]?.carrierCode}
              segments={flight.itineraries[0]?.segments || []}
              Price_grandTotal={flight.price?.grandTotal}
              carrierCode_Round={flight.itineraries[1]?.segments[1]?.carrierCode}
              segments_Round={flight.itineraries[1]?.segments || []}
            />
          ))}
        </div>
      ) : (
        !loading &&
        <Loader />
      )}
    </MainLayout>
  );
};

export default FlightDoms;
