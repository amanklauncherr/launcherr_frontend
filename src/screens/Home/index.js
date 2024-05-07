import React from 'react'
import MainLayout from '../../components/MainLayout'
import ImageLayout from '@/components/ImageLayout'
import BlankFilter from '@/components/BlankFilter'
import HomeCrumbs from '@/components/HomeCrumbs'
import PackageCard from '@/components/PackageCard'
import packagesData from './packagedata.json';
import destinationsData from './destinations.json';
import offerData from './offers.json'
import gigsData from './gigscard.json'
import DestinationCard from '@/components/DestinationCard'
import OfferCard from '@/components/OfferCard.js'
import GigsCard from '@/components/GigsCard'
import PlansPage from '@/components/PlansPage'
import ShowServices from '@/components/ShowServices'
import { useRouter } from 'next/router'

const Home = () => {

  const router = useRouter();


  const handlepackage = () => {
    router.push('/travel-package')
  }

  const handleDestination = () => {
    router.push('/destination')
  }


  const handleDeals = () => {
    router.push('/travel-offer')
  }

  const handleGigs = () => {
    router.push('/gigs')
  }

  return (
    <>
      <MainLayout>
        <ImageLayout Img_url='/images/main.png' heading="Choose You Experience">
          <ShowServices
          />
        </ImageLayout>

        <HomeCrumbs
          Crumb_About="POPULAR DESTINATION"
          Crumb_Info="TOP NOTCH DESTINATION"
          Crumb_Descripton="Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque veniam blanditiis nisi qui commodi laboriosam incidunt reprehenderit expedita minima! Atque repellendus cum accusamus magnam qui molestiae possimus voluptatum ex impedit!"
          btn_name="VIEW ALL DESTINATIONS"
          onClick={handleDestination}
        >
          {destinationsData.map((destinationItem, index) => (
            <DestinationCard
              key={index}
              {...destinationItem}
            />
          ))}
        </HomeCrumbs>
        <HomeCrumbs
          id="explore-deals"
          Crumb_About="explore NEW DEALS"
          Crumb_Info="Best Deals"
          Crumb_Descripton="Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque veniam blanditiis nisi qui commodi laboriosam incidunt reprehenderit expedita minima! Atque repellendus cum accusamus magnam qui molestiae possimus voluptatum ex impedit!"
          btn_name="VIEW ALL PACKAGES"
          onClick={handlepackage}
        >
          {packagesData.map((packageItem, index) => (
            <PackageCard
              key={index}
              {...packageItem}
            />
          ))}
        </HomeCrumbs>


        <HomeCrumbs
          Crumb_About="Choose a plan"
          Crumb_Info="Best Plans for you"
          Crumb_Descripton="Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque veniam blanditiis nisi qui commodi laboriosam incidunt reprehenderit expedita minima! Atque repellendus cum accusamus magnam qui molestiae possimus voluptatum ex impedit!"
        >
          <PlansPage />
        </HomeCrumbs>

        <HomeCrumbs
          Crumb_About="TRAVEL OFFER & DISCOUNT"
          Crumb_Info="SPECIAL TRAVEL OFFER"
          Crumb_Descripton="Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque veniam blanditiis nisi qui commodi laboriosam incidunt reprehenderit expedita minima! Atque repellendus cum accusamus magnam qui molestiae possimus voluptatum ex impedit!"
          btn_name="VIEW ALL DEALS"
          onClick={handleDeals}
        >
          {offerData.map((offerDataItem, index) => (
            <OfferCard
              key={index}
              {...offerDataItem}
            />
          ))}
        </HomeCrumbs>
        <HomeCrumbs
          id="recommended-gigs"
          Crumb_About="Recommended"
          Crumb_Info="GIGS"
          Crumb_Descripton="Aperiam sociosqu urna praesent, tristique, corrupti condimentum asperiores platea ipsum ad arcu. Nostrud. Aut nostrum, ornare quas provident laoreet nesciunt."
          btn_name="VIEW ALL GIGS"
          onClick={handleGigs}
        >
          {gigsData.map((gigsDataItem, index) => (
            <GigsCard
              key={index}
              {...gigsDataItem}
            />
          ))}
        </HomeCrumbs>
      </MainLayout>
    </>
  )
}

export default Home