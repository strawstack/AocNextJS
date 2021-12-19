import React from 'react';
import styles from './P1.module.css';
import data from './input.txt';
import * as utils from '../../utils/utils.js';

const p = (v) => console.log(v);

// target area: x=79..137, y=-176..-117


export default function P1() {
    let [ans, setAns] = React.useState(`P1`);
    React.useEffect(function solution() {
        console.clear();
        
        let [x, y] = data.split(", ") 
        let [_, tx] = x.split("=");
        let [__, ty] = y.split("=");
        let [xmin, xmax] = tx.split("..").map(z => parseInt(z));
        let [ymin, ymax] = ty.split("..").map(z => parseInt(z));
        let target = {
            x: {
                min: xmin,
                max: xmax
            },
            y: {
                min: ymin,
                max: ymax
            }
        };

        let n = Math.abs(target.y.min) - 1;

        p(n * (n + 1) / 2)

    });

    return (
        <div className={styles.P1}>{ans}</div>
    );
}