import GigsCard from '@/components/GigsCard'
import HomeCrumbs from '@/components/HomeCrumbs'
import ImageLayout from '@/components/ImageLayout'
import MainLayout from '@/components/MainLayout'
import gigsData from './gigscard.json'
import React, { useState } from 'react'
import FilterDataBox from '@/components/FilterDataBox'
import { Dropdown, FilterInput } from '@/components/Input/page'

const Gigs = () => {
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
                            labelFor="Designation"
                            options={options} 
                            onChange={handleDropdownChange}
                        />
                        <Dropdown
                            labelFor="Job preferences"
                            options={options} 
                            onChange={handleDropdownChange}
                        />
                    </FilterDataBox>
                </ImageLayout>
                <HomeCrumbs>
                    {gigsData.map((gigsDataItem, index) => (
                        <GigsCard
                            key={index}
                            {...gigsDataItem}
                        />
                    ))}
                </HomeCrumbs>
            </MainLayout>
        </>
    )
}

export default Gigs