import React from 'react';

import styles from './ProjectCard.module.css';
import {getImageUrl} from '../../utils';


export const ProjectCard = ({project: {title, imageSrc, description, skills, source}}) =>{
    return (
        <div className={styles.container}>
            <img 
                src={getImageUrl(imageSrc)} 
                alt={`Image of ${title}`}
                className={styles.image}/>
            <div className={styles.textContent}>
                <div className={styles.titleContainer}>
                <h3 className={styles.title}>{title}</h3>
                </div>
                <p className={styles.description}>{description}</p>
                <ul className={styles.skills}>{
                    skills.map((skill, id) =>{
                        return (
                            <li key={id} className={styles.skill}>{skill}</li>
                        );
                    })
                }
                <div className={styles.links}>
                    <a href={source} className={styles.link}>Source</a>
                </div>
                </ul>
            </div>
        </div>
    );
}