import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import React from 'react'
import FlightBook from '@/screens/FlightsModule/FlightBook'

const flight_book = () => {
  return (
    <>
    <Navbar/>
    <FlightBook/>
    <Footer/>
    </>
  )
}

export default flight_book