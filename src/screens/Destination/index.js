import React, { useState } from 'react'
import HomeCrumbs from '@/components/HomeCrumbs'
import ImageLayout from '@/components/ImageLayout'
import MainLayout from '@/components/MainLayout'
import destinationsData from './destinations.json';
import FilterDataBox from '@/components/FilterDataBox'
import { Dropdown, FilterInput } from '@/components/Input/page'
import DestinationCard from '@/components/DestinationCard'

const Destination = () => {
    const [selectedOption, setSelectedOption] = useState('');
    const [location, setLocation] = useState('');

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


    const handlesearch = () => {
        console.log("working")
    }
    return (
        <>
            <MainLayout>
                <ImageLayout Img_url='/images/destination.png' heading='Destination'>
                    <FilterDataBox
                        onclickbtn={handlesearch}
                        btn_name="Search"
                    >
                          <Dropdown
                            labelFor="State"
                            options={options}
                            onChange={handleDropdownChange}
                        />

                        <FilterInput
                            labelFor="Days"
                            inputType="text"
                            placeholder="3 Days"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                        <Dropdown
                            labelFor="Destination Type"
                            options={options}
                            onChange={handleDropdownChange}
                        />
                    </FilterDataBox>
                </ImageLayout>
                <HomeCrumbs>
                    {destinationsData.map((destinationItem, index) => (
                        <DestinationCard
                            key={index}
                            {...destinationItem}
                        />
                    ))}
                </HomeCrumbs>
            </MainLayout>
        </>
    )
}

export default Destination