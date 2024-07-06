import React, { useEffect, useState } from 'react';
import axios from 'axios';
import GigsCard from '@/components/GigsCard';
import HomeCrumbs from '@/components/HomeCrumbs';
import ImageLayout from '@/components/ImageLayout';
import MainLayout from '@/components/MainLayout';
import FilterDataBox from '@/components/FilterDataBox';
import { Dropdown, FilterInput } from '@/components/Input/page';
import gigsData from './gigscard.json';

const Gigs = () => {
    const [selectedOption, setSelectedOption] = useState('');
    const [location, setLocation] = useState('');
    const [duration, setDuration] = useState('');
    const [isVerified, setIsVerified] = useState('');
    const [jobsData, setJobsData] = useState([]);

    const handleDropdownChange = (event, type) => {
        const value = event.target.value;
        if (type === 'duration') {
            setDuration(value);
        } else if (type === 'type') {
            setIsVerified(value === 'Verified');
        }
    };

    const Duration = [
        '1 hr',
        'Less than 1 hr',
        'Less than 2 hr',
        'Less than 3 hr',
        'Less than 4 hr'
    ];

    const Type = [
        'Verified',
        'All'
    ];

    const fetchJobsData = async (payload) => {
        try {
            const response = await axios.post('https://api.launcherr.co/api/showJobs', payload);
            console.log(response);
            setJobsData(response.data?.gigs);
        } catch (error) {
            console.error('Error fetching jobs data:', error);
        }
    };

    const handlesearch = () => {
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
                        onclickbtn={handlesearch}
                        btn_name="Search"
                    >
                        <FilterInput
                            labelFor="Location"
                            inputType="text"
                            placeholder="Prefer Location"
                            value={location}
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
