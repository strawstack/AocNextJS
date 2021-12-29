import React from 'react';
import styles from './P1.module.css';
import data from './input.txt';
//import data from './input_test.txt';
import * as utils from '../../utils/utils.js';

const p = (v) => console.log(v);

export default function P1() {
    let [ans, setAns] = React.useState(`P1`);
    React.useEffect(function solution() {
        console.clear();

        let grid = {};

        let lst = data.trim().split("\n");

        let h = lst.length;
        let w = lst[0].length;

        for (let r = 0; r < lst.length; r++) {
            for (let c = 0; c < lst[r].length; c++) {
                let sym = lst[r][c];
                grid[hash({r,c})] = sym;
            }
        }

        let movement = true;
        let steps = 0;
        while (movement) {
            steps += 1;
            movement = false;

            // East move first
            let grid2 = {};
            for (let k in grid) {
                let [r, c] = unhash(k);
                let val = grid[k];
                if (val === ">") {
                    let nxPos = {r: r, c: (c + 1) % w};
                    let nHash = hash(nxPos);
                    if (grid[nHash] === ".") {
                        grid2[k] = ".";
                        grid2[nHash] = ">";
                        movement = true;
                    }
                }
            }

            // Transfer unused cells
            for (let k in grid) {
                if (!(k in grid2)) {
                    grid2[k] = grid[k];
                }
            }

            grid = grid2;

            let grid3 = {};
            for (let k in grid) {
                let [r, c] = unhash(k);
                let val = grid[k];

                if (val === "v") {
                    let nxPos = {r: (r + 1) % h, c: c};
                    let nHash = hash(nxPos);
                    if (grid[nHash] === ".") {
                        grid3[k] = ".";
                        grid3[nHash] = "v";
                        movement = true;
                    }
                }
            }

            // Transfer unused cells
            for (let k in grid) {
                if (!(k in grid3)) {
                    grid3[k] = grid[k];
                }
            }

            grid = grid3;
        }

        p(steps);
    });

    return (
        <div className={styles.P1}>{ans}</div>
    );
}

function hash(p) {
    return `${p.r}:${p.c}`;
}
function unhash(k) {
    return k.split(":").map(x => parseInt(x));
}
