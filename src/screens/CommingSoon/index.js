import React from 'react'
import Lottie from 'react-lottie-player'
import lottieJson from './lotie.json';

const CommingSoon = () => {
  return (
    <>
    <div className='lottifiles-bg'>
       <Lottie
        loop
        animationData={lottieJson}
        play
      />
    </div>
    </>
  )
}

export default CommingSoon