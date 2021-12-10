import React from 'react';
import styles from './P2.module.css';
import data from './input.txt';
import * as utils from '../../utils/utils.js';

const p = (v) => console.log(v);

const open = {
    "(": ")",
    "[": "]",
    "{": "}",
    "<": ">"
};

const close = {
    ")": "(",
    "]": "[",
    "}": "{",
    ">": "<"
};

function match(a, b) {
    return open[a] === b;
}

function findFirstIllegal(line) {
    let stack = [];
    for (let c of line) {
        if (c in open) {
            stack.push(c);

        } else { // c in close
            if (stack.length > 0) {
                let b = stack.pop();
                if (!match(b, c)) {
                    return false;
                }
            } else {
                break;
            }
        }
    }
    return stack;
}

const lookup = {
    ")": 1,
    "]": 2,
    "}": 3,
    ">": 4
};

export default function P2() {
    let [ans, setAns] = React.useState(`P2`);
    React.useEffect(function solution() {
        console.clear();
        
        let lst = data.split("\n");
        let ansList = [];

        for (let line of lst) {
            let stack = findFirstIllegal(line);
            if (stack !== false && stack.length > 0) {
                stack.reverse();
                let total = stack.map(x => lookup[open[x]]).reduce((p, c) => p * 5 + c);
                ansList.push(total);
            }
        }

        ansList.sort((a, b) => a - b);
        let ans = ansList[Math.floor(ansList.length/2)];

        p(ans);
    });

    return (
        <div className={styles.P2}>{ans}</div>
    );
}