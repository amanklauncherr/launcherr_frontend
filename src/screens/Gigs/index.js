import React, { useEffect, useState } from 'react';
import axios from 'axios';
import GigsCard from '@/components/GigsCard';
import HomeCrumbs from '@/components/HomeCrumbs';
import ImageLayout from '@/components/ImageLayout';
import MainLayout from '@/components/MainLayout';
import FilterDataBox from '@/components/FilterDataBox';
import { Dropdown, FilterInput } from '@/components/Input/page';
import gigsData from './gigscard.json';
import { useSelector } from 'react-redux';
import { getCookie } from 'cookies-next';

const Gigs = () => {
    const [selectedOption, setSelectedOption] = useState('');
    const [location, setLocation] = useState('');
    const [duration, setDuration] = useState('');
    const [isVerified, setIsVerified] = useState('');
    const [jobsData, setJobsData] = useState([]);
    const [cities, setCities] = useState([]);
    const reduxToken = useSelector((state) => state?.token?.publicToken);


    console.log("cities", cities)
    // Fetch cities from API
    const fetchCities = async () => {
        try {
            const response = await axios.get('https://api.launcherr.co/api/cities');
            setCities(response.data ); // Ensure default to empty array if data is undefined
            console.log("responseCities",response)
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
                default:
                    setDuration('');
                    break;
            }
        } else if (type === 'type') {
            setIsVerified(value === 'Verified' ? '1' : '0');
        }
    };

    const Duration = [
        '0 - 1 hr',
        '1 - 3 hr',
        '3 - 6 hr',
    ];

    const Type = [
        'Verified',
        'All'
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
            const headers = {
                Authorization: `Bearer ${bearerToken}`,
            };

            const response = await axios.get('https://api.launcherr.co/api/searchJob', {
                params: payload,
                headers: headers
            });

            setJobsData(response.data?.job);
        } catch (error) {
            console.error('Error fetching jobs data:', error);
        }
    };

    const handleSearch = () => {
        const payload = {
            location,
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
                    <FilterDataBox
                        onclickbtn={handleSearch}
                        btn_name="Search"
                    >
                        <Dropdown
                            labelFor="Location"
                            options={cities.map(city => city)} // Ensure cities array is populated correctly
                            onChange={(e) => setLocation(e.target.value)}
                        />
                        <Dropdown
                            labelFor="Duration"
                            options={Duration}
                            onChange={(e) => handleDropdownChange(e, 'duration')}
                        />
                        <Dropdown
                            labelFor="Type"
                            options={Type}
                            onChange={(e) => handleDropdownChange(e, 'type')}
                        />
                    </FilterDataBox>
                </ImageLayout>
                <HomeCrumbs>
                    {Array.isArray(jobsData) && jobsData.length > 0 ? (
                        jobsData.map((gigsDataItem, index) => (
                            <GigsCard key={index} {...gigsDataItem} />
                        ))
                    ) : (
                        <p>No jobs available</p>
                    )}
                </HomeCrumbs>
            </MainLayout>
        </>
    );
};

export default Gigs;
