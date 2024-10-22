import React from 'react'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import FlightRoundTrip from '../../screens/FlightsModule/FlightRoundTrip'

const roundTrip = () => {
  return (
    <>
        <Navbar/>
        <FlightRoundTrip/>
        <Footer/>
    </>
  )
}

export default roundTrip