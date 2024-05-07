import React, { useState } from 'react'
import HomeCrumbs from '@/components/HomeCrumbs'
import ImageLayout from '@/components/ImageLayout'
import MainLayout from '@/components/MainLayout'
import FilterDataBox from '@/components/FilterDataBox'
import offerData from './offers.json'
import { Dropdown, FilterInput } from '@/components/Input/page'
import OfferCard from '@/components/OfferCard.js';

const TravelOffer = () => {
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
                <ImageLayout Img_url='/images/deals.png' heading='Travell Offers'>
                    <FilterDataBox
                        onclickbtn={handlesearch}
                        btn_name="Search"
                    >

                        <FilterInput
                            labelFor="Search Destination"
                            inputType="text"
                            placeholder="Enter Destination"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />

                        <FilterInput
                            labelFor="People"
                            inputType="text"
                            placeholder="No. of People"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />


                        <FilterInput
                            labelFor="From Date"
                            inputType="date"
                            // placeholder="No. of People"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />

                        <FilterInput
                            labelFor="To Date"
                            inputType="date"
                            // placeholder="No. of People"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />

                    </FilterDataBox>
                </ImageLayout>
                <HomeCrumbs>
                    {offerData.map((offerDataItem, index) => (
                        <OfferCard
                            key={index}
                            {...offerDataItem}
                        />
                    ))}
                </HomeCrumbs>
            </MainLayout>
        </>
    )
}

export default TravelOffer