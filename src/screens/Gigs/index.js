import React, { useEffect, useState } from 'react';
import axios from 'axios';
import GigsCard from '@/components/GigsCard';
import HomeCrumbs from '@/components/HomeCrumbs';
import ImageLayout from '@/components/ImageLayout';
import MainLayout from '@/components/MainLayout';
import FilterDataBox from '@/components/FilterDataBox';
import Select from 'react-select';
import { useSelector } from 'react-redux';
import { getCookie } from 'cookies-next';
import Loader from '@/components/Loader';
import EmptyHotel from '@/components/EmptyHotel';
import toast from 'react-hot-toast';

const Gigs = () => {
    const [selectedOption, setSelectedOption] = useState(null);
    const [location, setLocation] = useState('');
    const [duration, setDuration] = useState('');
    const [isVerified, setIsVerified] = useState('');
    const [jobsData, setJobsData] = useState([]);
    const [cities, setCities] = useState([]);
    const [error, setError] = useState(null); // Error state
    const [loading, setLoading] = useState(false); // Loading state
    const reduxToken = useSelector((state) => state?.token?.publicToken);
    
    
    const fetchCities = async () => {
        try {
            const response = await axios.get('https://api.launcherr.co/api/cities');
            const citiesOptions = response.data.map(city => ({
                value: city,
                label: city,
            }));
            setCities(citiesOptions);
        } catch (error) {
            console.error('Error fetching cities:', error);
        }
    };

    useEffect(() => {
        fetchCities();
    }, []);

    const handleDropdownChange = (event, type) => {
        const value = event.target.value;
        if (type === 'duration') {
            switch (value) {
                case '0 - 1 hr':
                    setDuration('1');
                    break;
                case '1 - 3 hr':
                    setDuration('3');
                    break;
                case '3 - 6 hr':
                    setDuration('6');
                    break;
                case 'More than 6 hr':
                    setDuration('40');
                    break;
                default:
                    setDuration('');
                    break;
            }
        } else if (type === 'type') {
            setIsVerified(value === 'Verified' ? '1' : '0');
        }
    };

    const Duration = [
        { value: '0 - 1 hr', label: '0 - 1 hr' },
        { value: '1 - 3 hr', label: '1 - 3 hr' },
        { value: '3 - 6 hr', label: '3 - 6 hr' },
        { value: 'More than 6 hr', label: 'More than 6 hr' },
    ];

    const Type = [
        { value: 'Verified', label: 'Verified' },
        { value: 'All', label: 'All' }
    ];

    let bearerToken = '';
    const cookiesToken = getCookie('auth_token');

    if (cookiesToken) {
        bearerToken = cookiesToken;
    } else {
        bearerToken = reduxToken;
    }

    const fetchJobsData = async (payload) => {
        try {
            setLoading(true); // Set loading state to true
            setError(null); // Reset error state
            const headers = {
                Authorization: `Bearer ${bearerToken}`,
            };

            const response = await axios.get('https://api.launcherr.co/api/searchJob', {
                params: payload,
                headers: headers
            });

            const jobs = response.data?.job;

            if (!jobs || jobs.length === 0) {
                setError('No data found');
            } else {
                setJobsData(jobs);
            }
        } catch (error) {
            console.log('Error fetching jobs data:', error);
            setError('Error fetching data'); // Set error state
            toast.error(error?.response?.data?.message)
        } finally {
            setLoading(false); // Set loading state to false
        }
    };

    const handleSearch = () => {
        const payload = {
            location: selectedOption?.value,
            duration,
            isVerified
        };
        fetchJobsData(payload);
    };

    useEffect(() => {
        fetchJobsData({});
    }, []);

    return (
        <>
            <MainLayout>
                <ImageLayout Img_url='/images/gigsimg.png' heading='GIGS'>
                </ImageLayout>
                    <FilterDataBox
                        onclickbtn={handleSearch}
                        btn_name="Search"
                    >
                        <Select
                            options={cities}
                            onChange={setSelectedOption}
                            placeholder="Select or type a location"
                        />
                        <Select
                            options={Duration}
                            onChange={(option) => handleDropdownChange({ target: { value: option.value } }, 'duration')}
                            placeholder="Select duration"
                        />
                        <Select
                            options={Type}
                            onChange={(option) => handleDropdownChange({ target: { value: option.value } }, 'type')}
                            placeholder="Select type"
                        />
                    </FilterDataBox>
                <HomeCrumbs>
                    {loading ? (
                        <Loader /> // Show loader while loading
                    ) : error ? (
                        <div>{error}</div> // Display error message
                    ) : (
                        Array.isArray(jobsData) && jobsData.length > 0 ? (
                            jobsData.map((gigsDataItem, index) => (
                                <GigsCard key={index} {...gigsDataItem} />
                            ))
                        ) : (
                          <EmptyHotel/>
                        )
                    )}
                </HomeCrumbs>
            </MainLayout>
        </>
    );
};

export default Gigs;
