import React from 'react';

import styles from './FeaturedProject.module.css';
import project from '../../data/featured_project.json';
import { getImageUrl } from '../../utils';

export const FeaturedProject = () => {
    return (
        <div className={styles.container}>
            <img src={getImageUrl(project.imageSrc)} alt={project.title} className={styles.image}/>
            <div className={styles.textContent}>
            <h3 className={styles.title}>Featured Project: {project.title}</h3>
            <p className={styles.description}>{project.prefeaturesdescription}</p>
            <br></br>
            <p className={styles.description}>It features:</p>
            <ul className={styles.features}>
            {project.features.map(skill => (
                    <li key={skill}>{skill}</li>
                ))}
            </ul>
            <p className={styles.description}>{project.postfeaturesdescription}</p>
            <ul className={styles.skills}>
                {project.skills.map(skill => (
                    <li key={skill} className={styles.skill}>{skill}</li>
                ))}
            </ul>

            <div className={styles.links}>
                <a href={project.source} className={styles.link}>Source</a>
            </div>
            </div>
        </div>
    );
};
