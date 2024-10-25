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
import EmptyHotel from '@/components/EmptyHotel'
import FlightSearchLaod from '@/components/FlightSearchLaod';
import ModalPopup from '@/components/ModalPopup';
import anim from './anim.json';

const FlightInter = () => {
  const router = useRouter();
  const [showFlightInfo, setShowFlightInfo] = useState(false);
  const [flightInfo, setFlightInfo] = useState([]);
  const [searchKey, setSearchKey] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dataInfo, setDataInfo] = useState();
  const [encryptedToken, setEncryptedToken] = useState('');
  const [encryptedKey, setEncryptedKey] = useState('');
  const [updatedFilter, setUpdatedFilter] = useState();
  const [airlinesCode, setAirlinesCode] = useState();
  const [filtersLocalStored, setFiltersLocalStored] = useState();
  const [searchPayload, setSearchPayload] = useState();
  const [priceFilter, setPriceFilter] = useState();
  const storedFilters = localStorage.getItem('flightFilter');
  const storedSearchingData = localStorage.getItem('formDataSearch');

  console.log("storedFilters", storedFilters?.airlineCode)


  console.log('storedSearchingData', JSON.parse(storedSearchingData))

  useEffect(() => {
    const storedSearchingData = localStorage.getItem('formDataSearch');
    if (storedSearchingData) {
      const searchData = JSON.parse(storedSearchingData);
      setSearchPayload(searchData); // Set the retrieved filters
    }
  }, []);


  useEffect(() => {
    // Retrieve filters from local storage
    const storedFilters = localStorage.getItem('flightFilter');
    if (storedFilters) {
      const parsedFilters = JSON.parse(storedFilters);
      setFiltersLocalStored(parsedFilters); // Set the retrieved filters
    }
  }, []);

  console.log("filtersLocalStored", filtersLocalStored)

  const formatDate = (date) => {
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const day = String(d.getDate()).padStart(2, '0');
    const year = d.getFullYear();
    return `${month}/${day}/${year}`;
  };



  // Function to get encrypted credentials
  const getEncryptedCredentials = async () => {
    try {
      const response = await axios.get('https://api.launcherr.co/api/AES/Encryption');
      setEncryptedToken(response.data.encrypted_token);
      setEncryptedKey(response.data.encrypted_key);
    } catch (error) {
      console.error('Error encrypting credentials:', error);
      toast.error('Error fetching encrypted credentials.');
    }
  };

  // Function to handle fetching of flight data
  const fetchFlightData = async () => {
    if (!encryptedToken || !encryptedKey) return; // Ensure credentials are available before making the request

    setLoading(true);

    // Prepare the API payload
    const payload = {
      "headersToken": encryptedToken,
      "headersKey": encryptedKey,
      "travelType": searchPayload.travelType,
      "TYPE": searchPayload.TYPE,
      "tripInfo": searchPayload.tripInfo,
      "adultCount": searchPayload.adultCount,
      "childCount": searchPayload.childCount,
      "infantCount": searchPayload.infantCount,
      "airlineCode": searchPayload.airlineCode,
      "Stops": filtersLocalStored?.stops || "",
      "Price": filtersLocalStored?.maxPrice || "",
      "classOfTravel": searchPayload.classOfTravel,
      "Refundable": "",
      "airlineCode": filtersLocalStored?.airlineCode || "",
      "Arrival": filtersLocalStored?.arrivalTimes || "",
    };

    try {
      const response = await axios.post(
        'https://api.launcherr.co/api/Search/Flight',
        payload
      );
      setFlightInfo(response.data?.payloads?.data?.tripDetails || []);
      setSearchKey(response.data?.SearchKey)
      setAirlinesCode(response.data?.AirlineCodes)
      setPriceFilter(response.data)
      setShowFlightInfo(true);
      console.log("searchdata", response)
      if(response.data.success === false){
        setModalOpen(true)
      }
    } catch (error) {
      console.error('Error fetching flight data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // First hit on page load
    const init = async () => {
      await getEncryptedCredentials(); // Get encrypted credentials immediately
    };

    init();
  }, []);

  useEffect(() => {
    if (encryptedToken && encryptedKey) {
      fetchFlightData(); // Only call this after credentials are set
    }
  }, [encryptedToken, encryptedKey, router.query]);

  useEffect(() => {
    // Set up 5-minute delayed hit
    const fiveMinuteTimeout = setTimeout(async () => {
      await getEncryptedCredentials(); // Re-fetch credentials after 5 minutes
    }, 300000); // 300,000 milliseconds = 5 minutes

    // Cleanup timeout if component unmounts
    return () => clearTimeout(fiveMinuteTimeout);
  }, []);

  const handleModify = () => {
    router.push('/flights');
  };

  const [filters, setFilters] = useState({
    priceRange: [3806, 18661], // Ensure this is always defined
    refundable: false,
    nonRefundable: false,
    stopOptions: {
      nonStop: false,
      oneStop: false,
    },
    departureTimes: [],
    arrivalTimes: [],
    airlines: {
      airIndia: false,
      airIndiaExpress: false,
      akasaAir: false,
      indigo: false,
      spicejet: false,
      vistara: false,
    },
  });

  const updateFilters = (updatedFilters) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...updatedFilters,
    }));
    // console.log("Updated Filters:", { ...filters, ...updatedFilters });

    setUpdatedFilter({ ...filters, ...updatedFilters })
  };


  console.log("updatedFilter")



  const handleCloseModal = () => {
    localStorage.removeItem('flightFilter');
    setModalOpen(false);
    window.location.href = "/flights";
  };

  return (
    <MainLayout>
    {loading && (!priceFilter || priceFilter?.success === false) && <FlightSearchLaod />}
      {!loading && showFlightInfo && flightInfo.length > 0 && (
        <>
          <ImageLayout Img_url='/images/f3.png'>
            <FilterDataBox onclickbtn={handleModify} btn_name='Modify'>
              <div className={styles['modify-filter-inner']}>
                {/* Render the search payload data */}
                {searchPayload ? (
                  <>
                    {/* Mapping tripInfo data */}
                    {searchPayload.tripInfo && searchPayload.tripInfo.length > 0 && (
                      <div>
                        {searchPayload.tripInfo.map((trip, index) => (
                          <div key={index} className={styles['trip-info']}>
                            <div className={styles["trip-info-inner-container"]}>
                              <span>
                                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M9.78975 8.68421L6 15L4.5 15L6.3945 8.68421L2.3745 8.68421L1.125 11.0526L7.08967e-07 11.0526L0.750001 7.5L1.01955e-06 3.94737L1.125 3.94737L2.37525 6.31579L6.39525 6.31579L4.5 -4.5897e-07L6 -3.93402e-07L9.78975 6.31579L13.875 6.31579C14.1734 6.31579 14.4595 6.44055 14.6705 6.66264C14.8815 6.88472 15 7.18593 15 7.5C15 7.81407 14.8815 8.11528 14.6705 8.33736C14.4595 8.55945 14.1734 8.68421 13.875 8.68421L9.78975 8.68421Z" fill="#8587DF" />
                                </svg>
                                <strong>From:</strong>
                              </span>
                              <p>{trip.origin}</p>
                            </div>
                            <div className={styles["trip-info-inner-container"]}>
                              <span>
                                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M9.78975 8.68421L6 15L4.5 15L6.3945 8.68421L2.3745 8.68421L1.125 11.0526L7.08967e-07 11.0526L0.750001 7.5L1.01955e-06 3.94737L1.125 3.94737L2.37525 6.31579L6.39525 6.31579L4.5 -4.5897e-07L6 -3.93402e-07L9.78975 6.31579L13.875 6.31579C14.1734 6.31579 14.4595 6.44055 14.6705 6.66264C14.8815 6.88472 15 7.18593 15 7.5C15 7.81407 14.8815 8.11528 14.6705 8.33736C14.4595 8.55945 14.1734 8.68421 13.875 8.68421L9.78975 8.68421Z" fill="#8587DF" />
                                </svg>
                                <strong>To:</strong>
                              </span>
                              <p> {trip.destination}</p>
                            </div>
                            <div className={styles["trip-info-inner-container"]}>
                              <span>
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M0 5.73684C0 4.2479 -4.70563e-08 3.50421 0.462632 3.04158C0.925263 2.57895 1.66895 2.57895 3.15789 2.57895H12.6316C14.1205 2.57895 14.8642 2.57895 15.3268 3.04158C15.7895 3.50421 15.7895 4.2479 15.7895 5.73684C15.7895 6.10869 15.7895 6.295 15.6742 6.41105C15.5582 6.52632 15.3711 6.52632 15 6.52632H0.789474C0.417632 6.52632 0.231316 6.52632 0.115263 6.41105C-7.05844e-08 6.295 0 6.1079 0 5.73684ZM0 12.8421C0 14.3311 -4.70563e-08 15.0747 0.462632 15.5374C0.925263 16 1.66895 16 3.15789 16H12.6316C14.1205 16 14.8642 16 15.3268 15.5374C15.7895 15.0747 15.7895 14.3311 15.7895 12.8421V8.89474C15.7895 8.5229 15.7895 8.33658 15.6742 8.22053C15.5582 8.10526 15.3711 8.10526 15 8.10526H0.789474C0.417632 8.10526 0.231316 8.10526 0.115263 8.22053C-7.05844e-08 8.33658 0 8.52369 0 8.89474V12.8421Z" fill="#8587DF" />
                                  <path d="M3.94739 1V3.36842ZM11.8421 1V3.36842Z" fill="#8587DF" />
                                  <path d="M3.94739 1V3.36842M11.8421 1V3.36842" stroke="#8587DF" stroke-width="2" stroke-linecap="round" />
                                </svg>
                                <strong>Date:</strong>
                              </span>
                              <p>{trip.travelDate}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Display other search details */}
                    <div className={styles['additional-info']}>
                      <p><strong>Travel Type:</strong> {searchPayload.TYPE}</p>
                      <p><strong>Adult Count:</strong> {searchPayload.adultCount}</p>
                      <p><strong>Child Count:</strong> {searchPayload.childCount}</p>
                      <p><strong>Infant Count:</strong> {searchPayload.infantCount}</p>
                      <p><strong>Class of Travel:</strong> {searchPayload.classOfTravel === '0' ? 'Economy' : 'Business'}</p>
                    </div>
                  </>
                ) : (
                  <p>No search data found.</p>
                )}
              </div>
            </FilterDataBox>
          </ImageLayout>
          <div className={styles['flex-sidebar-body']}>
            <FilterSidebar priceFilter={priceFilter} airlinesCode={airlinesCode} filters={filters} onUpdateFilters={updateFilters} />
            <div className={styles['showing-flights-main-container']}>
              {showFlightInfo && flightInfo.length > 0 ? (
                flightInfo.map((flight, index) => (
                  <FlightCard key={index} flightData={flight} searchKey={searchKey} filterData={updatedFilter} />
                ))
              ) : (
                <>
                  <EmptyHotel />
                </>
              )}
            </div>
          </div>
        </>
      )}

      {isModalOpen && (
        <ModalPopup
          Mainmessage="No Data Found"
          onClick={handleCloseModal}
          mylottiJson={anim}
          Submessage="Please search again"
          btnName="Click here"
        />
      )}
    </MainLayout>
  );
};

export default FlightInter;

