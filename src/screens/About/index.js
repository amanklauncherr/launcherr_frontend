import React, { useEffect, useState } from 'react';
import axios from 'axios';
import HomeCrumbs from '@/components/HomeCrumbs';
import ImageLayout from '@/components/ImageLayout';
import MainLayout from '@/components/MainLayout';
import styles from './about.module.css';

const About = () => {
    const [heading, setHeading] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        axios.get('https://api.launcherr.co/api/Show-About')
            .then(response => {
                const data = response.data;
                setHeading(data.heading);
                setContent(data.content);
            })
            .catch(error => {
                console.error('There was an error fetching the data!', error);
            });
    }, []);

    return (
        <>
            <MainLayout>
                <ImageLayout Img_url="/images/about.png" heading="About Us" />

                <HomeCrumbs
                    Crumb_About="OUR TOUR GALLERY"
                    Crumb_Info={heading}
                    Crumb_Descripton={content}
                >
                    <div className={styles["about-cards-main-container"]}>
                         <div className={styles["about-card"]}>
                            <img src="/images/price.png" alt="Affordable Price" />
                            <div className={styles["card-inner-text"]}>
                                <h5>AFFORDABLE PRICE</h5>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                            </div> 
                        </div>
                        <div className={styles["about-card"]}>
                            <img src="/images/map.png" alt="Best Destination" />
                            <div className={styles["card-inner-text"]}>
                                <h5>BEST DESTINATION</h5>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                            </div>
                        </div>
                        <div className={styles["about-card"]}>
                            <img src="/images/man.png" alt="Personal Service" />
                            <div className={styles["card-inner-text"]}>
                                <h5>PERSONAL SERVICE</h5>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                            </div>
                        </div> 
                    </div>

                    <div className={styles["video-section"]}>
                        <video width="100%" controls>
                            <source src="https://youtu.be/26zOFiqCC4w?si=I7GKwMaSkATojbzt" type="video/mp4" />
                            <source src="https://youtu.be/26zOFiqCC4w?si=I7GKwMaSkATojbzt" type="video/ogg" />
                            Your browser does not support HTML video.
                        </video>
                    </div>
                </HomeCrumbs>

                <HomeCrumbs
                    Crumb_About="OUR ASSOCIATES"
                    Crumb_Info="PARTNERS AND CLIENTS"
                    Crumb_Descripton="Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque veniam blanditiis nisi qui commodi laboriosam incidunt reprehenderit expedita minima! Atque repellendus cum accusamus magnam qui molestiae possimus voluptatum ex impedit!"
                >
                    <div>
                        {/* Add content here if needed */}
                    </div>
                </HomeCrumbs>
            </MainLayout>
        </>
    );
};

export default About;
