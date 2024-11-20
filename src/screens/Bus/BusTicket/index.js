import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import styles from './busticket.module.css';
import MainLayout from '@/components/MainLayout';
import ImageLayout from '@/components/ImageLayout';
import BusBookingDetails from '../BusBookingDetails';
import Cookies from 'js-cookie';

const BusTicket = () => {
  const router = useRouter();
  const [ticketData, setTicketData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (router.isReady) {
      const referenceId = router.query.referenceId;
      if (referenceId) {
        fetchTicketDetails(referenceId);
      }
    }
  }, [router.isReady, router.query]);
  const fetchTicketDetails = async (referenceId) => {
    const authToken = Cookies.get('auth_token');
    if (authToken) {
    try {
      const response = await axios.post('https://api.launcherr.co/api/Check/Ticket', {
        headers: { 
          Authorization: `Bearer ${authToken}` 
        }
      }, {
        referenceId: referenceId,
      });
      console.log(response)
      if (response.data.status) {
        setTicketData(response.data.payloads.data);
      } else {
        setError("Failed to fetch ticket details.");
      }
    } catch (error) {
      setError("An error occurred while fetching the ticket details.");
    } finally {
      setLoading(false);
    }
  }
  };

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>{error}</p>;

  return (
    <MainLayout>
      <ImageLayout Img_url='/images/f3.png' />
      <div className={styles["ticket-container-inner-container"]}>
        {/* {ticketData && ( */}
          <div className={styles["ticket-details"]}>
            <h2>Ticket Details</h2>
            <p><strong>Status:</strong> {'ticketData.bookingStatus'}</p>
            <p><strong>Bus Type:</strong> {'ticketData.busType'}</p>
            <p><strong>Date of Journey:</strong> {'ticketData.dateOfJourney'}</p>

            <h3>Pickup Details</h3>
            <p><strong>Pickup Location:</strong> {'ticketData.pickupDetails.pickupLocation'}</p>
            <p><strong>Pickup Time:</strong> {'ticketData.pickupDetails.pickupTime'}</p>
            <p><strong>Source City:</strong> {'ticketData.pickupDetails.sourceCity'}</p>

            <h3>Drop Details</h3>
            <p><strong>Drop Location:</strong> {'ticketData.dropDetails.dropLocation'}</p>
            <p><strong>Drop Time:</strong> {'ticketData.dropDetails.dropTime'}</p>
            <p><strong>Destination City:</strong> {'ticketData.dropDetails.destinationCity'}</p>

            <h3>Passenger Info</h3>
            <p><strong>Name:</strong> {'ticketData.inventoryItems.passenger.name'}</p>
            <p><strong>Age:</strong> {'ticketData.inventoryItems.passenger.age'}</p>
            <p><strong>Gender:</strong> {'ticketData.inventoryItems.passenger.gender'}</p>
            <p><strong>Mobile:</strong> {'ticketData.inventoryItems.passenger.mobile'}</p>

            <h3>Fare Details</h3>
            <p><strong>Base Fare:</strong> {'ticketData.inventoryItems.baseFare'}</p>
            <p><strong>Service Tax:</strong> {'ticketData.inventoryItems.serviceTax'}</p>
            <p><strong>Total Fare:</strong> {'ticketData.inventoryItems.fare'}</p>

            <h3>Other Details</h3>
            <p><strong>Travel Agency:</strong> {'ticketData.travels'}</p>
            <p><strong>Ticket ID (TIN):</strong> {'ticketData.tin'}</p>
            {/* <p><strong>M-Ticket Enabled:</strong> {ticketData.MTicketEnabled ? 'Yes' : 'No'}</p> */}
          </div>
        {/* )} */}


        <BusBookingDetails/>
      </div>
    </MainLayout>
  );
};

export default BusTicket;
