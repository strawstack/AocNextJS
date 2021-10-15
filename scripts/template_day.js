import React from 'react';
import styles from './TEMPLATE.module.css';
import data from './input.js';
import * as utils from '../../utils/utils.js';

const p = (v) => console.log(v);

export default function TEMPLATE() {
    let [ans, setAns] = React.useState(`TEMPLATE`);
    React.useEffect(function solution() {
        console.clear();
        
        // code solution here
        p(`TEMPLATE`);
        p(data);
        
        setAns(`TEMPLATE`);
    });

    return (
        <div className={styles.TEMPLATE}>{ans}</div>
    )
}