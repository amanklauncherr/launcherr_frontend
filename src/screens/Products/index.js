import React, { useEffect, useState } from 'react';
import axios from 'axios';
import HomeCrumbs from '@/components/HomeCrumbs';
import ImageLayout from '@/components/ImageLayout';
import MainLayout from '@/components/MainLayout';
import FilterDataBox from '@/components/FilterDataBox';
import { FilterInput } from '@/components/Input/page';
import ProductCard from '@/components/ProductCard';
import Loader from '@/components/Loader';
import styles from './styles.module.css'
import EmptyHotel from '@/components/EmptyHotel';

const Product = () => {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(''); // Store the ID of the selected subcategory
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [fetchedProductData, setFetchedProductData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [loading, setLoading] = useState(false); // Loading state

    const handleCategoryChange = async (event) => {
        const selectedCategorySlug = event.target.value;
        const selectedCategory = categories.find(category => category.slug === selectedCategorySlug);

        if (selectedCategory) {
            console.log("Selected Category ID:", selectedCategory.id);
            setSelectedCategory(selectedCategory.id);
            setSelectedSubCategoryId(''); // Reset subcategory selection
            try {
                const username = 'ck_468f7eb4fc82073df8c1c9515d20562e7dbe37d7';
                const password = 'cs_36993c1a76e77b5c58269bddc4bd3b452319beca';
                const authHeader = 'Basic ' + btoa(`${username}:${password}`);
                const response = await axios.get(`https://ecom.launcherr.co/wp-json/wc/v3/products/categories?per_page=100&parent=${selectedCategory.id}`, {
                    headers: {
                        Authorization: authHeader,
                    },
                });

                setSubCategories(response.data);
                console.log("Subcategories data", response.data);
            } catch (error) {
                console.error('Error fetching subcategories data:', error);
            }
        }
    };


    useEffect(() => {
        const fetchProductData = async () => {
            const username = 'ck_468f7eb4fc82073df8c1c9515d20562e7dbe37d7';
            const password = 'cs_36993c1a76e77b5c58269bddc4bd3b452319beca';
            const authHeader = 'Basic ' + btoa(`${username}:${password}`);

            try {
                const response = await axios.get('https://ecom.launcherr.co/wp-json/wc/v3/products?per_page=100', {
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

    const handleSubCategoryChange = (event) => {
        const selectedSubCategorySlug = event.target.value;
        setSelectedSubCategoryId(selectedSubCategorySlug);

        // Find the subcategory object by slug
        const selectedSubCategory = subCategories.find(sub => sub.slug === selectedSubCategorySlug);

        if (selectedSubCategory) {
            console.log("Selected Subcategory ID:", selectedSubCategory.id);
            setSelectedSubCategoryId(selectedSubCategory.id);
        } else {
            console.log("Selected Subcategory ID not found");
        }
    };

    const handlesearch = async () => {
        setLoading(true); // Set loading to true before API call

        try {
            const username = 'ck_468f7eb4fc82073df8c1c9515d20562e7dbe37d7';
            const password = 'cs_36993c1a76e77b5c58269bddc4bd3b452319beca';
            const authHeader = 'Basic ' + btoa(`${username}:${password}`);

            const response = await axios.get('https://ecom.launcherr.co/wp-json/wc/v3/products?per_page=100', {
                headers: {
                    Authorization: authHeader,
                },
                params: {
                    category: selectedSubCategoryId || selectedCategory,
                    min_price: minPrice,
                    max_price: maxPrice,
                },
            });

            setFetchedProductData(response.data);
            console.log("Search results:", response.data);
        } catch (error) {
            console.error('Error fetching product data:', error);
        } finally {
            setLoading(false); // Set loading to false after API call
        }
    };

    useEffect(() => {
        const fetchCategories = async () => {
            const username = 'ck_468f7eb4fc82073df8c1c9515d20562e7dbe37d7';
            const password = 'cs_36993c1a76e77b5c58269bddc4bd3b452319beca';
            const authHeader = 'Basic ' + btoa(`${username}:${password}`);

            try {
                const response = await axios.get('https://ecom.launcherr.co/wp-json/wc/v3/products/categories', {
                    headers: {
                        Authorization: authHeader,
                    },
                });

                setCategories(response.data.filter(category => category.count > 0)); // Only categories with products
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    const categoryOptions = categories.map(category => ({
        value: category.slug,
        label: category.name,
    }));

    const subCategoryOptions = subCategories.map(subCategory => ({
        value: subCategory.slug,
        label: subCategory.name,
    }));

    return (
        <MainLayout>
            <ImageLayout Img_url='/images/product.png' heading='Products'>
            </ImageLayout>
            <FilterDataBox
                onclickbtn={handlesearch}
                btn_name="Search"
            >
                <Dropdownp
                    labelFor="Category"
                    options={categoryOptions}
                    onChange={handleCategoryChange}
                />
                <FilterInput
                    labelFor="Price Range (Min)"
                    inputType="number"
                    placeholder="Min Price"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                />
                <FilterInput
                    labelFor="Price Range (Max)"
                    inputType="number"
                    placeholder="Max Price"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                />
            </FilterDataBox>
            <HomeCrumbs>
                {loading ? (
                    <Loader /> // Show loader while loading
                ) : fetchedProductData.length > 0 ? (
                    fetchedProductData
                        .filter(productItem => productItem.status !== 'draft') // Filter out products with 'draft' status
                        .map((productItem) => (
                            <ProductCard
                                key={productItem?.id}
                                ProductId={productItem?.id}
                                about={productItem?.name}
                                status={productItem?.status}
                                description={productItem?.description}
                                img_url={productItem?.images?.length > 0 ? productItem.images[0].src : ''}
                                regular_price={productItem.regular_price}
                                amount={productItem.price}
                                average_rating={productItem.average_rating}
                                rating_count={productItem.rating_count}
                                short_description={productItem?.short_description}
                            />
                        ))
                ) : (
                    <>
                        <EmptyHotel />
                    </>
                )}
            </HomeCrumbs>

        </MainLayout>
    );
};

export default Product;

export const Dropdownp = ({ labelFor, options, onChange, disabled }) => (
    <div className={styles['custom-drop']}>
        <label htmlFor={labelFor}>{labelFor}</label>
        <select id={labelFor} onChange={onChange} disabled={disabled}>
            {options.map(option => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    </div>
);
