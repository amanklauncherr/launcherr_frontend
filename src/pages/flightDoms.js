import React from 'react'
import FlightDoms from '../screens/FlightsModule/FlightDoms'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'

const flightDoms = () => {
    return (
        <>
            <Navbar />
            <FlightDoms />
            <Footer />
        </>
    )
}

export default flightDoms