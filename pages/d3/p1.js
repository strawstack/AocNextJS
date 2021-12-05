import React from 'react';
import styles from './P1.module.css';
import data from './input.txt';
import * as utils from '../../utils/utils.js';

const p = (v) => console.log(v);

export default function P1() {
    let [ans, setAns] = React.useState(0);
    React.useEffect(function solution() {
        console.clear();

        let lst = data.split("\n").map(x => x.split(""));

        // code solution here
        p(`P1`);
        p(lst);

        // fz[digit 0 or 1][position] -> frequency
        let fz = [
            [0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0]
        ];

        for (let number of lst) {
            for (let index in number) {
                let d = number[index];
                fz[parseInt(d)][index] += 1;
            }
        }

        let best = [];

        for (let i = 0; i < 12; i++) {
            if (fz[0][i] > fz[1][i]) {
                best.push(0);
            } else {
                best.push(1);
            }
        }

        let binary = best.join("");
        let gamma = parseInt(binary, 2);

        let mask = Math.pow(2, 12) - 1;
        let epi = gamma ^ mask;

        p(gamma * epi);
        setAns(gamma * epi);
    });

    return (
        <div className={styles.P1}>{ans}</div>
    );
}
