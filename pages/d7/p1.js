import React from 'react';
import styles from './P1.module.css';
import data from './input.txt';
import * as utils from '../../utils/utils.js';

const p = (v) => console.log(v);

export default function P1() {
    let [ans, setAns] = React.useState(0);
    React.useEffect(function solution() {
        console.clear();

        let lst = data.split(",").map(x => parseInt(x));

        p(lst);

        let lowest = Infinity;
        for (let c = 0; c <= 1000; c++) {
            let cost = 0;
            for (let n of lst) {
                let value = Math.abs(c - n); 
                cost += value;
            }
            lowest = Math.min(lowest, cost);
        }

        p(lowest);
        setAns(lowest);
    });

    return (
        <div className={styles.P1}>{ans}</div>
    );
}