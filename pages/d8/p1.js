import React from 'react';
import styles from './P1.module.css';
import data from './input.txt';
import * as utils from '../../utils/utils.js';

const p = (v) => console.log(v);

export default function P1() {
    let [ans, setAns] = React.useState(`P1`);
    React.useEffect(function solution() {
        console.clear();
        
        let lst = data.trim().split("\n").map(x => {
            let [in_digits, out_digits] = x.split(" | ");
            in_digits = in_digits.split(" ");
            out_digits = out_digits.split(" ");
            return [in_digits, out_digits];
        });

        let count = 0;
        for (let row of lst) {
            for (let digit of row[1]) {
                let len = digit.length;
                if (len === 2 || len === 4 || len === 3 || len === 7) {
                    count += 1;
                }
            }
        }

        p(count);
    });

    return (
        <div className={styles.P1}>{ans}</div>
    );
}