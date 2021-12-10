import React from 'react';
import styles from './P1.module.css';
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
                    return c;
                }
            } else {
                break;
            }
        }
    }
    return false;
}

const lookup = {
    ")": 3,
    "]": 57,
    "}": 1197,
    ">": 25137
};

export default function P1() {
    let [ans, setAns] = React.useState(`P1`);
    React.useEffect(function solution() {
        console.clear();
        
        let lst = data.split("\n");
        let ans = 0;
        for (let line of lst) {
            let type = findFirstIllegal(line);
            if (type !== false) {
                ans += lookup[type];
            }
        }

        p(ans);
    });

    return (
        <div className={styles.P1}>{ans}</div>
    );
}