import React from 'react'
import Lottie from 'react-lottie-player'
import mylotti from './bus.json'


const BusLotti = () => {
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
    )
}

export default BusLotti