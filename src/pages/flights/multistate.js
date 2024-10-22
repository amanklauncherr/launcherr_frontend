import React from 'react'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import FlightMultiState from '../../screens/FlightsModule/FlightMultiState'

const multistate = () => {
  return (
    <>
    <Navbar/>
     <FlightMultiState/>
    <Footer/>
    </>
  )
}

export default multistate