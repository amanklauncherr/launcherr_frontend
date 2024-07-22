import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HomeCrumbs from '@/components/HomeCrumbs';
import ImageLayout from '@/components/ImageLayout';
import MainLayout from '@/components/MainLayout';
import FilterDataBox from '@/components/FilterDataBox';
import { Dropdown } from '@/components/Input/page';
import DestinationCard from '@/components/DestinationCard';
import Loader from '@/components/Loader';  // Import your Loader component
import { Router } from 'next/router';

const Destination = () => {
    const [selectedOption, setSelectedOption] = useState({
        destination_type: '',
        state: '',
    });
    const [location, setLocation] = useState('');
    const [fetchSectionData, setFetchSectionData] = useState();
    const [destinationData, setDestinationData] = useState([]);
    const [loading, setLoading] = useState(false);  // Add loading state

    const handleDropdownChange = (key) => (event) => {
        setSelectedOption((prevState) => ({
            ...prevState,
            [key]: event.target.value,
        }));
    };

    const options = [
        'Mountain',
        'Trails',
        'Waterfall',
        'Beach',
    ];

    const state_data = [
        'Himachal Pradesh',
        'Uttarakhand'
    ];

    const handleSearch = async () => {
        setLoading(true);  // Start loading
        try {
            const response = await axios.post('https://api.launcherr.co/api/searchDestination', {
                state: selectedOption.state,
                destination_type: selectedOption.destination_type,
            });
            setDestinationData(response?.data?.Destination || []);
            console.log(response?.data?.Destination);
        } catch (error) {
            console.error('Error fetching destination data:', error);
        } finally {
            setLoading(false);  // End loading
        }
    };

    useEffect(() => {
        const fetchSectionData = async () => {
            setLoading(true);  // Start loading
            try {
                const response = await axios.get('https://api.launcherr.co/api/Show-Section');
                setFetchSectionData(response.data);
            } catch (error) {
                console.error('Error fetching banner data:', error);
            } finally {
                setLoading(false);  // End loading
            }
        };

        fetchSectionData();
    }, []);

    
    return (
        <>
            <MainLayout>
                <ImageLayout Img_url='/images/destination.png' heading='Destination'>
                    <FilterDataBox
                        onclickbtn={handleSearch}
                        btn_name="Search"
                    >
                        <Dropdown
                            labelFor="Destination Type"
                            options={options}
                            onChange={handleDropdownChange('destination_type')}
                        />
                        <Dropdown
                            labelFor="State"
                            options={state_data}
                            onChange={handleDropdownChange('state')}
                        />
                        {/* <Dropdown
                            labelFor="City"
                            options={options}
                            onChange={handleDropdownChange}
                        /> */}
                        {/* <FilterInput
                            labelFor="Days"
                            inputType="text"
                            placeholder="3 Days"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                        <FilterInput
                            labelFor="Budget"
                            inputType="text"
                            placeholder="2000"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        /> */}
                    </FilterDataBox>
                </ImageLayout>
                {loading ? (
                    <Loader />  // Show Loader component when loading
                ) : (
                    <HomeCrumbs
                        // Crumb_About="Featured Escapes"
                        // Crumb_Info={fetchSectionData?.Destination?.heading}
                        // Crumb_Descripton={fetchSectionData?.Destination?.['sub-heading']}
                        // btn_name="VIEW ALL DESTINATIONS"
                        // onClick={handleSearch}
                    >
                        {destinationData.length > 0 ? (
                            destinationData.map((destinationItem, index) => (
                                <DestinationCard  key={index} {...destinationItem} />
                            ))
                        ) : (
                            <p>No destinations found.</p>
                        )}
                    </HomeCrumbs>
                )}
            </MainLayout>
        </>
    );
};

export default Destination;
