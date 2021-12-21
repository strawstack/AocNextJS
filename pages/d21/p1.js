import React from 'react';
import styles from './P1.module.css';
import data from './input.txt';
import * as utils from '../../utils/utils.js';

const p = (v) => console.log(v);

export default function P1() {
    let [ans, setAns] = React.useState(`P1`);
    React.useEffect(function solution() {
        console.clear();
        
        let pos = data.split("\n").map(x => parseInt(x.split(": ")[1]));
        let score = [0, 0];

        // debug
        //pos = [4, 8];
        
        let dice = 0;
        let rolls = 0;
        while (true) {
            let total = [0, 0];

            let rollCheck = [];

            dice += 1;
            rolls += 1;
            dice = ((dice - 1) % 100) + 1;
            rollCheck.push(dice);
            total[0] += dice;

            dice += 1;
            rolls += 1;
            dice = ((dice - 1) % 100) + 1;
            rollCheck.push(dice);
            total[0] += dice;

            dice += 1;
            rolls += 1;
            dice = ((dice - 1) % 100) + 1;
            rollCheck.push(dice);
            total[0] += dice;

            pos[0] = ((pos[0] + total[0] - 1) % 10) + 1;

            score[0] += pos[0];
            //p(`p1: ${pos[0]}, score: ${score[0]}`);
            
            if (score[0] >= 1000) {
                break;
            }

            //p([...rollCheck]);
            rollCheck = [];
            
            dice += 1;
            rolls += 1;
            dice = ((dice - 1) % 100) + 1;
            rollCheck.push(dice);
            total[1] += dice;

            dice += 1;
            rolls += 1;
            dice = ((dice - 1) % 100) + 1;
            rollCheck.push(dice);
            total[1] += dice;

            dice += 1;
            rolls += 1;
            dice = ((dice - 1) % 100) + 1;
            rollCheck.push(dice);
            total[1] += dice;

            //p([...rollCheck]);

            // Wrap positions after 10
            
            pos[1] = ((pos[1] + total[1] - 1) % 10) + 1;

            score[1] += pos[1];
            //p(`p2: ${pos[1]}, score: ${score[1]}`);

            if (score[1] >= 1000) {
                break;
            }
        }

        // 106020 wrong
        p(Math.min(...score) * rolls);

    });

    return (
        <div className={styles.P1}>{ans}</div>
    );
}