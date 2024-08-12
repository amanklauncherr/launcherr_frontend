import React, { useState, useEffect } from 'react';
import Lottie from 'react-lottie-player';
import mylotti from './bus.json';

const BusLotti = () => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        // This will run only on the client side
        setIsClient(true);
    }, []);

    if (!isClient) {
        return null; // Prevent rendering on the server side
    }

    return (
        <>
            <Lottie
                loop
                animationData={mylotti}
                play
                style={{ width: 280, height: 280 }}
                className='heelo'
            />
        </>
    );
};

export default BusLotti;
