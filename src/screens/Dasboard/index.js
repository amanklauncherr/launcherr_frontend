import React, { useEffect, useRef, useState } from 'react';
import styles from './dashboard.module.css';
import GigsIcon from '@/components/Icons/GigsIcon';
import EcoomerceIcon from '@/components/Icons/EcoomerceIcon';
import HomeIcon from '@/components/Icons/HomeIcon';
import BusIcon from '@/components/Icons/BusIcon'
import TravelIcon from '@/components/Icons/TravelIcon'
import ProfileIcon from '@/components/Icons/ProfileIcon';
import { useRouter } from 'next/router';
import axios from 'axios';
import Cookies from 'js-cookie';
import HamBurger from '@/components/Icons/HamBurger';
import CrossBigIcon from '@/components/Icons/CrossBigIcon';
import Cross from '@/components/Icons/Cross';

const iconComponents = {
    HomeIcon,
    ProfileIcon,
    GigsIcon,
    EcoomerceIcon,
    TravelIcon,
    BusIcon
};

const Dashboard = ({ children }) => {
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // New state for sidebar visibility
    const profileDropdownRef = useRef(null);
    const dropdownRef = useRef(null);
    const [userData, setUserData] = useState({ name: '', email: '' });

    const router = useRouter();

    const handleNavigation = (path) => {
        router.push(path);
        setIsSidebarOpen(false); // Close sidebar on navigation for smaller screens
    };

    useEffect(() => {
        const authToken = Cookies.get('auth_token');
        setIsLoggedIn(!!authToken);
        const user_data = JSON.parse(localStorage.getItem('launcherr_UserProfileData'));
        setUserData(user_data)
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

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen); // Toggle sidebar visibility
    };

    const dashboardData = {
        logoSrc: "/logo.svg",
        sidebarItems: [
            { icon: "HomeIcon", label: "Home", path: "/" },
            { icon: "ProfileIcon", label: "Profile", path: "/dashboard/profile" },
            { icon: "GigsIcon", label: "Gigs", path: "/dashboard/gigsInfo" },
            { icon: "EcoomerceIcon", label: "My Orders", path: "/dashboard/my_orders" },
            { icon: "TravelIcon", label: "Flight", path: "/dashboard/flight" },
            { icon: "BusIcon", label: "Bus", path: "/dashboard/bus" },
        ],
        profileInitial: "N"
    };

    return (
        <div className={styles["dashboard-main-container"]}>

            <div className={`${styles["sidebar"]} ${isSidebarOpen ? styles["open"] : ""}`}>
                <div onClick={toggleSidebar} className={styles["post-toggle-cross"]}>
                    <svg width="18" height="18" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4.32394 0.711767L14.5 10.8874L24.6233 0.76449C24.847 0.52649 25.1163 0.336098 25.4153 0.204731C25.7143 0.0733643 26.0367 0.00372846 26.3633 0C27.0625 0 27.733 0.277739 28.2274 0.772117C28.7218 1.2665 28.9996 1.93702 28.9996 2.63617C29.0057 2.95937 28.9458 3.28042 28.8234 3.57961C28.7009 3.8788 28.5187 4.14983 28.2878 4.37605L18.0326 14.499L28.2878 24.7537C28.7223 25.1787 28.9771 25.7543 28.9996 26.3617C28.9996 27.0609 28.7218 27.7314 28.2274 28.2258C27.733 28.7202 27.0625 28.9979 26.3633 28.9979C26.0273 29.0119 25.6921 28.9558 25.3789 28.8332C25.0658 28.7107 24.7815 28.5244 24.5443 28.2861L14.5 18.1105L4.3503 28.2598C4.12755 28.4899 3.86144 28.6735 3.56733 28.8002C3.27322 28.9269 2.95693 28.9941 2.63671 28.9979C1.93753 28.9979 1.26698 28.7202 0.772579 28.2258C0.27818 27.7314 0.000428941 27.0609 0.000428941 26.3617C-0.00571755 26.0385 0.0542498 25.7175 0.176651 25.4183C0.299053 25.1191 0.481306 24.8481 0.712226 24.6219L10.9674 14.499L0.712226 4.24424C0.277727 3.81918 0.0229418 3.24358 0.000428941 2.63617C0.000428941 1.93702 0.27818 1.2665 0.772579 0.772117C1.26698 0.277739 1.93753 0 2.63671 0C3.26942 0.00790852 3.87577 0.263617 4.32394 0.711767Z" fill="white" />
                    </svg>
                </div>
                <div className={styles["logo-with-toggle"]}></div>
                <div className={styles["sidebar-list"]}>
                    <ul>
                        {dashboardData.sidebarItems.map((item, index) => {
                            const IconComponent = iconComponents[item.icon];
                            const isActive = router.pathname === item.path;

                            return (
                                <li
                                    key={index}
                                    onClick={() => handleNavigation(item.path)}
                                    className={isActive ? styles.active : ''}
                                >
                                    <IconComponent /> {item.label}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>

            <div className={styles['top-bar-nav']}>
                <HamBurger onClick={toggleSidebar} />
                {isLoggedIn && (
                    <div ref={profileDropdownRef} className={styles.profileContainer}>
                        <div className={styles["profileContainer-inner"]} onClick={handleProfileClick}>
                        <p>{userData.user.name ? userData.user.name.charAt(0).toUpperCase() : ''}</p>
                        </div>
                        {isProfileDropdownOpen && (
                            <div className={styles.profileDropdown}>
                                <div className={styles["profile-info"]}>
                                <p>{userData.user.name}</p>
                                <p>{userData.user.email}</p>
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
