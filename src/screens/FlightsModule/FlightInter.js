import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import MainLayout from '@/components/MainLayout';
import Loader from '@/components/Loader';
import toast from 'react-hot-toast';
import styles from './flights.module.css';
import ImageLayout from '@/components/ImageLayout';
import FilterDataBox from '@/components/FilterDataBox';
import FilterSidebar from './FilterSidebar/index';
import axios from 'axios';
import FlightCard from './FlightCard'; // Import the FlightCard component
import FlightInterInfo from './FlightInterInfo'

const FlightInter = () => {
  const [showFlightInfo, setShowFlightInfo] = useState(false);
  const [flightInfo, setFlightInfo] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataInfo, setDataInfo] = useState();
  const router = useRouter();

  const formatDate = (date) => {
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const day = String(d.getDate()).padStart(2, '0');
    const year = d.getFullYear();
    return `${month}/${day}/${year}`;
  };
  
  useEffect(() => {
    const handleQueryParams = async () => {
      const { query } = router;
  
      // Check if required parameters are present
      if (!query.flyingFrom || !query.flyingTo || !query.departureDate) {
        toast.error("Please provide origin, destination, and departure date.");
        return;
      }
  
      // Prepare the search parameters from the query
      const searchParams = {
        origin: query.flyingFrom,
        destination: query.flyingTo,
        travelDate: formatDate(query.departureDate), // Format travel date
        returnDate: query.returnDate ? formatDate(query.returnDate) : null, // Format return date if exists
        adultCount: query.adult || '1',
        childCount: query.child || '0',
        infantCount: query.infant || '0',
        classOfTravel: query.cabin === 'Business' ? '1' : (query.cabin === 'First' ? '2' : (query.cabin === 'Premium Economy' ? '3' : '0')), // Default to Economy
        tripType: query.tripType || 'OneWay', // Default to OneWay
      };
  
      setDataInfo(searchParams);
      setLoading(true);
  
      // Determine booking type
      const validBookingType = searchParams.tripType === 'roundTrip' ? '1' : '0'; // 0 for one-way, 1 for round-trip
      const validClassOfTravel = searchParams.classOfTravel; // Ensure this is valid based on API documentation
  
      // Prepare the API payload
      const payload = {
        deviceInfo: {
          ip: "143.244.130.59", // This can be dynamic if needed
          imeiNumber: "12384659878976879888",
        },
        travelType: "0", // Assuming domestic flight as default (use "1" for international)
        bookingType: validBookingType, // Set based on trip type
        tripInfo: {
          origin: searchParams.origin,
          destination: searchParams.destination,
          travelDate: searchParams.travelDate, // Ensure it's in MM/DD/YYYY format
          tripId: validBookingType === '1' ? "1" : "0", // Set tripId based on trip type
        },
        adultCount: searchParams.adultCount,
        childCount: searchParams.childCount,
        infantCount: searchParams.infantCount,
        classOfTravel: validClassOfTravel, // Use validated class of travel
        filteredAirLine: {
          airlineCode: "", // Empty as no specific airline filter applied
        },
      };
  
      console.log("API Payload:", payload);
  
      try {
        const response = await axios.post(
          'https://api.dotmik.in/api/flightBooking/v1/searchFlight',
          payload,
          {
            headers: {
              'D-SECRET-TOKEN': 'ISUF5xHOG9deYZiLg+EdI1rKeWoxl789kHpIrlIB/GvKNaRlA0QRkEZlhDzZHJj7',
              'D-SECRET-KEY': '6z8dyiN2dO3RUUXGxn7ULGkSnGFxNDbKrjJquVZ0TkaYoJiJYBdu/lMG2t1Nm278',
              'CROP-CODE': 'DOTMIK160614',
              'Content-Type': 'application/json',
            },
          }
        );
  
        setFlightInfo(response.data?.payloads?.data?.tripDetails || []);
        console.log("datatatatatt",response.data?.payloads?.data?.tripDetails)
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
                <p><strong>Flying From:</strong> <br /><br /> {dataInfo?.origin}</p>
                <p><strong>Flying To:</strong> <br /><br /> {dataInfo?.destination}</p>
                <p><strong>Departure Date:</strong> <br /><br /> {dataInfo?.travelDate}</p>
                {dataInfo?.returnDate && <p><strong>Return Date:</strong> <br /><br /> {dataInfo?.returnDate}</p>}
                <p><strong>Passenger Class:</strong> <br /><br /> {dataInfo?.classOfTravel}</p>
              </div>
            </FilterDataBox>
          </ImageLayout>
          <div className={styles["flex-sidebar-body"]}>
            <FilterSidebar />
            <div className={styles["showing-flights-main-container"]}>
              {showFlightInfo && flightInfo.length > 0 ? (
                flightInfo.map((flight, index) => (
                  <FlightCard key={index} flightData={flight} />
                ))
              ) : (
                <p>No flights found.</p>
              )}
            </div>
          </div>
        </>
      )}
    </MainLayout>
  );
};

export default FlightInter;
