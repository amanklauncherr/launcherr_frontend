import styles from './plancard.module.css';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { getCookie } from 'cookies-next';

const plansData = [
  {
    title: "Free",
    price: "₹ 0",
    features: ["Find Gigs", "Book Travel", "Book Adventures"],
    backgroundColor: "#2fcc42",
  },
  {
    title: "Pro",
    subscription_id: 1,
    price: "₹ 129/mo",
    features: [
      "Find Gigs", "Book Travel", "Book Adventures", "No Booking Fees",
      "Hodo Wallet", "Coupons/Vouchers", "Gig Connect", "Personalized Itinerary"
    ],
    buttonLabel: "Choose Plan",
    backgroundColor: "#009cff",
  },
  {
    title: "Enterprise",
    subscription_id: 2, // Add subscription_id for the Enterprise plan
    price: "Let's Talk",
    features: [
      "All pro features", "Dedicated environment", "Enterprise account administration",
      "Premium support and services"
    ],
    // buttonLabel: "Choose Plan",
    backgroundColor: "#ff37c3",
  }
];

const PlanCard = ({ title, price, price_2, features, buttonLabel, backgroundColor, subscription_id }) => {
  const reduxToken = useSelector((state) => state?.token?.publicToken);
  
  const handleClick = async () => {
    let bearerToken = '';
    const cookiesToken = getCookie('auth_token');
    window.location.href = `https://shubhangverma.com/phonepe.php?amount=129`;
    if (cookiesToken) {
      bearerToken = cookiesToken;
    } else {
      bearerToken = reduxToken;
    }

    try {
      const response = await axios.post(
        'https://api.launcherr.co/api/add/User/Subscription',
        { subscription_id },
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
        }
      );
      console.log('Subscription successful:', response.data);
      // Handle success (e.g., show a success message, navigate to another page, etc.)
    } catch (error) {
      console.error('Subscription failed:', error);
      // Handle error (e.g., show an error message)
    }
  };

  return (
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
      {buttonLabel && (
        <button className="btn-border-white" onClick={handleClick}>
          {buttonLabel}
        </button>
      )}
    </div>
  );
};

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
