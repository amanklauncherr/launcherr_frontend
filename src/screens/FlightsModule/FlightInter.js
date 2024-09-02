import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import FlightInterInfo from '@/screens/FlightsModule/FlightInterInfo';
import MainLayout from '@/components/MainLayout';
import Loader from '@/components/Loader';
import toast from 'react-hot-toast';
import styles from './flights.module.css';
import ImageLayout from '@/components/ImageLayout';
import FilterDataBox from '@/components/FilterDataBox';
import FilterSidebar from './FilterSidebar/index';
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
        flyingFrom: query.flyingFrom,
        flyingTo: query.flyingTo,
        departureDate: query.departureDate,
        returnDate: query.returnDate,
        passengerClass: query.cabin,
        directOnly: query.directOnly,
        currency: query.currency,
        AdultCount: query.adult,
        ChildCount: query.child,
        InfantCount: query.infant,
        JourneyType: query.tripType,
      };

      setDataInfo(searchParams);
      setLoading(true);

      const payload = {
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
      };

      // Log the payload
      console.log("API Payload:", payload);

      try {
        const response = await axios.post(
          'https://api-partner.niyoin.com/api/v1/partner/bookings/flight/search',
          payload,
          {
            headers: {
              'x-api-key': '8373f858b7c8afd533497e7c870911ec',
              'request-token': '12345678',
              'Content-Type': 'application/json',
            },
          }
        );

        setFlightInfo(response.data.data.Search.FlightDataList.JourneyList || []); // Adjust according to the actual response structure
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
      {loading && <Loader />}
      {!loading && (
        <>
          <ImageLayout Img_url='/images/f3.png'>
            <FilterDataBox onclickbtn={handleModify} btn_name="Modify">
              <div className={styles["modify-filter-inner"]}>
                <p><strong>Flying From:</strong> <br /><br /> {dataInfo?.flyingFrom}</p>
                <p><strong>Flying To:</strong> <br /><br /> {dataInfo?.flyingTo}</p>
                <p><strong>Departure Date:</strong> <br /><br /> {dataInfo?.departureDate}</p>
                {dataInfo?.returnDate && <p><strong>Return Date:</strong> <br /><br /> {dataInfo?.returnDate}</p>}
                <p><strong>Passenger Class:</strong> <br /><br /> {dataInfo?.passengerClass}</p>
                <p><strong>Direct Only:</strong> <br /><br /> {dataInfo?.directOnly ? 'Yes' : 'No'}</p>
                <p><strong>Currency:</strong> <br /><br /> {dataInfo?.currency}</p>
              </div>
            </FilterDataBox>
          </ImageLayout>
          <div className={styles["flex-sidebar-body"]}>
            <FilterSidebar />
            {showFlightInfo && flightInfo.length > 0 ? (
              <div className={styles["showing-flights-main-container"]}>
                {flightInfo.map((journey, index) => (
                  journey.map((flight, flightIndex) => (
                    <FlightInterInfo
                      key={`${index}-${flightIndex}`}
                      flightDetails={flight.FlightDetails.Details[0][0]}
                      price={flight.Price}
                      attributes={flight.Attr}
                      resultToken={flight.ResultToken}
                    />
                  ))
                ))}
              </div>
            ) : (
              !loading && <Loader />
            )}
          </div>
        </>
      )}
    </MainLayout>
  );
};

export default FlightInter;
