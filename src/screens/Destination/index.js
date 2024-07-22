import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HomeCrumbs from '@/components/HomeCrumbs';
import ImageLayout from '@/components/ImageLayout';
import MainLayout from '@/components/MainLayout';
import FilterDataBox from '@/components/FilterDataBox';
import { Dropdown, FilterInput } from '@/components/Input/page';
import DestinationCard from '@/components/DestinationCard';

const Destination = () => {
    const [selectedOption, setSelectedOption] = useState('');
    const [location, setLocation] = useState('');
    const [fetchSectionData, setFetchSectionData] = useState();
    const [destinationData, setDestinationData] = useState([]);

    const handleDropdownChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const options = [
        'Software Engineer',
        'UX/UI Designer',
        'Data Analyst',
        'Product Manager',
        'Marketing Specialist',
        'Financial Analyst',
        'Customer Support Representative',
        'HR Manager',
        'Sales Executive',
        'Operations Coordinator'
    ];

    const handleSearch = () => {
        console.log("working");
    };

    useEffect(() => {
        const fetchSectionData = async () => {
          try {
            const response = await axios.get('https://api.launcherr.co/api/Show-Section');
            setFetchSectionData(response.data);
          } catch (error) {
            console.error('Error fetching banner data:', error);
          }
        };
    
        const fetchDestinationData = async () => {
          try {
            const response = await axios.get('https://api.launcherr.co/api/showDestination');
            setDestinationData(response.data.data);
          } catch (error) {
            console.error('Error fetching destination data:', error);
          }
        };
    
        fetchSectionData();
        fetchDestinationData();
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
                            onChange={handleDropdownChange}
                        />
                        <Dropdown
                            labelFor="State"
                            options={options}
                            onChange={handleDropdownChange}
                        />
                        <Dropdown
                            labelFor="City"
                            options={options}
                            onChange={handleDropdownChange}
                        />
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
                <HomeCrumbs
                    // Crumb_About="Featured Escapes"
                    // Crumb_Info={fetchSectionData?.Destination?.heading}
                    // Crumb_Descripton={fetchSectionData?.Destination?.['sub-heading']}
                    // btn_name="VIEW ALL DESTINATIONS"
                    // onClick={handleSearch}
                >
                    {destinationData.map((destinationItem, index) => (
                        <DestinationCard key={index} {...destinationItem} />
                    ))}
                </HomeCrumbs>
            </MainLayout>
        </>
    );
};

export default Destination;
