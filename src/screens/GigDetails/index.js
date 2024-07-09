import ImageLayout from '@/components/ImageLayout'
import MainLayout from '@/components/MainLayout'
import React, { useEffect, useState } from 'react'
import styles from './gigscard.module.css'
import Clock from '@/components/Icons/Clock'
import LocationIconBlack from '@/components/Icons/LocationIconBlack'
import toast from 'react-hot-toast'

const GigDetails = () => {
    const [copyText, setCopyText] = useState('');

    useEffect(() => {
        setCopyText(window.location.href);
    }, []);

    const handleCopyClick = () => {
        navigator.clipboard.writeText(copyText).then(() => {
            toast.success('URL copied to clipboard!');
        }).catch(err => {
            toast.error('Failed to copy URL: ', err);
        });
    };
    return (
        <>
            <MainLayout>
                <ImageLayout Img_url='/images/gigsimg.png' heading=''>
                </ImageLayout>
                <div className={styles["details-page-main-container"]}>
                    <div className={styles['gigs-card-main-container']} id='gigs-card'>
                        <div className={styles['gigs-cardinner']}>
                            <div className={styles['copy-url']}>
                                <p>{copyText}</p>
                                <button className={styles["copyurl-btn"]} onClick={handleCopyClick}>Copy</button>
                            </div>
                            <div className={styles["gig-image"]}>
                                <img src="https://img.naukimg.com/logo_images/groups/v1/1468302.gif" alt="" />
                            </div>
                            <p className={styles['company_name']}>
                                {"company_name"}
                                {/* {isVerified ? <VerifyBadge /> : null} */}
                            </p>

                            <div className={styles['gigs-card-gigs_title']}>
                                <p>{"gigs_title"}</p>
                            </div>
                            <div className={styles["gig-info-section"]}>
                                <p className={styles['gigs_type']}>
                                    <Clock />
                                    {"gigs_duration"} hrs
                                </p>
                                <div className={styles["Gigslocation"]}>
                                    <LocationIconBlack />
                                    <p>{"gigs_location"}</p>
                                </div>
                            </div>
                            {/* <p className={styles['gigs_about']}>{"gigs_about"}</p> */}
                            <div className={styles["details-section"]}>
                                <h3>Company Description</h3>
                                <p className={styles['gigs_description']}>
                                    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eum minima nobis voluptas veniam ab quidem debitis id vitae sit necessitatibus facere nemo ea dolor asperiores doloremque doloribus sunt vero,
                                </p>
                            </div>
                            <div className={styles["details-section"]}>
                                <h3>Gig Description</h3>
                                <p className={styles['gigs_description']}>
                                    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eum minima nobis voluptas veniam ab quidem debitis id vitae sit necessitatibus facere nemo ea dolor asperiores doloremque doloribus sunt vero, illum consequatur suscipit repellendus placeat at perspiciatis? Magnam corporis earum, numquam perferendis fuga ut autem aut sint pariatur modi aspernatur ducimus eum reprehenderit et exercitationem voluptatum est odio debitis, quod fugiat vitae impedit quisquam doloremque. Quia minima illo aut, saepe fugiat debitis vero libero sed itaque enim distinctio iste officiis, vitae animi reprehenderit voluptatum dolores neque molestiae, laborum explicabo eveniet aspernatur quos nihil error? Aliquid, cumque placeat tempora soluta cupiditate commodi dolorem! Molestias beatae dolores odio aspernatur quisquam? Non id ad ipsa amet accusamus, ex quae veritatis magnam quas quod tempore, blanditiis dolore consequatur ducimus fuga aperiam provident tenetur quos quo similique ipsum! Modi error velit illum sint et excepturi tempora!
                                </p>
                            </div>
                            {/* <div className={styles["details-section"]}>
                                <h3>Gig Description</h3>
                                <p className={styles['gigs_description']}>
                                    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eum minima nobis voluptas veniam ab quidem debitis id vitae sit necessitatibus facere nemo ea dolor asperiores doloremque doloribus sunt vero, illum consequatur suscipit repellendus placeat at perspiciatis? Magnam corporis earum, numquam perferendis fuga ut autem aut sint pariatur modi aspernatur ducimus eum reprehenderit et exercitationem voluptatum est odio debitis, quod fugiat vitae impedit quisquam doloremque. Quia minima illo aut, saepe fugiat debitis vero libero sed itaque enim distinctio iste officiis, vitae animi reprehenderit voluptatum dolores neque molestiae, laborum explicabo eveniet aspernatur quos nihil error? Aliquid, cumque placeat tempora soluta cupiditate commodi dolorem! Molestias beatae dolores odio aspernatur quisquam? Non id ad ipsa amet accusamus, ex quae veritatis magnam quas quod tempore, blanditiis dolore consequatur ducimus fuga aperiam provident tenetur quos quo similique ipsum! Modi error velit illum sint et excepturi tempora!
                                </p>
                            </div> */}
                        </div>
                        <div className={styles['gigs-card-btn-sep']}>
                            <button onClick={"handleClick"} className='book-btn-primary'>
                                Enquire Now
                            </button>
                        </div>
                    </div>
                </div>
            </MainLayout>
        </>
    )
}

export default GigDetails