import React, { useState, useEffect } from 'react';
import Lottie from 'react-lottie-player';
import lottieJson from './lotie.json';

const CommingSoon = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This will run only on the client side
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Prevent rendering on the server side
  }

  return (
    <div className='lottifiles-bg'>
      <Lottie
        loop
        animationData={lottieJson}
        play
        style={{ width: '100%', maxWidth: '600px', height: 'auto' }} // Responsive design
      />
    </div>
  );
}

export default CommingSoon;
