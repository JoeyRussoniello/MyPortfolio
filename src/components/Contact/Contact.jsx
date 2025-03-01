import React from 'react';

import styles from './Contact.module.css';
import { getImageUrl } from '../../utils';
export const Contact = () => {
    return (
        <footer id='contact' className={styles.container}>
            <div className={styles.text}>
                <h2>Contact</h2>
                <p>I'd love to hear from you!</p>
            </div>
            <ul className={styles.links}>
                <li className={styles.link}>
                    <img src={getImageUrl('contact/emailIcon.png')} alt='Email Icon'></img>
                    <a href='mailto:jmrusso@bu.edu'>jmrusso@bu.edu</a>
                </li>
                <li className={styles.link}>
                    <img src={getImageUrl('contact/linkedinIcon.png')} alt='linkedIn Icon'></img>
                    <a href='https://www.linkedin.com/in/joseph-russoniello-b57681252/'>LinkedIn</a>
                </li>
                <li className={styles.link}>
                    <img src={getImageUrl('contact/githubIcon.png')} alt='Github Icon'></img>
                    <a href='https://github.com/JoeyRussoniello/'>GitHub</a>
                </li>
            </ul>
        </footer>
    );
};