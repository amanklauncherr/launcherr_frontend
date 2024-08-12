import React, { useEffect, useRef, useState } from 'react';
import styles from './dashboard.module.css';
import GigsIcon from '@/components/Icons/GigsIcon';
import EcoomerceIcon from '@/components/Icons/EcoomerceIcon';
import HomeIcon from '@/components/Icons/HomeIcon';
import ProfileIcon from '@/components/Icons/ProfileIcon';
import { useRouter } from 'next/router';
import axios from 'axios';
import Cookies from 'js-cookie';

// Mapping icons to their respective components
const iconComponents = {
    HomeIcon,
    ProfileIcon,
    GigsIcon,
    EcoomerceIcon,
};



const Dashboard = ({ children }) => {
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const profileDropdownRef = useRef(null);
    const dropdownRef = useRef(null);
    const [userData, setUserData] = useState({ name: '', email: '' });

    const router = useRouter();

    const handleNavigation = (path) => {
        router.push(path);
    };




    useEffect(() => {
        const authToken = Cookies.get('auth_token');
        setIsLoggedIn(!!authToken);
        if (authToken) {
            axios.get('https://api.launcherr.co/api/showUserProfile', {
                headers: { Authorization: `Bearer ${authToken}` }
            })
                .then(response => {
                    if (response.data.success) {
                        setUserData({
                            name: response.data.user.name,
                            email: response.data.user.email
                        });
                    }
                })
                .catch(error => {
                    console.error('mffjfjfprofile:', error?.response?.data?.success);
                    if (error?.response?.data?.success == 0) {
                        alert('Your session has expired. Please log in again.');
                        Cookies.remove('auth_token');
                    }
                });
        }
        else {
            router.push('/')
        }
    }, []);

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsTravelDropdownOpen(false);
        }
        if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
            setIsProfileDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleProfileClick = () => {
        setIsProfileDropdownOpen(!isProfileDropdownOpen);
    };



    const handleEmployeeLogin = () => {
        window.location.href = "https://gigs.launcherr.co/";
    };

    const handleLogout = () => {
        Cookies.remove('auth_token');
        setIsLoggedIn(false);
        router.push('/');
      };

    const dashboardData = {
        "logoSrc": "/logo.svg",
        "sidebarItems": [
            {
                "icon": "HomeIcon",
                "label": "Home",
                "path": "/"
            },
            {
                "icon": "ProfileIcon",
                "label": "Profile",
                "path": "/dashboard/profile"
            },
            {
                "icon": "GigsIcon",
                "label": "Gigs",
                "path": "/dashboard/gigsInfo"
            },
            {
                "icon": "EcoomerceIcon",
                "label": "My Orders",
                "path": "/dashboard/my_orders"
            }
        ],
        "profileInitial": "N"
    };


    return (
        <div className={styles["dashboard-main-container"]}>
            <div className={styles["sidebar"]}>
                <div className={styles["logo-with-toggle"]}>
                    <img src={dashboardData?.logoSrc} alt="Logo" />
                </div>
                <div className={styles["sidebar-list"]}>
                    <ul>
                        {dashboardData?.sidebarItems.map((item, index) => {
                            const IconComponent = iconComponents[item.icon];
                            return (
                                <li key={index} onClick={() => handleNavigation(item.path)}>
                                    <IconComponent /> {item.label}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
            <div className={styles['top-bar-nav']}>
                {isLoggedIn && (
                    <div ref={profileDropdownRef} className={styles.profileContainer}>
                        <div className={styles["profileContainer-inner"]} onClick={handleProfileClick}>
                            <p> {userData.name ? userData.name.charAt(0).toUpperCase() : ''}</p>
                        </div>
                        {isProfileDropdownOpen && (
                            <div className={styles.profileDropdown}>
                                <div className={styles["profile-info"]}>
                                    <p>{userData.name}</p>
                                    <p>{userData.email}</p>
                                </div>
                                <div className={styles.dropdownItem} onClick={handleEmployeeLogin}>
                                    Gigs Login
                                </div>
                                <div className={styles.dropdownItem} onClick={handleLogout}>
                                    Logout
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <div className={styles["inner-dashboard-content"]}>
                {children}
            </div>
        </div>
    );
};

export default Dashboard;
