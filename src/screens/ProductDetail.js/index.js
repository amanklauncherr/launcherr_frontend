import ImageLayout from '@/components/ImageLayout';
import MainLayout from '@/components/MainLayout';
import React, { useEffect, useState } from 'react';
import styles from './book.module.css';
import CustomCarousel from '@/components/CustomCarousel';
import { useRouter } from 'next/router';
import axios from 'axios';
import { getCookie } from 'cookies-next';
import { useSelector } from 'react-redux';
import Loader from '@/components/Loader';
import toast from 'react-hot-toast';

const ProductDetail = () => {
    const router = useRouter();
    const { id } = router.query;
    const [fetchedProductData, setFetchedProductData] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState(''); // State to manage selected size

    // Assuming you have a Redux setup for the token
    const reduxToken = useSelector((state) => state?.auth?.token);

    const handleSizeChange = (e) => {
        const selectedOption = e.target.value;
        setSelectedSize(selectedOption);

        // Find the index of the selected option in the options array
        const selectedIndex = fetchedProductData.attributes[0].options.indexOf(selectedOption);

        // Use the index to find the corresponding variation ID
        if (selectedIndex !== -1) {
            const selectedVariationId = fetchedProductData.variations[selectedIndex];
            // console.log('Selected Variation ID:', selectedVariationId);
            router.push(`/product-detail?id=${selectedVariationId}`);

        } else {
            console.log('No variation found for selected size.');
        }
    };

    const handleCart = async () => {
        let bearerToken = '';
        const cookiesToken = getCookie('auth_token');
        bearerToken = cookiesToken ? cookiesToken : reduxToken;

        const headers = {
            Authorization: `Bearer ${bearerToken}`,
        };

        const data = {
            product_id: id,
            product_name: fetchedProductData.name,
            quantity: quantity,
            price: fetchedProductData.price,
            size: selectedSize // Add selected size to the cart data
        };

        try {
            const response = await axios.post('https://api.launcherr.co/api/updateCart', data, { headers });
            console.log('Cart update response:', response.data);
            router.push('/cart');
        } catch (error) {
            const err = error.response.data.error;
            if (err === 'Unauthorized') {
                toast.error('Please login');
            }
        }
    };

    useEffect(() => {
        if (id) {
            const fetchProductData = async () => {
                const username = 'ck_468f7eb4fc82073df8c1c9515d20562e7dbe37d7';
                const password = 'cs_36993c1a76e77b5c58269bddc4bd3b452319beca';
                const authHeader = 'Basic ' + btoa(`${username}:${password}`);

                try {
                    const response = await axios.get(`https://ecom.launcherr.co/wp-json/wc/v3/products/${id}`, {
                        headers: {
                            Authorization: authHeader,
                        },
                    });
                    setFetchedProductData(response.data);
                    console.log("product ka data", response.data);
                } catch (error) {
                    console.error('Error fetching product data:', error);
                }
            };

            fetchProductData();
        }
    }, [id]);

    if (!fetchedProductData) {
        return <Loader />;
    }

    return (
        <MainLayout>
            <ImageLayout Img_url='/images/book.png' heading='Product Detail' />

            <div className={styles['book-main-container']}>
                <div className={styles["book-main-about"]}>
                    <div className={styles["image-container"]}>
                        <CustomCarousel>
                            {fetchedProductData.images.map((image, index) => (
                                <div key={index} className='img-product-details-page'>
                                    <img src={image.src} alt={image?.name} />
                                </div>
                            ))}
                        </CustomCarousel>
                    </div>

                    <div className={styles["boking-details"]}>
                        <div className={styles["boking-details-inner"]}>
                            <h1>DESCRIPTION</h1>
                            <p dangerouslySetInnerHTML={{ __html: fetchedProductData?.description }}></p>
                        </div>
                    </div>
                </div>
                <div className={styles["book-main-form"]}>
                    <h1 className={styles["heading"]}>
                        {fetchedProductData.name}
                    </h1>
                    <h1>₹ {fetchedProductData.price}</h1>
                    <div className={styles["variations"]}>
                        {fetchedProductData && (
                            <>
                                <h3>Select {fetchedProductData?.attributes[0]?.name}</h3>
                                <div className={styles['size-select-container']}>
                                    <select
                                        value={selectedSize}
                                        onChange={handleSizeChange}
                                        className={styles['size-select']}
                                    >
                                        <option value="" disabled>Select a {fetchedProductData?.attributes[0]?.name}</option>
                                        {fetchedProductData?.attributes[0]?.options?.map((size, index) => (
                                            <option key={index} value={size}>
                                                {size}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </>
                        )}
                    </div>

                    <div className={styles["book-main-inner"]}>
                        <td data-column="Quantity" className="count-input">
                            <div>
                                <input
                                    type="number"
                                    placeholder='1'
                                    name=""
                                    id=""
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                />
                            </div>
                        </td>
                        <button onClick={handleCart} className='btn-primary'>
                            Add To Cart
                        </button>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}

export default ProductDetail;
