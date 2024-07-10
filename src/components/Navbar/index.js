import React, { useState, useEffect, useRef } from 'react';
import styles from './navbar.module.css';
import { useRouter } from 'next/router';
import BlankFilter from '../BlankFilter';
import TravelIcon from '../Icons/TravelIcon';
import GigsIcon from '../Icons/GigsIcon';
import EcoomerceIcon from '../Icons/EcoomerceIcon';
import HomeIcon from '../Icons/HomeIcon';
import AboutIcon from '../Icons/AboutIcon';
import CartIcon from '../Icons/CartIcon';
import PlanIcon from '../Icons/PlanIcon';
import Cookies from 'js-cookie';

const Navbar = () => {
  const router = useRouter();
  const [isTravelDropdownOpen, setIsTravelDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const authToken = Cookies.get('auth_token');
    setIsLoggedIn(!!authToken);
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

  const handleItemClick = () => {
    router.push('/');
  };

  const handleLogin = () => {
    router.push('/auth/login');
  };

  const handleLogout = () => {
    Cookies.remove('auth_token');
    setIsLoggedIn(false);
    router.push('/');
  };

  const handleEmployeeLogin = () => {
    window.location.href = "https://gigs.launcherr.co/";
  };
  

  const handleHome = () => {
    router.push('/');
  };

  const handleCartClick = () => {
    router.push('/cart');
  };

  const handleAbout = () => {
    router.push('/about');
  };

  const handleTravel = () => {
    setIsTravelDropdownOpen(!isTravelDropdownOpen);
  };

  const handleGigsClick = () => {
    router.push('/gigs');
  };

  const handleProducts = () => {
    router.push('/products');
  };

  const handleJoinClick = () => {
    router.push('/join');
  };

  const handleProfileClick = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const travelItems = [
    { label: 'Flights', onClick: () => router.push('/flights') },
    { label: 'Bus', onClick: () => router.push('/buses') },
    { label: 'Stays', onClick: () => router.push('/stays') },
  ];

  const items = [
    { label: 'Home', icon: <HomeIcon />, onClick: handleHome },
    { label: 'About', icon: <AboutIcon />, onClick: handleAbout },
    {
      label: (
        <span>
          Travel&nbsp;
          <svg width="15" height="9" viewBox="0 0 15 9" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.12939 1.26778L7.12846 7.26685L13.1275 1.26778" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </span>
      ),
      icon: <TravelIcon />,
      onClick: handleTravel
    },
    { label: 'Shop', icon: <EcoomerceIcon />, onClick: handleProducts },
    { label: 'Gigs', icon: <GigsIcon />, onClick: handleGigsClick },
    { label: 'Cart', icon: <CartIcon />, onClick: handleCartClick },
    { label: 'Join', icon: <PlanIcon />, onClick: handleJoinClick }
  ];

  return (
    <nav className={styles['navMain']}>
      <div className={styles['navInner']}>
        <img onClick={handleHome} src="/logo.svg" alt="" />
        <BlankFilter items={items} onItemClick={handleItemClick} >
          {isTravelDropdownOpen && (
            <div ref={dropdownRef} className={styles.dropdown}>
              {travelItems.map((item, index) => (
                <div key={index} className={styles.dropdownItem} onClick={item.onClick}>
                  {item.label}
                </div>
              ))}
            </div>
          )}
        </BlankFilter>
        {!isLoggedIn && (
          <button className="btn-border-white" onClick={handleLogin}>
            Login
          </button>
        )}
        {isLoggedIn && (
          <div ref={profileDropdownRef} className={styles.profileContainer}>
            <div onClick={handleProfileClick}>
              <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.6894 43.3787C33.6681 43.3787 43.3787 33.6681 43.3787 21.6894C43.3787 9.71066 33.6681 0 21.6894 0C9.71066 0 0 9.71066 0 21.6894C0 33.6681 9.71066 43.3787 21.6894 43.3787Z" fill="black" />
                <path d="M13 33C13 30.7772 13.8955 28.6455 15.4896 27.0738C17.0837 25.502 19.2457 24.619 21.5 24.619C23.7543 24.619 25.9163 25.502 27.5104 27.0738C29.1045 28.6455 30 30.7772 30 33H13ZM21.5 23.5714C17.9778 23.5714 15.125 20.7586 15.125 17.2857C15.125 13.8129 17.9778 11 21.5 11C25.0222 11 27.875 13.8129 27.875 17.2857C27.875 20.7586 25.0222 23.5714 21.5 23.5714Z" fill="white" />
              </svg>
            </div>
            {isProfileDropdownOpen && (
              <div className={styles.profileDropdown}>
                <div className={styles["profile-info"]}>
                  <p>Username</p>
                  <p>USEREMAIL</p>
                </div>
                <div className={styles.dropdownItem} onClick={handleEmployeeLogin}>
                  Employee Login
                </div>
                <div className={styles.dropdownItem} onClick={handleLogout}>
                  Logout
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
