import ImageLayout from '@/components/ImageLayout'
import MainLayout from '@/components/MainLayout'
import React from 'react'
import styles from './stays.module.css'
import HotelSearch from './HotelSearch'
import HotelCard from './HotelCard'

const Stays = () => {

  const hotelData = {
    image: 'https://media.istockphoto.com/id/1453121684/photo/modern-hotel-room-with-double-bed-night-tables-and-day-sofa-bed.webp?b=1&s=170667a&w=0&k=20&c=0MGlloRKwQjR_xeIt0s0IklHyt2bQHDNoFvKml3BQPc=',
    name: 'Flagship Saharsh Hotel',
    location: 'Patna',
    mapLink: '#',
    distance: '2.2 km',
    roomType: 'Standard Double Room',
    bedType: '1 large double bed',
    reviewScore: '4.2',
    reviewsCount: '35',
    oldPrice: '25,777',
    newPrice: '14,951',
    taxes: '2,440'
};


  return (
    <MainLayout>
      <ImageLayout Img_url='/images/product.png' heading='Stays'>
        <HotelSearch />
      </ImageLayout>
         <div className={styles["hotel-inner-container"]}>
         <HotelCard hotel={hotelData} />
         </div>
    </MainLayout>
  )
}

export default Stays