import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import styles from './navbar.module.css';
import BlankFilter from '../BlankFilter';
import TravelIcon from '../Icons/TravelIcon';
import GigsIcon from '../Icons/GigsIcon';
import EcoomerceIcon from '../Icons/EcoomerceIcon';
import HomeIcon from '../Icons/HomeIcon';
import AboutIcon from '../Icons/AboutIcon';
import CartIcon from '../Icons/CartIcon';
import PlanIcon from '../Icons/PlanIcon';
import HamBurger from '../Icons/HamBurger';
import CrossBigIcon from '../Icons/CrossBigIcon';

const Navbar = () => {
  const router = useRouter();
  const [isTravelDropdownOpen, setIsTravelDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isHamBurgerDropdownOpen, setIsHamBurgerDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const hamBurgerDropdownRef = useRef(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({ name: '', email: '' });

  useEffect(() => {
    const authToken = Cookies.get('auth_token');
    setIsLoggedIn(!!authToken);
    if (authToken) {
      const user_data = JSON.parse(localStorage.getItem('launcherr_UserProfileData'));
      setUserData(user_data)
    }
  }, []);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsTravelDropdownOpen(false);
    }
    if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
      setIsProfileDropdownOpen(false);
    }
    if (hamBurgerDropdownRef.current && !hamBurgerDropdownRef.current.contains(event.target)) {
      setIsHamBurgerDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleItemClick = (onClick) => {
    onClick();
    setIsHamBurgerDropdownOpen(false);  // Close hamburger dropdown after clicking an item
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
    setIsProfileDropdownOpen(prevState => !prevState);
    setIsHamBurgerDropdownOpen(false); // Close hamburger dropdown if profile dropdown is opened
  };

  const handleHamBurgerClick = () => {
    setIsHamBurgerDropdownOpen(prevState => !prevState) // Close profile dropdown if hamburger dropdown is opened
  };


  const handlecloseHamBurger = () => {
    setIsHamBurgerDropdownOpen(prevState => !prevState)
  }

  const travelItems = [
    { label: 'Flights', onClick: () => router.push('/flights') },
    // { label: 'Stays', onClick: () => router.push('/stays') },
    { label: 'Bus', onClick: () => router.push('/bus') },
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
    // { label: 'Join', icon: <PlanIcon />, onClick: handleJoinClick }
  ];

  const handleUserDashboard = () => {
    const authToken = Cookies.get('auth_token');
    if (authToken) {
      router.push('/dashboard/profile')
    } else {
      alert('Please log in to access the dashboard.');
    }
  };


  const handleBus = () => {
    router.push('/bus')
  }


  const handleFlights = () => {
    router.push('/flights')
  }

  const handleclosedrop = () => {
    setIsProfileDropdownOpen(false);
  }

  return (
    <nav className={styles['navMain']}>
      <div className={styles['navInner']}>
        <img onClick={handleHome} src="/logo.svg" alt="" />
        <div className={styles["mob-hide"]}>
          <BlankFilter items={items} onItemClick={handleItemClick}>
            {isTravelDropdownOpen && (
              <div ref={dropdownRef} className={styles.dropdown22}>
                {travelItems.map((item, index) => (
                  <div key={index} className={styles.dropdownItem} onClick={item.onClick}>
                    {item.label}
                  </div>
                ))}
              </div>
            )}
          </BlankFilter>
        </div>
        <div className='wrap-nav-buttons'>
        {!isLoggedIn && (
          <button className="btn-border-white" onClick={handleLogin}>
            Login
          </button>
        )}
        {isLoggedIn && (
          <div className={styles["pro-icon-hamberger"]}>
            <div ref={profileDropdownRef} className={styles.profileContainer}>
              <div className={styles["profileContainer-inner"]} onClick={handleProfileClick}>
                <p>{userData.user.name ? userData.user.name.charAt(0).toUpperCase() : ''}</p>
              </div>
              {isProfileDropdownOpen && (
                <div className={styles.profileDropdown}>
                  <div  className={styles["cross-cicon"]}>
                    <CrossBigIcon
                    onClick={handleclosedrop}
                    />
                  </div>
                  <div className={styles["profile-info"]}>
                    <p>{userData.user.name}</p>
                    <p>{userData.user.email}</p>
                  </div>

                  <div className={styles.dropdownItem} onClick={handleEmployeeLogin}>
                    Gigs Login
                  </div>
                  <div className={styles.dropdownItem} onClick={handleUserDashboard}>
                    User Dashboard
                  </div>
                  <div className={`${styles.dropdownItem} webhide`} onClick={handleCartClick}>
                    Cart
                  </div>
                  <div className={styles.dropdownItem} onClick={handleLogout}>
                    Logout
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

          <div className={styles["pro-icon-hamberger"]}>
            <div ref={profileDropdownRef} className={styles.profileContainer}>
              <div  onClick={handleHamBurgerClick}>
                <HamBurger/>
              </div>
              {isHamBurgerDropdownOpen && (
                <div className={styles.profileDropdown}>
                  <div  className={styles["cross-cicon"]}>
                    <CrossBigIcon
                    onClick={handlecloseHamBurger}
                    />
                  </div>
                  <div className={styles["profile-info"]}>
                  <div style={{color:"white"}} className={`${styles.dropdownItem} webhide`}  onClick={handleHome}>
                    Home
                  </div>
                  </div>
                  <div className={`${styles.dropdownItem} webhide`}  onClick={handleFlights}>
                    Flights
                  </div>
                  <div className={`${styles.dropdownItem} webhide`} onClick={handleBus}>
                    Bus
                  </div>
                  <div className={`${styles.dropdownItem} webhide`}  onClick={handleProducts}>
                    Shop
                  </div>
                  <div className={`${styles.dropdownItem} webhide`} onClick={handleAbout}>
                    About
                  </div>
                  <div className={`${styles.dropdownItem} webhide`} onClick={handleGigsClick}>
                    Gigs
                  </div>
                  {/* <div className={styles.dropdownItem} onClick={handleEmployeeLogin}>
                    Gigs Login
                  </div> */}
                  {/* <div className={styles.dropdownItem} onClick={handleUserDashboard}>
                    User Dashboard
                  </div> */}
                  {/* <div className={`${styles.dropdownItem} webhide`} onClick={handleCartClick}>
                    Cart
                  </div> */}
                  {/* <div className={styles.dropdownItem} onClick={handleLogout}>
                    Logout
                  </div> */}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
