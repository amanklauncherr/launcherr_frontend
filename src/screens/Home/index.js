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

const Home = () => {
  const items = ['Hotels', 'Activites', 'Events', 'Holiday Deals', 'Products', 'Gigs', 'Tour Guide'];

  const handleItemClick = (item) => {
    if (item === 'home') {
      alert("home")
    }
    if (item === 'Activites') {
      alert("Activites")
    }
    // console.log(`Clicked ${item}`);
  };

  const handlepackage = () => {
    console.log("package_click")
  }

  const handleDestination = () => {
    console.log("handleDestination")
  }


  const handleDeals = () => {
    console.log("handleDeals")
  }

  const handleGigs = () => {
    console.log("handleGigs")
  }

  return (
    <>
      <MainLayout>
        <ImageLayout Img_url='/images/main.png' heading="Choose You Experience">
          <BlankFilter
            items={items}
            onItemClick={handleItemClick}
          />
        </ImageLayout>
        <HomeCrumbs
          Crumb_About="explore greate package"
          Crumb_Info="POPULAR PACKAGES "
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