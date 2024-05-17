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

const Navbar = () => {
  const router = useRouter();
  const [isTravelDropdownOpen, setIsTravelDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsTravelDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleItemClick = () => {
    router.push('/');
  };

  const handlelogin = () => {
    router.push('/auth/login');
  };

  const handleHome = () => {
    router.push('/');
  };

  const handlecartClick = () => {
    router.push('/cart')
  }

  const handleAbout = () => {
    router.push('/commingsoon')
  }

  const handletravel = () => {
    setIsTravelDropdownOpen(!isTravelDropdownOpen);
  };

  const handleGigsClick = () => {
    router.push('/gigs')
  }

  const handleProducts = () => {
    router.push('/products')
  }

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
      onClick: handletravel
    },
    { label: 'E-commerce', icon: <EcoomerceIcon />, onClick: handleProducts },
    { label: 'Gigs', icon: <GigsIcon />, onClick: handleGigsClick },
    { label: 'Cart', icon: <CartIcon />, onClick: handlecartClick }
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
        <button className="btn-border-white" onClick={handlelogin}>
          Login
        </button>
      </div>

    </nav>
  );
};

export default Navbar;
