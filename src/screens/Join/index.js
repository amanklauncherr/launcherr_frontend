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
    const [fetchSectionData, setfetchSectionData] = useState()

    useEffect(() => {
        const fetchSectionData = async () => {
            try {
                const response = await axios.get('https://api.launcherr.co/api/Show-Section');
                setfetchSectionData(response.data);
            } catch (error) {
                console.error('Error fetching banner data:', error);
            }
        };

        fetchSectionData();
    }, []);
    return (
        <>
            <MainLayout>
                <ImageLayout Img_url="/images/product.png" heading='Join Us'>
                </ImageLayout>
                <HomeCrumbs
                    // Crumb_About="Choose a plan"
                    Crumb_Info={fetchSectionData?.Subscription?.heading}
                    Crumb_Descripton={fetchSectionData?.Subscription?.['sub-heading']}
                >
                    <PlansPage />
                </HomeCrumbs>
                <HomeCrumbs
                    // Crumb_About="What we offer"
                    Crumb_Info="What we offer"
                    // Crumb_Descripton='lorem ipsum lorem ipsulorem ipsu lorem ipsu lorem ipsu'
                >
                        <div className={styles['offer-card-main-container']}>
                            {/* <img src="/icons/gigsimg.svg" /> */}
                            <h2>FIND GIGS</h2>
                            <p>Our tagline says it all, Earn while you Explore. Worried about travel budget? Don't be! Explore a new destination while you make money to help with costs.</p>
                        </div>
                        <div className={styles['offer-card-main-container']}>
                            {/* <img src="/icons/gigsimg.svg" /> */}
                            <h2>BOOK TRAVEL</h2>
                            <p>We take nomads seriously and understand that travel costs can be expensive. Hence, we do our research to provide you the most affordable deals on flights, stays and rentals.</p>
                        </div>
                        <div className={styles['offer-card-main-container']}>
                            {/* <img src="/icons/gigsimg.svg" /> */}
                            <h2>ADD COUPONS</h2>
                            <p>We are here for all things travel! Only on Launcherr, you can add handpicked vouchers that can save you money on food, beverages, experiences and more.</p>
                        </div>
                        <div className={styles['offer-card-main-container']}>
                            {/* <img src="/icons/gigsimg.svg" /> */}
                            <h2>PERSONALIZED ITINERARY</h2>
                            <p>We don't stop even after your booking! Plan & track your complete itinerary including gig hours, departures/arrivals, stays, and more.</p>
                        </div>
                        {/* <div className={styles['offer-card-main-container']}>
                            <img src="/icons/gigsimg.svg" /> 
                            <h2>FIND GIGS</h2>
                            <p>Our tagline says it all, Earn while you Explore. Worried about travel budget? Don't be! Explore a new destination while you make money to help with costs.</p>
                        </div> */}

                </HomeCrumbs>
            </MainLayout>
        </>
    )
}

export default Join