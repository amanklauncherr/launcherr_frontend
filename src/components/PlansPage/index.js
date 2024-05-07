import styles from './plancard.module.css';

const PlanCard = ({ title, price, features, buttonLabel }) => (
  <div className={styles.card}> 
    <h2>{title}</h2>
    <h1>
    
      {price}
    </h1>
    <ul>
      {features.map((feature, index) => (
        <li key={index}>{feature}</li>
      ))}
    </ul>
    <button className={styles.btn}>{buttonLabel}</button> 
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
        <button className={styles.btn}>Choose Plan</button> 
      </div>
    </div>
  </div>
);

export default PlansPage;
