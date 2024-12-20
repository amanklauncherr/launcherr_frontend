import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MainLayout from '../../components/MainLayout';
import ImageLayout from '@/components/ImageLayout';
import BlankFilter from '@/components/BlankFilter';
import HomeCrumbs from '@/components/HomeCrumbs';
import PackageCard from '@/components/PackageCard';
import packagesData from './packagedata.json';
import productData from './productdata.json';
import offerData from './offers.json';
import DestinationCard from '@/components/DestinationCard';
import OfferCard from '@/components/OfferCard.js';
import GigsCard from '@/components/GigsCard';
import PlansPage from '@/components/PlansPage';
import ShowServices from '@/components/ShowServices';
import { useRouter } from 'next/router';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import CustomCarousel from '@/components/CustomCarousel';
import ProductCard from '@/components/ProductCard';
import ImageLayoutHome from '@/components/ImageLayout/ImageLayoutHome';
import { getCookie } from 'cookies-next';
import { useSelector } from 'react-redux';
import EmptyHotel from '@/components/EmptyHotel';

const Home = () => {
  const router = useRouter();
  const [bannerData, setBannerData] = useState([]);
  const [jobsData, setJobsData] = useState([]);
  const [fetchedProductData, setFetchedProductData] = useState([]);
  const [fetchSectionData, setfetchSectionData] = useState()
  const [destinationData, setDestinationData] = useState([]);
  const reduxToken = useSelector((state) => state?.token?.publicToken);


  // console.log('fetchSectionData', fetchSectionData)

  useEffect(() => {
    const fetchBannerData = async () => {
      try {
        const response = await axios.get('https://api.launcherr.co/api/Show-Banner');
        setBannerData(response.data);
      } catch (error) {
        console.error('Error fetching banner data:', error);
      }
    };

    fetchBannerData();
  }, []);


  useEffect(() => {
    const fetchDestinationData = async () => {
      try {
        const response = await axios.get('https://api.launcherr.co/api/showDestination');
        setDestinationData(response.data.data);
      } catch (error) {
        console.error('Error fetching destination data:', error);
      }
    };

    fetchDestinationData();
  }, []);


  useEffect(() => {
    const fetchSectionData = async () => {
      try {
        const response = await axios.get('https://api.launcherr.co/api/Show-Section');
        setfetchSectionData(response.data);
      } catch (error) {
        console.error('Error fetching banner data:', error);
      }
    };

    fetchSectionData();
  }, []);


  let bearerToken = '';
  const cookiesToken = getCookie('auth_token');

  if (cookiesToken) {
    bearerToken = cookiesToken;
  } else {
    bearerToken = process.env.NEXT_PUBLIC_TOKEN;
  }


  useEffect(() => {

    const fetchJobsData = async (payload) => {
      try {
        const headers = {
          Authorization: `Bearer ${bearerToken}`,
        };

        const response = await axios.get('https://api.launcherr.co/api/searchJob', {
          params: payload,
          headers: headers
        });

        setJobsData(response.data?.job);
      } catch (error) {
        console.error('Error fetching jobs data:', error);
      }
    };

    fetchJobsData();
  }, []);

  useEffect(() => {
    const fetchProductData = async () => {
      const username = 'ck_468f7eb4fc82073df8c1c9515d20562e7dbe37d7';
      const password = 'cs_36993c1a76e77b5c58269bddc4bd3b452319beca';
      const authHeader = 'Basic ' + btoa(`${username}:${password}`);

      try {
        const response = await axios.get('https://ecom.launcherr.co/wp-json/wc/v3/products?per_page=100', {
          headers: {
            Authorization: authHeader,
          },
        });
        setFetchedProductData(response.data);
        console.log("product ka datadfedfd", response.data);
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    };

    fetchProductData();
  }, []);

  const handlepackage = () => {
    router.push('/travel-package');
  };

  const handleDestination = () => {
    router.push('/destination');
  };

  const handleDeals = () => {
    router.push('/travel-offer');
  };

  const handleGigs = () => {
    router.push('/gigs');
  };

  const handleproduct = () => {
    router.push('/products');
  };

  const handleButtonClick = (buttonText) => {
    switch (buttonText) {
      case "Shop Now!":
        router.push('/products');
        break;
      case "Find Gigs!":
        router.push('/gigs');
        break;
      case "Explore Now!":
        router.push('/flights');
        break;
      default:
        alert('Raise the Ticket if you find bug')
        break;
    }
  };

  return (
    <>
      <MainLayout>
        <CustomCarousel>
          {Array.isArray(bannerData) && bannerData.length > 0 ? (
            bannerData.map((bannerItem, index) => (
              <>
                <ImageLayoutHome
                  key={index}
                  Img_url={bannerItem.Banner_image}
                  heading={bannerItem.Banner_heading}
                  subheading={bannerItem.Banner_sub_heading}
                >
                  <button className='Explore mobhide' onClick={() => handleButtonClick(bannerItem.Banner_button_text)}>
                    {bannerItem.Banner_button_text}<svg width="19" height="16" viewBox="0 0 19 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1.11437 14.2374C0.78199 14.4845 0.712923 14.9544 0.960103 15.2868C1.20728 15.6191 1.67711 15.6882 2.00948 15.441L1.11437 14.2374ZM18.6802 2.76971C18.7405 2.3599 18.4571 1.97884 18.0473 1.9186L11.3691 0.936865C10.9593 0.876621 10.5782 1.16 10.518 1.56981C10.4577 1.97962 10.7411 2.36067 11.1509 2.42092L17.0871 3.29357L16.2144 9.22977C16.1542 9.63958 16.4376 10.0206 16.8474 10.0809C17.2572 10.1411 17.6383 9.85774 17.6985 9.44793L18.6802 2.76971ZM2.00948 15.441L18.3858 3.26245L17.4906 2.0588L1.11437 14.2374L2.00948 15.441Z" fill="white" />
                    </svg>
                  </button>
                </ImageLayoutHome>
                <button className='Explore explore-mob webhide' onClick={() => handleButtonClick(bannerItem.Banner_button_text)}>
                  {bannerItem.Banner_button_text}<svg width="19" height="16" viewBox="0 0 19 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.11437 14.2374C0.78199 14.4845 0.712923 14.9544 0.960103 15.2868C1.20728 15.6191 1.67711 15.6882 2.00948 15.441L1.11437 14.2374ZM18.6802 2.76971C18.7405 2.3599 18.4571 1.97884 18.0473 1.9186L11.3691 0.936865C10.9593 0.876621 10.5782 1.16 10.518 1.56981C10.4577 1.97962 10.7411 2.36067 11.1509 2.42092L17.0871 3.29357L16.2144 9.22977C16.1542 9.63958 16.4376 10.0206 16.8474 10.0809C17.2572 10.1411 17.6383 9.85774 17.6985 9.44793L18.6802 2.76971ZM2.00948 15.441L18.3858 3.26245L17.4906 2.0588L1.11437 14.2374L2.00948 15.441Z" fill="white" />
                  </svg>
                </button>
              </>
            ))
          ) : (
            <>
              <EmptyHotel />
            </>
          )}

        </CustomCarousel>
        {/* Destination */}


        {/* <HomeCrumbs
          Crumb_About="Featured Escapes"
          Crumb_Info={fetchSectionData?.Destination?.heading}
          Crumb_Descripton={fetchSectionData?.Destination?.['sub-heading']}
          btn_name="VIEW ALL DESTINATIONS"
          onClick={handleDestination}
        >
          {destinationData.map((destinationItem, index) => (
            <DestinationCard key={index} {...destinationItem} />
          ))}
        </HomeCrumbs> */}



        {/* 
        <HomeCrumbs
          id="explore-deals"
          Crumb_About="Sky-High Deals"
          Crumb_Info={fetchSectionData?.Deals?.heading}
          Crumb_Descripton={fetchSectionData?.Deals?.['sub-heading']}
          btn_name="VIEW ALL PACKAGES"
          onClick={handlepackage}
        >
          {packagesData.map((packageItem, index) => (
            <PackageCard key={index} {...packageItem} />
          ))}
        </HomeCrumbs>  */}

        <HomeCrumbs
          id="explore-products"
          Crumb_About="Wanderlust Essentials"
          Crumb_Info={fetchSectionData?.Products?.heading}
          Crumb_Descripton={fetchSectionData?.Products?.['sub-heading']}
          btn_name="VIEW ALL PRODUCTS"
          onClick={handleproduct}
        >
          {fetchedProductData.length > 0 ? (
            fetchedProductData
              .filter(productItem => productItem.status !== 'draft') // Filter out products with 'draft' status
              .slice(0, 3) // Limit the result to the first 3 products
              .map((productItem) => (
                <ProductCard
                  key={productItem?.id}
                  ProductId={productItem?.id}
                  about={productItem?.name}
                  status={productItem?.status}
                  description={productItem?.description}
                  img_url={productItem?.images?.length > 0 ? productItem.images[0].src : ''}
                  regular_price={productItem.regular_price}
                  amount={productItem.price}
                  average_rating={productItem.average_rating}
                  rating_count={productItem.rating_count}
                  short_description={productItem?.short_description}
                />
              ))
          ) : (
            <>
              <EmptyHotel />
            </>
          )}
        </HomeCrumbs>




        {/* <HomeCrumbs
          Crumb_About="TRAVEL OFFER & DISCOUNT"
          Crumb_Info="SPECIAL TRAVEL OFFER"
          // Crumb_Descripton="Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque veniam blanditiis nisi qui commodi laboriosam incidunt reprehenderit expedita minima! Atque repellendus cum accusamus magnam qui molestiae possimus voluptatum ex impedit!"
          btn_name="VIEW ALL DEALS"
          onClick={handleDeals}
        >
          {offerData.map((offerDataItem, index) => (
            <OfferCard key={index} {...offerDataItem} />
          ))}
        </HomeCrumbs> */}

        <HomeCrumbs
          id="recommended-gigs"
          Crumb_About="Recommended"
          Crumb_Info={fetchSectionData?.Gigs?.heading}
          Crumb_Descripton={fetchSectionData?.Gigs?.['sub-heading']}
          btn_name="VIEW ALL GIGS"
          onClick={handleGigs}
        >
          {Array.isArray(jobsData) && jobsData.length > 0 ? (
            jobsData.slice(0, 6).map((gigsDataItem, index) => (
              <GigsCard key={index} {...gigsDataItem} />
            ))
          ) : (
            <>
              <EmptyHotel />
            </>
          )}
        </HomeCrumbs>
        {/* <HomeCrumbs
          id="plans"
          Crumb_About="Choose a plan"
          Crumb_Info={fetchSectionData?.Subscription?.heading}
          Crumb_Descripton={fetchSectionData?.Subscription?.['sub-heading']}
        >
          <PlansPage />
        </HomeCrumbs>  */}
      </MainLayout>
    </>
  );
};

export default Home;
