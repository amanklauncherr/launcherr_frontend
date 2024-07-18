import HomeCrumbs from '@/components/HomeCrumbs'
import ImageLayout from '@/components/ImageLayout'
import MainLayout from '@/components/MainLayout'
import PlansPage from '@/components/PlansPage'
import axios from 'axios'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import styles from './join.module.css'

const Join = () => {
    const router = useRouter();
    const [fetchSectionData, setFetchSectionData] = useState()
    const [offerData, setOfferData] = useState([])

    useEffect(() => {
        const fetchSectionData = async () => {
            try {
                const response = await axios.get('https://api.launcherr.co/api/Show-Section');
                setFetchSectionData(response.data);
            } catch (error) {
                console.error('Error fetching section data:', error);
            }
        };

        const fetchOfferData = async () => {
            try {
                const response = await axios.get('https://api.launcherr.co/api/showJoinOffer');
                setOfferData(response.data);
            } catch (error) {
                console.error('Error fetching offer data:', error);
            }
        };

        fetchSectionData();
        fetchOfferData();
    }, []);

    return (
        <>
            <MainLayout>
                <ImageLayout Img_url="/images/joinus-page.jpeg" heading='Join Us'>
                </ImageLayout>
                <HomeCrumbs
                    Crumb_Info={fetchSectionData?.Subscription?.heading}
                    Crumb_Descripton={fetchSectionData?.Subscription?.['sub-heading']}
                >
                    <PlansPage />
                </HomeCrumbs>
                <HomeCrumbs
                    Crumb_Info={offerData.heading}
                    Crumb_Descripton={offerData.sub_heading}
                >
                    {offerData?.Cards?.map((offer, index) => (
                        <div key={index} className={styles['offer-card-main-container']}>
                            <h2>{offer.heading}</h2>
                            <p>{offer.subheading}</p>
                        </div>
                    ))}
                </HomeCrumbs>
            </MainLayout>
        </>
    )
}

export default Join
