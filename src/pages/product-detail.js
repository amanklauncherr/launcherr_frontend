import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import Book from '@/screens/Book'
import ProductDetail from '@/screens/ProductDetail.js'
import React from 'react'

const Index = () => {
    return (
        <>
            <Navbar />
            <ProductDetail/>
            <Footer />
        </>
    )
}

export default Index

