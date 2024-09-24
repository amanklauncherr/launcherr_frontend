import React from 'react';
import styles from './flightbook.module.css'
import MainLayout from '@/components/MainLayout';

const FlightBookingDetails = () => {
    return (
        <MainLayout>
            <div className={styles["flight-booking-main-container"]}>
                <div className={styles.container}>
                    <div className={styles.header}>
                        <button className={styles.backButton}>&lt; Back to Search</button>
                        <h2>Review Your Flight Details</h2>
                    </div>

                    <div className={styles.flightDetails}>
                        <div className={styles.flightInfo}>
                            <div className={styles.flight}>
                                <div className={styles.flightTime}>
                                    <span>15:00</span>
                                    <span>30 Aug</span>
                                </div>
                                <div className={styles.flightRoute}>
                                    <span>Delhi (DEL)</span>
                                    <span>Delhi Indira Gandhi Intl</span>
                                    <div className={styles.flightDuration}>
                                        <span>2 h 30 m</span>
                                    </div>
                                </div>
                                <div className={styles.flightTime}>
                                    <span>17:30</span>
                                    <span>30 Aug</span>
                                </div>
                                <div className={styles.flightRoute}>
                                    <span>Mumbai (BOM)</span>
                                    <span>Chhatrapati Shivaji</span>
                                </div>
                            </div>
                        </div>
                            <div className={styles.flightExtra}>
                                <span>Air India AI-856</span>
                                <span>(Adult) Check-In: 15KG, Child-7 KG, Infant-7 KG</span>
                                <span>Fare Class: S | Aircraft: 359</span>
                            </div>
                        <div className={styles.fareRules}>
                            <button>Fare Rules</button>
                        </div>
                    </div>

                    <div className={styles.formSection}>
                        <h3>Traveller Details</h3>
                        <div className={styles.formRow}>
                            <label>Adult X 1</label>
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
                            <a href="#" className={styles.addFrequentFlyer}>Add Frequent Flyer Number</a>
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
                        <h3>Use GSTIN for this booking (Optional)</h3>
                        <div className={styles.gstinInput}>
                            <input className={styles.input} type="text" placeholder="Enter GSTIN" />
                            <button className={styles.addButton}>ADD</button>
                        </div>
                    </div>

                    <div className={styles.formSection}>
                        <h3>Addon Services</h3>
                        <div className={styles.addonServices}>
                            <label>Adult 1 Meal</label>
                            <select className={styles.input}>
                                <option>Select Meal</option>
                                <option>Vegetarian</option>
                                <option>Non-Vegetarian</option>
                            </select>
                        </div>
                    </div>

                    <div className={styles.fareSummary}>
                        <h4>Fare Summary</h4>
                        <p>Base Fare: ₹ 2989</p>
                        <p>Taxes: ₹ 817</p>
                        <p>Service Charges: ₹ 0</p>
                        <p>GST (+): ₹ 0</p>
                        <p>Meal (+): ₹ 0</p>
                        <p>Baggage (+): ₹ 0</p>
                        <p>Pay Amount: ₹ 3806</p>
                    </div>

                    <div className={styles.promoCode}>
                        <h4>Promo Code</h4>
                        <input className={styles.input} type="text" placeholder="Enter Your Promo Code" />
                        <button className={styles.applyButton}>Apply</button>
                    </div>

                    <button className={styles.continuePaymentButton}>Continue Payment</button>
                </div>
                <div className={styles["flight-info-container"]}>
                    <div className={styles["flight-price-info"]}>
                        <div className={styles.priceBox}>
                            <h2>Price breakdown</h2>
                            <div className={styles.priceItem}>
                                <span>Adult</span>
                                <span>Rs. 117,093.37 x 1</span>
                            </div>
                            <div className={styles.priceItem}>
                                <span>Base fare</span>
                                <span>Rs. 103,934.76</span>
                            </div>
                            <div className={styles.priceItem}>
                                <span>Taxes and fees</span>
                                <span>Rs. 13,158.61</span>
                            </div>
                            <div className={styles.priceItem}>
                                <span>Processing fee</span>
                                <span>FREE</span>
                            </div>
                            <div className={styles.total}>
                                <span>Total</span>
                                <span>Rs. 117,093.37</span>
                            </div>
                        </div>
                    </div>
                    <div className={styles['flight-about']}>
                        <h1>Flight description</h1>
                        <p>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt commodi voluptatibus laborum atque cumque incidunt neque reiciendis corrupti adipisci beatae saepe ipsa, aliquam aperiam inventore nostrum blanditiis sapiente debitis ipsam magni non quas, ut perferendis tempora quia. Sint, nostrum quas magnam aliquid voluptatem rem consequuntur neque unde labore, debitis, dolorum error possimus quaerat perspiciatis iusto deleniti odit modi provident aperiam qui minima. Iusto, praesentium, vel expedita obcaecati quia non tempora quaerat animi esse consequuntur harum commodi distinctio amet voluptates sapiente eius dicta? Explicabo eos dignissimos exercitationem sapiente, quidem delectus, eveniet vel ratione animi nemo aut magni cumque architecto voluptatem, ex earum. Facere aut nisi iure? Perferendis expedita repellendus officiis cupiditate minus iure ea mollitia nobis quasi magnam, hic officia voluptatibus dolor perspiciatis ad error? Consequuntur quisquam saepe sed a eos, velit eum voluptatum eveniet blanditiis repudiandae iusto laboriosam fuga quasi deleniti delectus numquam, quae quibusdam nesciunt culpa dignissimos ea dolore non! Facilis debitis et suscipit reiciendis, enim impedit earum distinctio nisi esse corrupti, quod iure mollitia praesentium tempore itaque expedita adipisci similique. Quasi ratione eligendi sit velit magni fugit quam, ab tenetur quisquam omnis, minus consectetur magnam in tempore voluptate vitae possimus soluta. Quibusdam sequi commodi culpa, vero praesentium eum!
                        </p>
                    </div>

                    <div className={styles["flight-description-info"]}>

                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default FlightBookingDetails;
