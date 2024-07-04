import GigsCard from '@/components/GigsCard'
import HomeCrumbs from '@/components/HomeCrumbs'
import ImageLayout from '@/components/ImageLayout'
import MainLayout from '@/components/MainLayout'
import productData from './productdata.json'
import React, { useEffect, useState } from 'react'
import FilterDataBox from '@/components/FilterDataBox'
import { Dropdown, FilterInput } from '@/components/Input/page'
import ProductCard from '@/components/ProductCard'
import axios from 'axios'

const Product = () => {
    const [selectedOption, setSelectedOption] = useState('');
    const [location, setLocation] = useState('');
    const [fetchedProductData, setFetchedProductData] = useState([]);

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


  useEffect(() => {
    const fetchProductData = async () => {
      const username = 'ck_6bb70a9f0bf5f7720abf3d92282cdce995be668f';
      const password = 'cs_3e03a099590d88aa0061e8896195e6f515f7d6ba';
      const authHeader = 'Basic ' + btoa(`${username}:${password}`);

      try {
        const response = await axios.get('https://ecom.launcherr.co/wp-json/wc/v1/products', {
          headers: {
            Authorization: authHeader,
          },
        });
        setFetchedProductData(response.data);
        console.log("product ka data",response.data)
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    };

    fetchProductData();
  }, []);
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
                {fetchedProductData.length > 0 ? (
            fetchedProductData.map((productItem, index) => (
              <ProductCard 
              key={productItem.id}
              about={productItem.name}
              description={productItem.description}
              img_url={productItem.images.length > 0 ? productItem.images[0].src : ''}
              regular_price={productItem.regular_price}
              amount={productItem.price}
              average_rating={productItem.average_rating}
              rating_count={productItem.rating_count}
              />
            ))
          ) : (
            <p>No products available</p>
          )}
                </HomeCrumbs>
            </MainLayout>
        </>
    )
}

export default Product