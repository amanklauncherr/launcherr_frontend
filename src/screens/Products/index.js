import React, { useEffect, useState } from 'react';
import axios from 'axios';
import GigsCard from '@/components/GigsCard';
import HomeCrumbs from '@/components/HomeCrumbs';
import ImageLayout from '@/components/ImageLayout';
import MainLayout from '@/components/MainLayout';
import FilterDataBox from '@/components/FilterDataBox';
import { Dropdown, FilterInput } from '@/components/Input/page';
import ProductCard from '@/components/ProductCard';
import productData from './productdata.json';

const Product = () => {
    const [selectedOption, setSelectedOption] = useState('');
    const [location, setLocation] = useState('');
    const [fetchedProductData, setFetchedProductData] = useState([]);

    console.log(fetchedProductData,"fetchedProductData")

    const handleDropdownChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const options = [
      
    ];

    const handlesearch = () => {
        console.log("working");
    };

    useEffect(() => {
        const fetchProductData = async () => {
          const username = 'ck_468f7eb4fc82073df8c1c9515d20562e7dbe37d7';
          const password = 'cs_36993c1a76e77b5c58269bddc4bd3b452319beca';
            const authHeader = 'Basic ' + btoa(`${username}:${password}`);

            try {
                const response = await axios.get('https://ecom.launcherr.co/wp-json/wc/v1/products', {
                    headers: {
                        Authorization: authHeader,
                    },
                });
                setFetchedProductData(response.data);
                console.log("product ka datadfedfd", response.data);
            } catch (error) {
                console.error('Error fetching product data:', error);
            }
        };

        fetchProductData();
    }, []);

    return (
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
                     <Dropdown
                        labelFor="Sub categary"
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
                    fetchedProductData.map((productItem) => (
                        <ProductCard 
                            key={productItem.id}
                            ProductId={productItem.id}
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
    );
};

export default Product;
