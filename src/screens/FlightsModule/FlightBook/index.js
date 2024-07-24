import React from 'react'
import styles from './flightbook.module.css'
import MainLayout from '@/components/MainLayout'

const FlightBook = () => {
    return (
        <>
            <MainLayout>
                
                <div className={styles["flight-booking-main-container"]}>
                    <div className={styles["form-container"]}>
                        <form action="">
                            <div className={styles.container}>
                                <h2 className={styles.title}>Contact details</h2>
                                <p className={styles.subtitle}>This is where your E-ticket will be sent</p>
                                <form>
                                    <label htmlFor="firstName" className={styles.label}>First name</label>
                                    <input type="text" id="firstName" placeholder="First name" className={styles.input} />

                                    <label htmlFor="lastName" className={styles.label}>Last name</label>
                                    <input type="text" id="lastName" placeholder="Last name" className={styles.input} />

                                    <div className={styles.row}>
                                        <div>
                                            <label htmlFor="mobileNumber" className={styles.label}>Mobile number</label>
                                            <input type="text" id="mobileNumber" placeholder="Mobile number" className={styles.input} />
                                        </div>
                                    </div>

                                    <label htmlFor="email" className={styles.label}>Email</label>
                                    <input type="email" id="email" placeholder="Email" className={styles.input} />
                                </form>
                            </div>
                        </form>
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
        </>
    )
}

export default FlightBook