import React from 'react';
import styles from './P1.module.css';
import data from './input.txt';
import * as utils from '../../utils/utils.js';

const p = (v) => console.log(v);

export default function P1() {
    let [ans, setAns] = React.useState(0);
    React.useEffect(function solution() {
        console.clear();

        let lst = data.split("\n").map(x => parseInt(x));
        console.log(lst);
        //lst = [199, 200, 208, 210, 200, 207, 240, 269, 260, 263]

        let count = 0;
        lst.reduce((prev, cur) => {
            if (cur > prev) {
                count += 1;
            }
            return cur;
        }, lst[0]);

        p(count);

        // code solution here
        /*
        let count = 0;
        let prev = lst[0];
        for (let n of lst) {
            if (n > prev) {
                count += 1;
            }
            prev = n;
        }
        setAns(count);
        console.log(count); */
    });

    return (
        <div className={styles.P1}>{ans}</div>
    );
}
