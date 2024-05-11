import styles from './plancard.module.css';

const PlanCard = ({price_2, title, price, features, buttonLabel }) => (
  <div className={styles.card}> 
    <h2>{title}</h2>
    <div className={styles["price-tag"]}>

    <h1>
      {price}
    </h1>
     <h2>
     {price_2 && 
      <>
        {price_2}
      </>
      }
     </h2>
    </div>
    <ul>
      {features.map((feature, index) => (
        <li key={index}>{feature}</li>
      ))}
    </ul>
    <button className="btn-border-white">{buttonLabel}</button> 
  </div>
);

const PlansPage = () => (
  <div className={styles.container}> 
    <div className={styles.cards}> 
      <PlanCard
        title="Free"
        price="₹ 0"
        features={[
          "Find Gigs",
          "Book Travel",
          "Book Adventures",
        ]}
        buttonLabel="Choose Plan"
      />
      <PlanCard
        title="Pro"
        price="₹ 129/mo"
        price_2="₹ 999/yr"
        
        features={[
          "Find Gigs",
          "Book Travel",
          "Book Adventures",
          "No Booking Fees",
          "Hodo Wallet",
          "Coupons/Vouchers",
          "Gig Connect",
          "Personalized Itinerary"
        ]}
        buttonLabel="Choose Plan"
      />
      <div className={styles.card}>
        <h2>Enterprise</h2>
        <h1>Let's Talk</h1>
        <ul>
          <li>All pro features</li>
          <li>Dedicated environment</li>
          <li>Enterprise account administration</li>
          <li>Premium support and services</li>
        </ul>
        <button className="btn-border-white">Choose Plan</button> 
      </div>
    </div>
  </div>
);

export default PlansPage;
