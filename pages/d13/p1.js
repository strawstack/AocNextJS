import React from 'react';
import styles from './P1.module.css';
import data from './input.txt';
import * as utils from '../../utils/utils.js';

const p = (v) => console.log(v);

export default function P1() {
    let [ans, setAns] = React.useState(`P1`);
    React.useEffect(function solution() {
        console.clear();
        
        let [dots, folds] = data.trim().split("\n\n");
        
        dots = dots.split("\n").map(e => {
            let [x, y] = e.split(",");
            return {
                x: parseInt(x),
                y: parseInt(y)
            };
        });

        folds = folds.split("\n").map(e => {
            let [_, op] = e.split("along ");
            let [dir, number] = op.split("=");
            return {
                dir: dir,
                number: parseInt(number)
            };
        });

        let paper = {};
        for (let dot of dots) {
            paper[hash(dot)] = true;
        }

        for (let fold of folds) {
            makeFold(paper, fold);
            break;
        }

        p(Object.keys(paper).length);

    });

    return (
        <div className={styles.P1}>{ans}</div>
    );
}

function makeFold(paper, fold) {
    let {dir, number} = fold;
    for (let dot in paper) {
        let d = unHash(dot);
        if (d[dir] > number) {
            let diff = d[dir] - number;
            let newValue = number - diff;
            d[dir] = newValue;
            delete paper[dot];
            paper[hash(d)] = true;
        }
    }
}

function hash(dot) {
    return `${dot.x}:${dot.y}`;
}
function unHash(dot) {
    let [x, y] = dot.split(":");
    return {
        x: parseInt(x),
        y: parseInt(y)
    };
}