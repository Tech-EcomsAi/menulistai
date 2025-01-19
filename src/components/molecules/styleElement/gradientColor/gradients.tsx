import React from 'react'
import gradientList from 'src/data/gradientList';
import styles from './gradientColor.module.scss';

function Gradients({ onSelect }) {

    return (
        <div className={styles.gradientListWrap}>
            {gradientList.map((gradientData, i) => {
                return <div className={styles.gradientWrap} key={i}>
                    <div className={styles.gradientItem} onClick={() => onSelect(gradientData)}
                        style={{ background: `linear-gradient(to right,${gradientData.colors[0]},${gradientData.colors[1]}` }}></div>
                    <div className={styles.gradientNameColorWrap}>
                        <div className={styles.name}>{gradientData.name}</div>
                        <div className={styles.colors}>
                            {gradientData.colors.map((color, i) => {
                                return <div className={`${styles.color}`} key={i} style={{ background: color }}></div>
                            })}
                        </div>

                    </div>
                </div>
            })}
        </div>
    )
}

export default Gradients