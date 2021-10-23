import React from 'react';
import styles from './P1.module.css';
import data from './input.txt';
import * as utils from '../../utils/utils.js';

const p = (v) => console.log(v);

export default function P1() {
    let [ans, setAns] = React.useState(`P1`);
    React.useEffect(function solution() {
        console.clear();
        
        // code solution here
        p(`P1`);
        p(data);
        
        setAns(`P1`);
    });

    return (
        <div className={styles.P1}>{ans}</div>
    );
}