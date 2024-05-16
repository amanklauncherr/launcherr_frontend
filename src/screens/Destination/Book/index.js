import ImageLayout from '@/components/ImageLayout'
import MainLayout from '@/components/MainLayout'
import React from 'react'
import styles from './book.module.css'
import CustomCarousel from '@/components/CustomCarousel'

const Book = () => {
    return (
        <>
            <MainLayout>
                <ImageLayout Img_url='/images/book.png' heading='Book Now'>

                </ImageLayout>

                <div className={styles['book-main-container']}>
                    <div className={styles["book-main-about"]}>
                        <h1 className={styles["heading"]}>
                            EXPERIENCE THE NATURAL BEAUTY OF ISLAND
                        </h1>
                        <div className={styles["image-container"]}>
                            <CustomCarousel>
                                <div>
                                    <img src="/images/one.jpg" alt="" />
                                </div>
                                <div>
                                    <img src="/images/two.jpg" alt="" />
                                </div>
                                <div>
                                    <img src="/images/three.jpg" alt="" />
                                </div>

                            </CustomCarousel>
                            <div class={styles["package-belw"]}>
                                <ul>
                                    <li>
                                        <i class="far fa-clock"></i>
                                        6 days / 5 night
                                    </li>
                                    <li>
                                        <i class="fas fa-user-friends"></i>
                                        People: 4
                                    </li>
                                    <li>
                                        <i class="fas fa-map-marked-alt"></i>
                                        Norway
                                    </li>
                                </ul>
                            </div>

                        </div>

                        <div className={styles["boking-details"]}>
                            <div className={styles["boking-details-inner"]}>
                                <h1>DESCRIPTION</h1>
                                <p>
                                    Occaecat pariatur! Quaerat ligula, ab, consequuntur orci mus ultricies praesent aute blandit beatae nisl aut, totam mauris rhoncus? Tellus netus fringilla class auctor dui. Dolores excepteur, doloribus, blanditiis aliquip nisl. Occaecat iusto? Provident sociis rerum. Amet, asperiores molestie varius eos! Libero, fermentum fermentum totam! Sunt praesentium, totam. Excepteur platea nisl. Convallis aliquam? Iaculis erat ipsa molestie, quod, vestibulum reiciendis, maxime nostra, integer unde officiis quo integer unde officiis quo.
                                </p>
                                <p>
                                    Occaecat pariatur! Quaerat ligula, ab, consequuntur orci mus ultricies praesent aute blandit beatae nisl aut, totam mauris rhoncus? Tellus netus fringilla class auctor dui. Dolores excepteur, doloribus, blanditiis aliquip nisl..
                                </p>
                                <ul>
                                    <li>Travel cancellation insurance</li>
                                    <li>Breakfast and dinner included</li>
                                    <li>Health care included</li>
                                    <li>Transfer to the airport and return to the agency</li>
                                    <li>Lorem ipsum dolor sit amet, consectetur adipiscing</li>
                                </ul>
                            </div>
                            <div className={styles["boking-details-inner"]}>
                                <h1>Program</h1>
                                <p className={styles["program-info"]}>
                                    Dolores maiores dicta dolore. Natoque placeat libero sunt sagittis debitis? Egestas non non qui quos, semper aperiam lacinia eum nam! Pede beatae. Soluta, convallis irure accusamus voluptatum ornare saepe cupidatat.
                                </p>
                                <div class={styles["timeline-content"]}>
                                    <div class={styles["day-count"]}>
                                         <p>Day <br /> 1</p>
                                        </div>
                                    <h4>Ancient Rome Visit</h4>
                                    <p>Nostra semper ultricies eu leo eros orci porta provident, fugit? Pariatur interdum assumenda, qui aliquip ipsa! Dictum natus potenti pretium.</p>
                                </div>
                                <div class={styles["timeline-content"]}>
                                    <div class={styles["day-count"]}>
                                         <p>Day <br /> 2</p>
                                        </div>
                                    <h4>Classic Rome Sightseeing</h4>
                                    <p>Nostra semper ultricies eu leo eros orci porta provident, fugit? Pariatur interdum assumenda, qui aliquip ipsa! Dictum natus potenti pretium.</p>
                                </div>
                                <div class={styles["timeline-content"]}>
                                    <div class={styles["day-count"]}>
                                         <p>Day <br /> 3</p>
                                        </div>
                                    <h4>Vatican City Visit</h4>
                                    <p>Nostra semper ultricies eu leo eros orci porta provident, fugit? Pariatur interdum assumenda, qui aliquip ipsa! Dictum natus potenti pretium.</p>
                                </div>
                                <div class={styles["timeline-content"]}>
                                    <div class={styles["day-count"]}>
                                         <p>Day <br /> 4</p>
                                        </div>
                                    <h4>Italian Food Tour</h4>
                                    <p>Nostra semper ultricies eu leo eros orci porta provident, fugit? Pariatur interdum assumenda, qui aliquip ipsa! Dictum natus potenti pretium.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles["book-main-form"]}>
                       
                    </div>
                </div>
            </MainLayout>
        </>
    )
}

export default Book