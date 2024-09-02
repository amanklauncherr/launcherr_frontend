import React from 'react';
import styles from './flightbook.module.css'
import MainLayout from '@/components/MainLayout';

const HotelBook = () => {
    return (
        <MainLayout>
            <div className={styles["hotel-booking-main-container"]}>
                <div className={styles.container}>
                    <div className={styles.header}>
                        <button className={styles.backButton}>&lt; Back to Hotel Search</button>
                        <h2>Review Your Hotel Details</h2>
                    </div>

                    <div className={styles.hotelDetails}>
                        <div className={styles.hotelInfo}>
                            <h3>Hotel Name</h3>
                            <p>Location: XYZ Street, City</p>
                            <p>Check-in: 15:00, 30 Aug</p>
                            <p>Check-out: 12:00, 2 Sep</p>
                            <p>Room Type: Deluxe Suite</p>
                        </div>
                    </div>

                    <div className={styles.formSection}>
                        <h3>Guest Details</h3>
                        <div className={styles.formRow}>
                            <label>Guest 1</label>
                            <div className={styles.inputGroup}>
                                <select className={styles.input}>
                                    <option>Title</option>
                                    <option>Mr.</option>
                                    <option>Ms.</option>
                                </select>
                                <input className={styles.input} type="text" placeholder="First Name" />
                                <input className={styles.input} type="text" placeholder="Last Name" />
                                <input className={styles.input} type="date" />
                            </div>
                        </div>
                    </div>

                    <div className={styles.formSection}>
                        <h3>Contact Details</h3>
                        <div className={styles.formRow}>
                            <div className={styles.contactInputGroup}>
                                <select className={styles.input}>
                                    <option>India (91)</option>
                                    <option>USA (1)</option>
                                </select>
                                <input className={styles.input} type="text" placeholder="Mobile Number" />
                                <input className={styles.input} type="email" placeholder="Email" />
                            </div>
                        </div>
                    </div>

                    <div className={styles.formSection}>
                        <h3>Special Requests (Optional)</h3>
                        <input className={styles.input} type="text" placeholder="Enter your requests" />
                    </div>

                    <div className={styles.formSection}>
                        <h3>Addon Services</h3>
                        <div className={styles.addonServices}>
                            <label>Meal Plan</label>
                            <select className={styles.input}>
                                <option>Select Meal Plan</option>
                                <option>Breakfast</option>
                                <option>All-Inclusive</option>
                            </select>
                        </div>
                    </div>

                    <div className={styles.fareSummary}>
                        <h4>Fare Summary</h4>
                        <p>Room Rate: ₹ 5000/night</p>
                        <p>Taxes: ₹ 500</p>
                        <p>Service Charges: ₹ 0</p>
                        <p>Pay Amount: ₹ 5500</p>
                    </div>

                    <div className={styles.promoCode}>
                        <h4>Promo Code</h4>
                        <input className={styles.input} type="text" placeholder="Enter Your Promo Code" />
                        <button className={styles.applyButton}>Apply</button>
                    </div>

                    <button className={styles.continuePaymentButton}>Continue Payment</button>
                </div>
                <div className={styles["hotel-info-container"]}>
                    <div className={styles["hotel-price-info"]}>
                        <div className={styles.priceBox}>
                            <h2>Price breakdown</h2>
                            <div className={styles.priceItem}>
                                <span>Room Rate</span>
                                <span>₹ 5000/night</span>
                            </div>
                            <div className={styles.priceItem}>
                                <span>Taxes and fees</span>
                                <span>₹ 500</span>
                            </div>
                            <div className={styles.total}>
                                <span>Total</span>
                                <span>₹ 5500</span>
                            </div>
                        </div>
                    </div>
                    <div className={styles['hotel-about']}>
                        <h1>Hotel description</h1>
                        <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt commodi voluptatibus laborum atque cumque incidunt neque reiciendis corrupti adipisci beatae saepe ipsa, aliquam aperiam inventore nostrum blanditiis sapiente debitis ipsam magni non quas, ut perferendis tempora quia. Sint, nostrum quas magnam aliquid voluptatem rem consequuntur neque unde labore, debitis, dolorum error possimus quaerat perspiciatis iusto deleniti odit modi provident aperiam qui minima. Iusto, praesentium, vel expedita obcaecati quia non tempora quaerat animi esse consequuntur harum commodi distinctio amet voluptates sapiente eius dicta? Explicabo eos dignissimos exercitationem sapiente, quidem delectus, eveniet vel ratione animi nemo aut magni cumque architecto voluptatem, ex earum. Facere aut nisi iure? Perferendis expedita repellendus officiis cupiditate minus iure ea mollitia nobis quasi magnam, hic officia voluptatibus dolor perspiciatis ad error? Consequuntur quisquam saepe sed a eos, velit eum voluptatum eveniet blanditiis repudiandae iusto laboriosam fuga quasi deleniti delectus numquam, quae quibusdam nesciunt culpa dignissimos ea dolore non! Facilis debitis et suscipit reiciendis, enim impedit earum distinctio nisi esse corrupti, quod iure mollitia praesentium tempore itaque expedita adipisci similique. Quasi ratione eligendi sit velit magni fugit quam, ab tenetur quisquam omnis, minus consectetur magnam in tempore voluptate vitae possimus soluta. Quibusdam sequi commodi culpa, vero praesentium eum!
                        </p>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default HotelBook;
