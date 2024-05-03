import React from 'react';
import styles from './navbar.module.css';
import { useRouter } from 'next/router';

const Navbar = () => {
  const router = useRouter();
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
        <button className='btn-border-white' onClick={handlelogin}>
            Login
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
