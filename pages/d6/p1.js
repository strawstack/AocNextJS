import React from 'react';
import styles from './P1.module.css';
import data from './input.txt';
//import data from './tinput.txt';
import * as utils from '../../utils/utils.js';

const p = (v) => console.log(v);

export default function P1() {
    let [ans, setAns] = React.useState(`P1`);
    React.useEffect(function solution() {
        console.clear();
        
        let lst = data.split(",").map(x => parseInt(x));

        let fish = {};
        for (let f of lst) {
            if (!(f in fish)) {
                fish[f] = 0;
            }
            fish[f] += 1;
        }

        let count = 80;
        while (count > 0) {
            let fish2 = {};
            for (let k in fish) {
                let kn = parseInt(k);
                let val = fish[kn];
                if (kn === 0) {
                    fish2[8] = val;
                    if (!(6 in fish2)) {
                        fish2[6] = val;
                    } else {
                        fish2[6] += val;
                    }
                } else { // k !== 0
                    if (!(kn - 1 in fish2)) {
                        fish2[kn - 1] = 0;    
                    }
                    fish2[kn - 1] += val;
                }
            }

            fish = fish2;
            count -= 1;
        }

        let total = 0;
        for (let k in fish) {
            total += fish[k];
        }

        p(total);
        setAns(total);
        
    });

    return (
        <div className={styles.P1}>{ans}</div>
    );
}