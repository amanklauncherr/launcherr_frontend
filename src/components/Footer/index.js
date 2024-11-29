import React, { useState, useEffect } from 'react';
import styles from './footer.module.css';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useRouter } from 'next/router';
import BusLotti from '../BusLotti';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faLinkedin, faTwitter } from '@fortawesome/free-brands-svg-icons';
import Instagram from '../Icons/Instagram'

const Footer = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [companyDetails, setCompanyDetails] = useState({
        company_address: '',
        company_name: '',
        company_email: '',
        company_contact: ''
    });

    useEffect(() => {
        const fetchCompanyDetails = async () => {
            try {
                const response = await axios.get('https://api.launcherr.co/api/Show-Details');
                setCompanyDetails(response.data);
            } catch (error) {
                console.error('Error fetching company details', error);
            }
        };

        fetchCompanyDetails();
    }, []);

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://api.launcherr.co/api/AddEmail', { email });
            console.log("newsletter response", response);
            setEmail('');
            toast.success('Subscribed successfully!');
        } catch (error) {
            toast.error('Subscription failed. Please try again.');
        }
    };

    const handleHome = () => {
        router.push('/');
    };

    const handleEmployeeLogin = () => {
        window.location.href = "https://gigs.launcherr.co/";
    };

    const handleAbout = () => {
        router.push('/about');
    };

    const handleFaq = () => {
        router.push('/faq')
    }

    const handlePricing = () => {
        router.push('/join')
    }

    return (
        <>
            <footer className={styles["footer"]}>
                <BusLotti />
                <div className={styles["footer-inner"]}>
                    <img onClick={handleHome} src="/logo.svg" alt="" />

                    <div className={styles["footer-bottom"]}>
                        <div className={styles["footer-info"]}>
                            <div>
                                <div className={styles["footer-info-text"]}>
                                    <h1>
                                        Address
                                    </h1>
                                    <p>{companyDetails.company_address}</p>
                                </div>
                                <div className={styles["footer-info-text"]}>
                                    <h1 style={{ marginBottom: "20px" }}>
                                        Contact Us
                                    </h1>
                                    <ul>
                                        <li><span>{companyDetails.company_name}</span></li>
                                        <li><span>{companyDetails.company_email}</span></li>
                                        <li><span>{companyDetails.company_contact}</span></li>
                                    </ul>
                                </div>
                            </div>
                        
                            <ul>
                                <li> <a href="ShippingPolicy.html" target='_blank'>Shipping Policy</a></li>
                                <li><a href="ReturnPolicy.html" target="_blank" rel="noopener noreferrer">Return/Refund Policy</a></li>
                                <li> <a href="PrivacyPolicy.html" target='_blank'>Privacy Policy</a></li>
                                <li><a href="TermsConditions.html" target="_blank" rel="noopener noreferrer">Terms & Conditions</a></li>
                            </ul>
                            <ul>
                                <li onClick={handleAbout}>About Us</li> 
                                <li onClick={handleFaq}>FAQ</li>
                                {/* <li onClick={handleEmployeeLogin}>Employer login</li> */}
                                <li><a href="Disclaimer.html" target="_blank">Disclaimer</a></li>
                            </ul>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <h1>Launcherr</h1>
                            <p>Subscribe to our Newsletter</p>
                            <input
                                type="text"
                                placeholder="Enter your Email"
                                value={email}
                                onChange={handleEmailChange}
                            />
                            <button type="submit">Subscribe</button>
                        </form>

                    </div>
                    <div className={styles["bottom-sep"]}>
                        <p className={styles["copyright-text"]}>
                        <a href="https://www.instagram.com/launcherr.co/" target="_blank" rel="noopener noreferrer">
                                <Instagram />
                            </a>
                            ©2024 Launcherr. All rights reserved
                        </p>
                      
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Footer;
