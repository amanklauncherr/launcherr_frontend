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
    const [selectedSize, setSelectedSize] = useState('');
    const [Parent_Data, setParentData] = useState()

    const reduxToken = useSelector((state) => state?.auth?.token);

    const handleSizeChange = (e) => {
        const selectedOption = e.target.value;
        setSelectedSize(selectedOption);

        const selectedIndex = fetchedProductData.attributes[0].options.indexOf(selectedOption);

        if (selectedIndex !== -1) {
            const selectedVariationId = fetchedProductData.variations[selectedIndex];
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
            size: selectedSize,
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
                    const productData = response.data;

                    if (!productData.attributes || productData.attributes.length === 0) {
                        // alert('Attributes not found for this product.');
                    }

                    setFetchedProductData(productData);
                    // console.log("Product data:", productData?.parent_id);
                    const parentDta = productData?.parent_id
                    setParentData(parentDta)
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


    const handlePrentRedirect = () => {
        router.push(`/product-detail?id=${Parent_Data}`);
    };


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
                    <h2><del>₹ {fetchedProductData.regular_price}</del></h2>
                    <h1>₹ {fetchedProductData.price}</h1>
                    <p dangerouslySetInnerHTML={{ __html: fetchedProductData?.short_description }}></p>
                    <div className={styles["variation-inner-section"]}>
                        <div className={styles["variations"]}>
                            {fetchedProductData?.attributes?.[0]?.options ? (
                                <>
                                    <p>Select {fetchedProductData?.attributes[0]?.name}</p>
                                    <div className={styles['size-select-container']}>
                                        <select
                                            value={selectedSize}
                                            onChange={handleSizeChange}
                                            className={styles['size-select']}
                                        >
                                            <option value="" disabled>Select a {fetchedProductData?.attributes[0]?.name}</option>
                                            {fetchedProductData.attributes[0].options.map((size, index) => (
                                                <option key={index} value={size}>
                                                    {size}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className={styles['size-select-container']}>
                                        {/* <select
                                        value={selectedSize}
                                        onChange={handleSizeChange}
                                        className={styles['size-select']}
                                        onClick={handlePrentRedirect}
                                    >
                                        <option value="" disabled>Select a {fetchedProductData?.attributes[0]?.name}</option>
                                    </select> */}
                                        <div onClick={handlePrentRedirect} className={styles['empty-box']}>
                                            Click here to select variation
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                        <div className={styles["book-main-inner"]}>

                            <div>
                                <p>Quantity</p>
                                <input
                                    type="number"
                                    placeholder='1'
                                    name=""
                                    id=""
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                />
                            </div>

                        </div>
                    </div>
                    <div className={styles["book-details-bttn"]}>
                        <button onClick={handleCart} className='book-btn-primary'>
                            Add To Cart
                        </button>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}

export default ProductDetail;
