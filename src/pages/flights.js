import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import Flights from '@/screens/FlightsModule/Flights'
import React from 'react'


const flights = () => {
  return (
    <>
    <Navbar/>
    <Flights/>
    <Footer/>
    </>
  )
}

export default flights