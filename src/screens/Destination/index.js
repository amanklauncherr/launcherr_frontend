import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HomeCrumbs from '@/components/HomeCrumbs';
import ImageLayout from '@/components/ImageLayout';
import MainLayout from '@/components/MainLayout';
import FilterDataBox from '@/components/FilterDataBox';
import { Dropdown } from '@/components/Input/page';
import DestinationCard from '@/components/DestinationCard';
import Loader from '@/components/Loader';  // Import your Loader component
import EmptyHotel from '@/components/EmptyHotel';

const Destination = () => {
    const [selectedOption, setSelectedOption] = useState({
        destination_type: 'Mountain',
        state: '',
    });
    const [location, setLocation] = useState('');
    const [fetchSectionData, setFetchSectionData] = useState();
    const [destinationData, setDestinationData] = useState([]);
    const [loading, setLoading] = useState(false);  // Add loading state
    const [error, setError] = useState(false);  // Add error state

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
        setError(false); // Reset error state
        try {
            const response = await axios.post('https://api.launcherr.co/api/searchDestination', {
                state: selectedOption.state,
                destination_type: selectedOption.destination_type,
            });
            console.log('API Response:', response?.data?.Destination);
            setDestinationData(response?.data?.Destination || []);
        } catch (error) {
            console.error('Error fetching destination data:', error);
            setError(true);  // Set error state to true
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
                setError(true);  // Set error state to true
            } finally {
                setLoading(false);  // End loading
            }
        };

        fetchSectionData();
        handleSearch();  // Call handleSearch on component mount to load default data
    }, []);

    console.log('Destination Data:', destinationData);
    console.log('Error:', error);

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
                    </FilterDataBox>
                </ImageLayout>
                {loading ? (
                    <Loader />  // Show Loader component when loading
                ) : (
                    <HomeCrumbs>
                        {destinationData.length > 0 && !error ? (
                            destinationData.map((destinationItem, index) => (
                                <DestinationCard key={index} {...destinationItem} />
                            ))
                        ) : (
                            <EmptyHotel/>
                        )}
                    </HomeCrumbs>
                )}
            </MainLayout>
        </>
    );
};

export default Destination;
