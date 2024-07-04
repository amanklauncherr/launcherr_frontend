import React, { useState } from 'react'
import styles from './footer.module.css'
import toast from 'react-hot-toast';
import axios from 'axios';


const Footer = () => {
    const [email, setEmail] = useState('');

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://api.launcherr.co/api/AddEmail', { email });
            console.log("newsletter response", response)
            setEmail('');
            toast.success('Subscribed successfully!');
        } catch (error) {
            toast.error('Subscription failed. Please try again.');
        }
    };

    const handleHome = () => {
        router.push('/');
    };

    return (
        <>
            <footer className={styles["footer"]}>
                <div className={styles["footer-inner"]}>
                    <img onClick={handleHome} src="/logo.svg" alt="" />
                    <div className={styles["footer-bottom"]}>
                        <div className={styles["footer-info"]}>
                            <ul>
                                <li>Company</li>
                                <li>About Us</li>
                                <li>FAQ</li>
                            </ul>
                            <ul>
                                <li>Pricing</li>
                                <li>Employer login </li>
                                <li>Term & Condition</li>
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
                </div>
            </footer>

        </>
    );
};

export default Footer;