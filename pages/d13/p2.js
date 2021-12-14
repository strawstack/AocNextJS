import React from 'react';
import styles from './P2.module.css';
import data from './input.txt';
import * as utils from '../../utils/utils.js';

const p = (v) => console.log(v);

export default function P2() {
    let [ans, setAns] = React.useState(`P2`);

    let divs = [];

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
        }

        let largest = {
            x: 0,
            y: 0
        };
        for (let dot in paper) {
            let d = unHash(dot);
            largest.x = Math.max(largest.x, d.x);
            largest.y = Math.max(largest.y, d.y);
        }
        
        let grid = [];
        for (let r = 0; r < largest.y + 1; r++) {
            let tempRow = [];
            for (let c = 0; c < largest.x + 1; c++) {
                tempRow.push(" ");
            }
            grid.push(tempRow);
        }

        for (let dot in paper) {
            let d = unHash(dot);
            grid[d.y][d.x] = "#";
            divs.push(
                <div className={styles.DIV} key={dot} style={{top: `${d.y * 20}px`, left: `${d.x * 20}px`}}></div>
            );
        }
        
        for (let row of grid) {
            p(row.join(""));
        }

        setAns(divs);
        
    }, []);

    return (
        <div className={styles.P2}>{ans}</div>
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