import React, { useEffect, useState } from 'react';
import axios from 'axios';
import HomeCrumbs from '@/components/HomeCrumbs';
import ImageLayout from '@/components/ImageLayout';
import MainLayout from '@/components/MainLayout';
import styles from './about.module.css';

const About = () => {
    const [heading, setHeading] = useState('');
    const [content, setContent] = useState('');
    const [cards, setCards] = useState([]);

    const imageUrls = [
        '/images/Travelndtime.png',
        '/images/2.png',
        '/images/3.png',
    ];

    useEffect(() => {
        axios.get('https://api.launcherr.co/api/Show-About')
            .then(response => {
                const data = response.data;
                setHeading(data.heading);
                setContent(data.content);
                setCards(data.Cards);
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
                    Crumb_Info={heading}
                    Crumb_Descripton={content}
                >
                    <div className={styles["about-cards-main-container"]}>
                        {cards.map((card, index) => (
                            <div key={card.Card_No} className={styles["about-card"]}>
                                <img src={imageUrls[index % imageUrls.length]} alt={card.Card_Heading} />
                                <div className={styles["card-inner-text"]}>
                                    <h5>{card.Card_Heading}</h5>
                                    <p>{card.Card_Subheading}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className={styles["video-section"]}>
                        <video width="100%" controls>
                            <source src="/Video/Launcherr.mp4" type="video/mp4" />
                            <source src="/Video/Launcherr.mp4" type="video/ogg" />
                            Your browser does not support HTML video.
                        </video>
                    </div>
                </HomeCrumbs>
            </MainLayout>
        </>
    );
};

export default About;
