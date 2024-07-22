import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import ImageLayout from '@/components/ImageLayout';
import MainLayout from '@/components/MainLayout';
import styles from './destination.module.css';
import CustomCarousel from '@/components/CustomCarousel';

const DestinationDetails = () => {
    const router = useRouter();
    const { id } = router.query; // Extract ID from URL
    const [destinationData, setDestinationData] = useState(null);

    useEffect(() => {
        const fetchDestinationData = async () => {
            if (id) {
                try {
                    const response = await axios.get(`https://api.launcherr.co/api/destination?id=${id}`);
                    console.log('API Response:', response?.data?.destination); 
                    setDestinationData(response?.data?.destination);
                } catch (error) {
                    console.error('Error fetching destination data:', error);
                }
            }
        };

        fetchDestinationData();
    }, [id]);

    return (
        <MainLayout>
            <ImageLayout
                Img_url={'/images/destination-back.png'}
                heading={destinationData?.name || ''}
            />

            {destinationData ? (
                <div className={styles["destination-description-main-container"]}>
                    <div className={styles["destination-slider-inner-container"]}>
                        <CustomCarousel>
                            {destinationData.images.map((image, index) => (
                                <div key={index} className='img-product-details-page'>
                                    <img src={image} alt={`Destination Image ${index + 1}`} />
                                </div>
                            ))}
                        </CustomCarousel>
                    </div>
                    <div className={styles["details-info-section"]}>
                        <h2>{destinationData.destination_type}</h2>
                        <h3>{destinationData.short_description || 'Default Short Description'}</h3>
                        <p>
                            {destinationData.description || 'Default description content.'}
                        </p>
                    </div>
                </div>
            ) : (
                <div>Loading...</div>
            )}
        </MainLayout>
    );
}

export default DestinationDetails;
