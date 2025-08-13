
import { getImageUrl } from '../../utils';
import styles from './Hero.module.css';

const pdf = getImageUrl('hero/resume.pdf');
export const Hero = () =>{
    return (
        <section className={styles.container}>
            <div className={styles.content}>
                <h1 className={styles.title}>Hi, I'm Joey!</h1>
                <p className={styles.description}>I'm a Data Scientist with 3 years of working experience. From Rust compilers to polished Business Intelligence Dashboards, I love making tools that are ready for the real world, transforming data into actionable insights and solutions.</p>
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