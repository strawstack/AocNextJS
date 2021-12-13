import React from 'react';
import styles from './P2.module.css';
import data from './input.txt';
import * as utils from '../../utils/utils.js';

const p = (v) => console.log(v);

let totalFlashes = 0;

function advance(grid) {
    let ng = [];
    for (let row of grid) {
        ng.push(row.slice());
    }
    for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[0].length; c++) {
            ng[r][c] += 1;
        }
    }
    return ng;
}

function checkFlash(grid) {
    for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[0].length; c++) {
            if (grid[r][c] > 9) {
                return true;
            }
        }
    }
}

function inBounds(grid, p) {
    let h = grid.length;
    let w = grid[0].length;
    return p.r >= 0 && p.r < h && p.c >= 0 && p.c < w; 
}

function add(d, p) {
    return {r: d.r + p.r, c: d.c + p.c};
}

function hash(p) {
    return `${p.r}:${p.c}`;
}

function flash(grid, disabled) {
    let ng = [];
    for (let row of grid) {
        ng.push(row.slice());
    }
    let adj = [
        {r: -1, c: -1},{r: -1, c: 0},{r: -1, c: 1},
        {r: 0, c: -1},{r: 0, c: 1},
        {r: 1, c: -1},{r: 1, c: 0},{r: 1, c: 1}
    ];
    for (let r = 0; r < ng.length; r++) {
        for (let c = 0; c < ng[0].length; c++) {
            let h = hash({r: r, c: c});
            if (ng[r][c] > 9 && !(h in disabled)) {
                ng[r][c] = 0;
                totalFlashes += 1;
                disabled[h] = true;
                for (let d of adj) {
                    let np = add(d, {r: r, c: c});
                    let h2 = hash(np);
                    if (inBounds(ng, np) && !(h2 in disabled)) {
                        ng[np.r][np.c] += 1;
                    }
                }
            }
        }
    }
    return ng;
}

function allFlash(grid) {
    for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[0].length; c++) {
            if (grid[r][c] !== 0) {
                return false;
            }
        }
    }
    return true;
}

export default function P2() {
    let [ans, setAns] = React.useState(`P2`);
    React.useEffect(function solution() {
        console.clear();
        
        let grid = data.trim().split("\n").map(x => x.split("").map(x => parseInt(x)));

        let steps = 0;
        while (true) {
            grid = advance(grid);

            // Tracks which oct have already flashed this turn 
            let disabled = {};
            
            while (checkFlash(grid)) {
                grid = flash(grid, disabled);
            }

            steps += 1;

            if (allFlash(grid)) {
                p(steps);
                break;
            }
        }

        //p(totalFlashes);
    });

    return (
        <div className={styles.P2}>{ans}</div>
    );
}