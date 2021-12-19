import React from 'react';
import styles from './P2.module.css';
import data from './input.txt';
import * as utils from '../../utils/utils.js';

const p = (v) => console.log(v);

export default function P2() {
    let [ans, setAns] = React.useState(`P2`);
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

        p(target)

        let count = 0;
        for (let xv = -1000; xv < 1000; xv++) {
            for (let yv = -1000; yv < 1000; yv++) {
                if (simulate(xv, yv, target.x.min, target.x.max, target.y.max, target.y.min)) {
                    count += 1;
                }
            }
        }
        p(count)
    });

    return (
        <div className={styles.P2}>{ans}</div>
    );
}

// Does the path of xv show up between a and b
function simulate(xv, yv, xbl, xbr, ybt, ybb) {
    let xs = xv;
    let xp = xv;
    let ys = yv;
    let yp = yv;
    while (xp <= xbr && yp >= ybb) {
        if (xp >= xbl && xp <= xbr && yp <= ybt && yp >= ybb) {
            return true;
        }

        xs -= 1;
        if (xs < 0) { xs = 0; }
        ys -= 1;
        xp += xs;
        yp += ys;
    }
    return false;
} 