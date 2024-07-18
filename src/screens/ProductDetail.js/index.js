import ImageLayout from '@/components/ImageLayout'
import MainLayout from '@/components/MainLayout'
import React, { useEffect, useState } from 'react'
import styles from './book.module.css'
import CustomCarousel from '@/components/CustomCarousel'
import { useRouter } from 'next/router'
import axios from 'axios'
import { getCookie } from 'cookies-next'
import { useSelector } from 'react-redux'
import Loader from '@/components/Loader'
import toast from 'react-hot-toast'

const ProductDetail = () => {
    const router = useRouter();
    const { id } = router.query;
    const [fetchedProductData, setFetchedProductData] = useState(null);
    const [quantity, setQuantity] = useState(1); // State to manage quantity

    // Assuming you have a Redux setup for the token
    const reduxToken = useSelector((state) => state?.auth?.token);

    const handleCart = async () => {
        let bearerToken = '';
        const cookiesToken = getCookie('auth_token');
        if (cookiesToken) {
            bearerToken = cookiesToken;
        } else {
            bearerToken = reduxToken;
        }

        const headers = {
            Authorization: `Bearer ${bearerToken}`,
        };

        const data = {
            product_id: id,
            product_name: fetchedProductData.name,
            quantity: quantity,
            price: fetchedProductData.price
        };

        try {
            const response = await axios.post('https://api.launcherr.co/api/updateCart', data, { headers });
            console.log('Cart update response:', response.data);
            router.push('/cart');
        } catch (error) {
            // console.log(error.response.data.error);
            const err = error.response.data.error
            if (err == 'Unauthorized'){
                toast.error('Please login')
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
        return (
            <>
            <Loader/>
            </>
        )
    }

    return (
        <>
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
                        {/* <p dangerouslySetInnerHTML={{ __html: fetchedProductData?.description }}></p> */}
                    </div>
                </div>
            </MainLayout>
        </>
    )
}

export default ProductDetail;
