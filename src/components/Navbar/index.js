import React from 'react';
import styles from './navbar.module.css';
import { useRouter } from 'next/router';
import BlankFilter from '../BlankFilter';

const Navbar = () => {
  const router = useRouter();

  const items = ['Hotels', 'Activites', 'Events', 'Holiday Deals', 'Products', 'Gigs', 'Tour Guide'];

  const handleItemClick = (item) => {
    if (item === 'Hotels') {
      router.push('/commingsoon')
    }
    if (item === 'Activites') {
      router.push('/commingsoon')
    }
    if (item === 'Events') {
      router.push('/commingsoon')
    }
    if (item === 'Holiday Deals') {
      router.push('/travel-package')
    }
    if (item === 'Products') {
      router.push('/commingsoon')
    }
    if (item === 'Gigs') {
      router.push('/gigs')
    }
    if (item === 'Tour Guide') {
      router.push('/commingsoon')
    }
  };

  const handlelogin = () => {
    router.push('/auth/login')
  }

  const handlehome = () => {
    router.push('/')
  }

  return (
    <nav className={styles["navMain"]}>
      <div className={styles['navInner']}>
        <img onClick={handlehome} src="/logo.svg" alt="" />
        <BlankFilter
            items={items}
            onItemClick={handleItemClick}
          />
        <button className='btn-border-white' onClick={handlelogin}>
            Login
        </button>
      </div>
      <div>
      </div>
    </nav>
  );
};

export default Navbar;
