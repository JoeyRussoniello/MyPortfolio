import React from 'react';

import styles from './Hero.module.css';
import { getImageUrl } from '../../utils';

const pdf = getImageUrl('hero/resume.pdf');
export const Hero = () =>{
    return (
        <section className={styles.container}>
            <div className={styles.content}>
                <h1 className={styles.title}>Hi, I'm Joey</h1>
                <p className={styles.description}>I'm a Data Scientist with 4 years of experience who loves transforming data into powerful insights and solutions. Reach out if you'd like to learn more!</p>
                <div className={styles.buttons}>
                    <a href='mailto:jmrusso@bu.edu' className={styles.contactBtn}>Contact Me</a>
                    <a href={pdf} className={styles.pdfBtn}>Resume</a>
                </div>
            </div>
            
            <img src={getImageUrl('hero/heroImage.png')} alt = 'Hero Image of Me' className={styles.heroImg}/>

            <div className={styles.topBlur}/>
            <div className={styles.bottomBlur}/>
        </section>
    )
};