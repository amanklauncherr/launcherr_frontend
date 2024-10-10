import React from 'react'
import styles from './flightTicket.module.css'
import MainLayout from '@/components/MainLayout';
import ImageLayout from '@/components/ImageLayout';
import TicketComponent from './TicketComponent';

const FlightTicket = () => {
    return (
        <>
            <MainLayout>
                <ImageLayout Img_url='/images/f3.png'>
                </ImageLayout>
                <div className={styles["ticket-cotnainer-inner-container"]}>
                <TicketComponent/>
                </div>
            </MainLayout>
        </>
    )
}

export default FlightTicket