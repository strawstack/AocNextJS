import React from 'react';
import styles from './P2.module.css';
import data from './input.txt';
import * as utils from '../../utils/utils.js';

const p = (v) => console.log(v);

export default function P2() {
    let [ans, setAns] = React.useState(`P2`);
    React.useEffect(function solution() {
        console.clear();
        
        // code solution here
        p(`P2`);
        p(data);
        
        setAns(`P2`);
    });

    return (
        <div className={styles.P2}>{ans}</div>
    );
}