import ImageLayout from '@/components/ImageLayout';
import MainLayout from '@/components/MainLayout';
import React, { useEffect, useState } from 'react';
import styles from './gigscard.module.css';
import Clock from '@/components/Icons/Clock';
import LocationIconBlack from '@/components/Icons/LocationIconBlack';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import axios from 'axios';
import { getCookie } from 'cookies-next';
import { useSelector } from 'react-redux';
import Loader from '@/components/Loader';
import VerifyBadge from '@/components/Icons/VerifyBadge';

const GigDetails = () => {
    const [copyText, setCopyText] = useState('');
    const [gigDetails, setGigDetails] = useState(null);
    const [loading, setLoading] = useState(false); // Add loading state
    const router = useRouter();
    const { gig_id } = router.query;
    const reduxToken = useSelector((state) => state?.token?.publicToken);

    useEffect(() => {
        setCopyText(window.location.href);
    }, []);

    let bearerToken = '';
    const cookiesToken = getCookie('auth_token');
    
    if (cookiesToken) {
        bearerToken = cookiesToken;
    } else {
        bearerToken = reduxToken;
    }

    useEffect(() => {
        if (gig_id) {
            const headers = {
                Authorization: `Bearer ${bearerToken}`,
            };
            axios.get(`https://api.launcherr.co/api/showJob?id=${gig_id}` , {
                headers: headers
            })
                .then(response => {
                    setGigDetails(response.data?.job);
                    console.log(response.data?.job)
                })
                .catch(error => {
                    toast.error('Error fetching gig details');
                    console.error('Error fetching gig details:', error);
                });
        }
    }, [gig_id]);

    const handleCopyClick = () => {
        navigator.clipboard.writeText(copyText).then(() => {
            toast.success('URL copied to clipboard!');
        }).catch(err => {
            toast.error('Failed to copy URL:', err);
        });
    };

    const handleClick = async () => {
        setLoading(true); // Set loading to true when request starts
        const payload = {
            gigID: gig_id,
        };

        const headers = {
            Authorization: `Bearer ${bearerToken}`,
        };

        try {
            const response = await axios.post('https://api.launcherr.co/api/addEnquiry', payload, { headers });
            console.log('Enquiry response:', response.data);
            if (response?.data?.success == 1){
                toast.success('Success');
            } 
           else if (response?.data?.success == 0){
                toast.error(response?.data?.message);
            } 
        } catch (error) {
            toast.error(error?.response?.data?.message);
        } finally {
            setLoading(false); // Set loading to false when request completes
        }
    };

    return (
        <>
           {!gigDetails ?  <Loader/> :
            <MainLayout>
                <ImageLayout Img_url='/images/gigsimg.png' heading=''>
                </ImageLayout>
                <div className={styles["details-page-main-container"]}>
                    <div className={styles['gigs-card-main-container']} id='gigs-card'>
                        <div className={styles['gigs-cardinner']}>
                            <div className={styles['copy-url']}>
                                <p>{copyText}</p>
                                <button className={styles["copyurl-btn"]} onClick={handleCopyClick}>Copy</button>
                            </div>
                            <div className={styles["gig-image"]}>
                                <img src={gigDetails.company_image || "https://img.naukimg.com/logo_images/groups/v1/1468302.gif"} alt="" />
                            </div>
                            <p className={styles['company_name']}>
                                {gigDetails.company_name} {gigDetails.isVerified ? <VerifyBadge /> : null} 
                            </p>
                            <div className={styles['gigs-card-gigs_title']}>
                                <p>{gigDetails.gigs_title}</p>
                            </div>
                            <div className={styles["gig-info-section"]}>
                                <p className={styles['gigs_type']}>
                                    <Clock />
                                    {gigDetails.gigs_duration} hrs
                                </p>
                                <div className={styles["Gigslocation"]}>
                                    <LocationIconBlack />
                                    <p>{gigDetails.gigs_location}</p>
                                </div>
                            </div>
                            <div className={styles["details-section"]}>
                                <h3>Gig Description</h3>
                                <p className={styles['gigs_description']}>
                                    {gigDetails.gigs_description}
                                </p>
                            </div>
                        </div>
                        <div className={styles['gigs-card-btn-sep']}>
                            <button 
                                onClick={handleClick} 
                                className='book-btn-primary'
                                disabled={loading} // Disable the button while loading
                            >
                                {loading ? 'Loading...' : 'Enquire Now'} {/* Show loading text */}
                            </button>
                        </div>
                    </div>
                </div>
            </MainLayout>
           }
        </>
    );
}

export default GigDetails;
