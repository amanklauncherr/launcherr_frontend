import GigsCard from '@/components/GigsCard'
import HomeCrumbs from '@/components/HomeCrumbs'
import ImageLayout from '@/components/ImageLayout'
import MainLayout from '@/components/MainLayout'
import productData from './productdata.json'
import React, { useState } from 'react'
import FilterDataBox from '@/components/FilterDataBox'
import { Dropdown, FilterInput } from '@/components/Input/page'
import ProductCard from '@/components/ProductCard'

const Product = () => {
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
                <ImageLayout Img_url='/images/product.png' heading='Products'>
                     <FilterDataBox
                    onclickbtn={handlesearch}
                    btn_name="Search"
                    >
                              <Dropdown
                            labelFor="Categary"
                            options={options} 
                            onChange={handleDropdownChange}
                        />
                        <FilterInput
                            labelFor="Price Range"
                            inputType="text"
                            placeholder="200 - 2000"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                        <Dropdown
                            labelFor="Brand"
                            options={options} 
                            onChange={handleDropdownChange}
                        />
                            <FilterInput
                            labelFor="Availability"
                            inputType="text"
                            placeholder="pin code"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                    </FilterDataBox> 
                </ImageLayout>
                <HomeCrumbs>
                    {productData.map((productDataItem, index) => (
                        <ProductCard
                            key={index}
                            {...productDataItem}
                        />
                    ))}
                </HomeCrumbs>
            </MainLayout>
        </>
    )
}

export default Product