import React from 'react';
import styles from './hotelcard.module.css';

 const HotelCard = ({ offer }) => {
 const { hotel, offers } = offer;
 const { name, cityCode, latitude, longitude } = hotel;
 const { price, room, checkInDate, checkOutDate } = offers[0];

    return (
        <div className={styles.card}>
            <div className={styles.imageContainer}>
                <img src='https://media.istockphoto.com/id/1453121684/photo/modern-hotel-room-with-double-bed-night-tables-and-day-sofa-bed.webp?b=1&s=170667a&w=0&k=20&c=0MGlloRKwQjR_xeIt0s0IklHyt2bQHDNoFvKml3BQPc=' alt={hotel.name} className={styles.image} />
                <button className={styles.wishlistButton}>❤️</button>
            </div>
            <div className={styles.detailsContainer}>
                <div className={styles.header}>
                    <h2 className={styles.hotelName}>{name} 
                    </h2>
                    <br />
                    <p>
                    {room.description.text}
                    </p>
                    {/* <span className={styles.featuredBadge}>Featured</span> */}
                </div>
                <div className={styles.location}>
                    <span style={{marginBottom:"20px"}}>Check in date {checkInDate}</span> <br />
                    <span>Check out date {checkOutDate}</span>
                </div>
                <div className={styles.roomDetails}>
                    <span className={styles.roomType}>{hotel.roomType}</span>
                    <span>{hotel.bedType}</span>
                </div>
                <div className={styles.cancellation}>
                    <p>✔️ {room.typeEstimated.category}</p>
                    <p>✔️ {room.typeEstimated.beds} beds</p>
                    <p>✔️ bedType {room.typeEstimated.bedType} </p>
                </div>
            </div>
            <div className={styles.pricingContainer}>
                {/* <div className={styles.review}>
                    <div className={styles.reviewScore}>{hotel.reviewScore}</div>
                    <span>{hotel.reviewsCount} reviews</span>
                </div> */}
                <div className={styles.price}>
                    <span className={styles.newPrice}>{price.currency} {price.total}</span>
                    {/* <span className={styles.taxes}>+₹{hotel.taxes} taxes and charges</span> */}
                </div>
                {/* <button className={styles.availabilityButton}>See availability</button> */}
            </div>
        </div>
    );
};

export default HotelCard;


// import React from 'react';
// import styles from './HotelCard.module.css'; // Create this CSS file for styling

// const HotelCard = ({ offer }) => {
//   const { hotel, offers } = offer;
//   const { name, cityCode, latitude, longitude } = hotel;
//   const { price, room, checkInDate, checkOutDate } = offers[0];

//   return (
//     <div className={styles.card}>
//       <h2>{name}</h2>
//       <p><strong>Location:</strong> {cityCode} ({latitude}, {longitude})</p>
//       <p><strong>Check-in:</strong> {checkInDate}</p>
//       <p><strong>Check-out:</strong> {checkOutDate}</p>
//       <p><strong>Room:</strong> {room.typeEstimated.category} - {room.description.text}</p>
//       <p><strong>Price:</strong> {price.currency} {price.total}</p>
//     </div>
//   );
// }

// export default HotelCard;
