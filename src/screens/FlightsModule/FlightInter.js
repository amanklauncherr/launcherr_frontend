import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import FlightInfo from '@/screens/FlightsModule/FlightInfo';
import MainLayout from '@/components/MainLayout';
import Loader from '@/components/Loader';
import toast from 'react-hot-toast';
import styles from './flights.module.css';
import ImageLayout from '@/components/ImageLayout';
import FilterDataBox from '@/components/FilterDataBox';
import axios from 'axios';

const FlightInter = () => {
  const [showFlightInfo, setShowFlightInfo] = useState(false);
  const [flightInfo, setFlightInfo] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataInfo, setDataInfo] = useState();
  const router = useRouter();

  useEffect(() => {
    const handleQueryParams = async () => {
      const { query } = router;
      const searchParams = {
        flyingFrom: query.flyingFrom || "DEL",
        flyingTo: query.flyingTo || "BKK",
        departureDate: query.departureDate || "2024-09-03T00:00:00",
        returnDate: query.returnDate || "2024-10-23T00:00:00",
        passengerClass: query.passengerClass || "Business",
        directOnly: query.directOnly === 'true',
        currency: query.currency || "USD",
        AdultCount: query.AdultCount || "1",
        ChildCount: query.ChildCount || "0",
        InfantCount: query.InfantCount || "0",
        JourneyType: query.JourneyType || "OneWay",
      };

      setDataInfo(searchParams);
      setLoading(true);

      try {
        const response = await axios.post(
          'https://api-partner.niyoin.com/api/v1/partner/bookings/flight/search',
          {
            AdultCount: searchParams.AdultCount,
            ChildCount: searchParams.ChildCount,
            InfantCount: searchParams.InfantCount,
            JourneyType: searchParams.JourneyType,
            PreferredAirlines: [""],
            CabinClass: searchParams.passengerClass,
            Segments: [
              {
                Origin: searchParams.flyingFrom,
                Destination: searchParams.flyingTo,
                DepartureDate: searchParams.departureDate,
                ReturnDate: searchParams.returnDate
              }
            ]
          },
          {
            headers: {
              'x-api-key': '8373f858b7c8afd533497e7c870911ec',
              'request-token': '12345678',
              'Content-Type': 'application/json',
            },
          }
        );

        setFlightInfo(response.data.data || []); // Adjust according to the actual response structure
        setShowFlightInfo(true);
      } catch (error) {
        console.error('Error fetching flight data:', error);
        toast.error('Failed to fetch flight data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    handleQueryParams();
  }, [router.query]);

  const handleModify = () => {
    router.push('/flights');
  };

  return (
    <MainLayout>
      <ImageLayout Img_url='/images/f3.png' heading='Book Flight'>
      </ImageLayout>
      <FilterDataBox onclickbtn={handleModify} btn_name="Modify">
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
        !loading && <Loader />
      )}
    </MainLayout>
  );
};

export default FlightInter;
