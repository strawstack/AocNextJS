import React from 'react';
import styles from './P2.module.css';
import data from './input.txt';
import * as utils from '../../utils/utils.js';

const p = (v) => console.log(v);

function getFz(lst) {
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

    return fz;
}

export default function P2() {
    let [ans, setAns] = React.useState(`P2`);
    React.useEffect(function solution() {
        console.clear();

        let lst = data.split("\n").map(x => x.split(""));

        let remaining = lst;
        let bit = 0;

        while (remaining.length > 1) {

            let fz = getFz(remaining);

            if (fz[0][bit] > fz[1][bit]) {
                remaining = remaining.filter(x => x[bit] === "0");

            } else { // fz[1][bit] >= fz[0][bit]
                remaining = remaining.filter(x => x[bit] === "1");

            }
            bit += 1;
        }

        let oxy = parseInt(remaining[0].join(""), 2);

        // co2

        remaining = lst;
        bit = 0;

        while (remaining.length > 1) {

            let fz = getFz(remaining);

            if (fz[1][bit] >= fz[0][bit]) {
                remaining = remaining.filter(x => x[bit] === "0");

            } else { // fz[0][bit] > fz[1][bit]
                remaining = remaining.filter(x => x[bit] === "1");

            }
            bit += 1;
        }

        let co2 = parseInt(remaining[0].join(""), 2);

        p(oxy * co2);
        setAns(oxy * co2);
    });

    return (
        <div className={styles.P2}>{ans}</div>
    );
}
