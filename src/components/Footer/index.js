import React, { useState, useEffect } from 'react';
import styles from './footer.module.css';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useRouter } from 'next/router';

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

    return (
        <>
            <footer className={styles["footer"]}>
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
                                    <h1>
                                        Contact Us
                                    </h1>
                                    <ul>
                                        <li>Company Name: <span>{companyDetails.company_name}</span></li>
                                        <li>Company Email: <span>{companyDetails.company_email}</span></li>
                                        <li>Company Contact: <span>{companyDetails.company_contact}</span></li>
                                    </ul>
                                </div>
                            </div>
                            <ul>
                                <li>Company</li>
                                <li onClick={handleAbout}>About Us</li>
                                <li onClick={handleFaq}>FAQ</li>
                            </ul>
                            <ul>
                                <li>Pricing</li>
                                <li onClick={handleEmployeeLogin}>Employer login</li>
                                <li>Terms & Conditions</li>
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
                    <p className={styles["copyright-text"]}>
                    ©2024 Launcherr. All right reserved
                    </p>
                </div>
            </footer>
        </>
    );
};

export default Footer;
