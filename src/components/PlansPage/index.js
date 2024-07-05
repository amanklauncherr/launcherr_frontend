import styles from './plancard.module.css';

const PlanCard = ({ price_2, title, price, features, buttonLabel }) => (
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
      <div style={{ background: "#2fcc42" }} className={styles.card}>
        <h2>Free</h2>
        <div className={styles["price-tag"]}>
          <h1>
            ₹ 0
          </h1>
        </div>
        <ul>
          <li>Find Gigs</li>
          <li>Book Travel</li>
          <li>Book Adventures</li>
        </ul>
        <button className="btn-border-white">Choose Plan</button>
      </div>

      <div style={{ background: "#009cff" }} className={styles.card}>
        <h2>Pro</h2>
        <div className={styles["price-tag"]}>
          <h1>
            ₹ 129/mo
          </h1>
            <h1>
              ₹ 999/yr
            </h1>
        </div>
        <ul>
          <li>Find Gigs</li>
          <li>Book Travel</li>
          <li>Book Adventures</li>
          <li>No Booking Fees</li>
          <li>Hodo Wallet</li>
          <li>Coupons/Vouchers</li>
          <li>Gig Connect</li>
          <li>Personalized Itinerary</li>
        </ul>
        <button className="btn-border-white">Choose Plan</button>
      </div>

      <div style={{background:"#ff37c3"}} className={styles.card}>
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
