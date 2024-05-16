import React from 'react';
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

  const handleHotels = () => {
    router.push('/commingsoon')
  }
  const handleGigsClick = () => {
    router.push('/gigs')
  }

  const handleProducts = () => {
    router.push('/products')
  }

  const items = [
    { label: 'Home', icon: <HomeIcon />, onClick: handleHome },
    { label: 'About', icon: <AboutIcon />, onClick: handleAbout },
    { label: 'Hotels', icon: <TravelIcon />, onClick: handleHotels },
    { label: 'E-commerce', icon: <EcoomerceIcon />, onClick: handleProducts },
    { label: 'Gigs', icon: <GigsIcon />, onClick: handleGigsClick },
    { label: 'Cart', icon: <CartIcon />, onClick: handlecartClick }
  ];


  
  return (
    <nav className={styles['navMain']}>
      <div className={styles['navInner']}>
        <img onClick={handleHome} src="/logo.svg" alt="" />
        <BlankFilter items={items} onItemClick={handleItemClick} />
        <button className="btn-border-white" onClick={handlelogin}>
          Login
        </button>
      </div>
      <div></div>
    </nav>
  );
};

export default Navbar;
