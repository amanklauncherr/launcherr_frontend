import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic'; // Import dynamic from next/dynamic
import 'reactjs-popup/dist/index.css';

import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import Home from '@/screens/Home';
import { useRouter } from 'next/router';
import Cross from '@/components/Icons/Cross';

// Use dynamic import for reactjs-popup
const Popup = dynamic(() => import('reactjs-popup'), { ssr: false });

const Index = () => {
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(true); // Initially set to true to show the popup

  useEffect(() => {
    // Hide the popup after a certain delay (e.g., 5 seconds)
    const timer = setTimeout(() => {
      setShowPopup(false);
    }, 5000); // 5000 milliseconds = 5 seconds

    // Clear the timer when the component unmounts
    return () => clearTimeout(timer);
  }, []);

  const handleRedirect = () => {
    router.push('/auth/login');
  };

  const handleclose = () => {
    setShowPopup(false);
  }

  const handleRedirectReview = () => {
    router.push()
  }

  return (
    <>
      <Navbar />
      <Home />
      <Footer />
      {showPopup && (
        <Popup open={true}>
          <div className='pop-up-inner'>
            <img src="/logo.svg" alt="" />
            <h1>Welcome to Launcherr!</h1>
            <p>
            Please take a moment to complete the survey form so we can better assist you with deals.
            </p>
            <Cross onClick={handleclose}/>
            <div className='btn-sep-popup'>
            <button className='btn-border-white' onClick={handleclose}>Not Now</button>
            <button className='btn-border-white' onClick={handleRedirectReview}>Continue</button>
            </div>
          </div>
        </Popup>
      )}
    </>
  );
};

export default Index;
