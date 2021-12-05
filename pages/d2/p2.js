import React from 'react';
import styles from './P2.module.css';
import data from './input.txt';
import * as utils from '../../utils/utils.js';

const p = (v) => console.log(v);

export default function P2() {
    let [ans, setAns] = React.useState(`P2`);
    React.useEffect(function solution() {
        console.clear();

        let lst = data.split("\n").map(x => {
            let [name, value] = x.split(" ");
            return [name, parseInt(value)];
        });
        let pos = {x: 0, aim: 0, depth: 0};

        for (let move of lst) {
            if (move[0] == "forward") {
                pos.depth += move[1] * pos.aim;
                pos.x += move[1];
            } else if (move[0] == "down") {
                pos.aim += move[1];
            } else if (move[0] == "up") {
                pos.aim -= move[1];
            }
        }

        // code solution here
        p(pos.x * pos.depth);
        setAns(pos.x * pos.depth);
    });

    return (
        <div className={styles.P2}>{ans}</div>
    );
}
