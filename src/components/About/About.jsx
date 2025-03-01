import React from 'react';

import styles from './About.module.css';
import { getImageUrl } from '../../utils';

export const About = () => {
    return (
        //Assinging the id here allows the navbar to work
        <section className={styles.container} id='about'>
            <h2 className={styles.title}>About</h2>
            <div className={styles.content}>
                <img 
                    src={getImageUrl('about/aboutImage.png')} 
                    alt='A picture of me'
                    className={styles.aboutImg}
                />
                <ul className={styles.aboutItems}>
                    <li className={styles.aboutItem}>
                        <img src={getImageUrl('about/uiIcon.png')} alt ='Cursor Icon'/>
                        <div className={styles.aboutItemText}>
                            <h3>Data Scientist</h3>
                            <p>With expertise in machine learning, predictive analytics, and automation, I build data-driven solutions that enhance corporate decision-making.</p>  
                        </div>
                    </li>
                    <li className={styles.aboutItem}>
                        <img src={getImageUrl('about/serverIcon.png')} alt ='Cursor Icon'/>
                        <div className={styles.aboutItemText}>
                            <h3>Data Analyst/Engineer</h3>
                            <p>Leveraging SQL, XML, Python, and visualization tools, I uncover trends and insights that drive strategic business decisions.</p>
                        </div>
                    </li>
                    <li className={styles.aboutItem}>
                        <img src={getImageUrl('about/cursorIcon.png')} alt ='UI Icon'/>
                        <div className={styles.aboutItemText}>
                            <h3>Business Intelligence & Automation</h3>
                            <p>I design and implement automated reporting systems and ETL pipelines, reducing manual effort and enabling real-time data accessibility.</p>  
                        </div>
                    </li>
                </ul>
            </div>
        </section>
    )
}