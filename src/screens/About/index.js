import HomeCrumbs from '@/components/HomeCrumbs'
import ImageLayout from '@/components/ImageLayout'
import MainLayout from '@/components/MainLayout'
import React from 'react'
import styles from './about.module.css'


const About = () => {
    return (
        <>
            <MainLayout>
                <ImageLayout Img_url="/images/about.png" heading="About Us">

                </ImageLayout>
                <HomeCrumbs
                    Crumb_About="OUR TOUR GALLERY"
                    Crumb_Info="
    HELLO. OUR AGENCY HAS BEEN PRESENT BEST IN THE MARKET"
                    Crumb_Descripton="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.Placeat nostrud natus tempora justo. Laboriosam, eget mus nostrud natus tempora.

    Lorem ipsum dolor sit amet, consec tetur adipiscing eliting dolor sit amet. Placeat nostrud natus tempora justo nostrud natus tempora."
                >
                    <div className={styles["about-cards-main-container"]}>
                        <div className={styles["about-card"]}>
                            <img src="/images/price.png" alt="" />
                            <div className={styles["card-inner-text"]}>
                                <h5>AFFORDABLE PRICE</h5>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                            </div>
                        </div>
                        <div className={styles["about-card"]}>
                            <img src="/images/map.png" alt="" />
                            <div className={styles["card-inner-text"]}>
                                <h5>BEST DESTINATION</h5>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                            </div>
                        </div>
                        <div className={styles["about-card"]}>
                            <img src="/images/man.png" alt="" />
                            <div className={styles["card-inner-text"]}>
                                <h5>PERSONAL SERVICE</h5>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                            </div>
                        </div>
                    </div>

                    <div className={styles["video-section"]}>
                        <video width="100%" controls>
                            <source src="https://www.youtube.com/embed/y6E1L6KVwYw?si=PWj6UBEnGYYihihu" type="video/mp4" />
                            <source src="https://www.youtube.com/embed/y6E1L6KVwYw?si=PWj6UBEnGYYihihuPo" type="video/ogg" />
                            Your browser does not support HTML video.
                        </video>
                    </div>

                </HomeCrumbs>

                <HomeCrumbs
                    Crumb_About="OUR ASSOCAITES"
                    Crumb_Info="PARTNER'S AND CLIENTS"
                    Crumb_Descripton="Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque veniam blanditiis nisi qui commodi laboriosam incidunt reprehenderit expedita minima! Atque repellendus cum accusamus magnam qui molestiae possimus voluptatum ex impedit!"
                >
                    <div>

                    </div>
                </HomeCrumbs>

            </MainLayout>
        </>
    )
}

export default About