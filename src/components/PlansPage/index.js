import styles from './plancard.module.css';

const plansData = [
  {
    title: "Free",
    price: "₹ 0",
    features: ["Find Gigs", "Book Travel", "Book Adventures"],
    buttonLabel: "Choose Plan",
    backgroundColor: "#2fcc42",
  },
  {
    title: "Pro",
    price: "₹ 129/mo",
    price_2: "₹ 999/yr",
    features: [
      "Find Gigs", "Book Travel", "Book Adventures", "No Booking Fees",
      "Hodo Wallet", "Coupons/Vouchers", "Gig Connect", "Personalized Itinerary"
    ],
    buttonLabel: "Choose Plan",
    backgroundColor: "#009cff",
  },
  {
    title: "Enterprise",
    price: "Let's Talk",
    features: [
      "All pro features", "Dedicated environment", "Enterprise account administration",
      "Premium support and services"
    ],
    buttonLabel: "Choose Plan",
    backgroundColor: "#ff37c3",
  }
];

const PlanCard = ({ title, price, price_2, features, buttonLabel, backgroundColor }) => (
  <div className={styles.card} style={{ backgroundColor }}>
    <h2>{title}</h2>
    <div className={styles["price-tag"]}>
      <h1>{price}</h1>
      {price_2 && <h2>{price_2}</h2>}
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
      {plansData.map((plan, index) => (
        <PlanCard key={index} {...plan} />
      ))}
    </div>
  </div>
);

export default PlansPage;
