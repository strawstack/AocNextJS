import React from 'react';
import styles from './P2.module.css';
import data from './input.txt';
import * as utils from '../../utils/utils.js';

const p = (v) => console.log(v);

export default function P2() {
    let [ans, setAns] = React.useState(`P2`);
    React.useEffect(function solution() {
        console.clear();

        let lst = data.split("\n").map(x => parseInt(x));
        let [a,b,c,d] = [0,0,0,0];
        lst.map((v, i) => {
            if (i > 2 && a + b + c < b + c + v) d += 1;
            [a,b,c] = [b,c,v];
        });
        console.log(d);
        setAns(d);

        /*
        let index = 0;
        let collect = [];

        // code solution here
        while (index < lst.length) {
            let temp = [];
            for (let j = 0; j < 3; j++) {
                temp.push(lst[index + j]);
            }
            index += 1;
            collect.push(temp);
        }

        //console.log(collect);

        // sum three lst
        collect = collect.map(x => {
            let sum = 0;
            for (let d of x) {
                sum += d;
            }
            return sum;
        });

        //console.log(collect);

        let count = 0;
        let prev = collect[0];
        for (let n of collect) {
            if (n > prev) {
                count += 1;
            }
            prev = n;
        }

        setAns(count); */
    });

    return (
        <div className={styles.P2}>{ans}</div>
    );
}
