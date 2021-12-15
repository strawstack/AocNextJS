import React from 'react';
import styles from './P1.module.css';
import data from './input.txt';
import * as utils from '../../utils/utils.js';

const p = (v) => console.log(v);

export default function P1() {
    let [ans, setAns] = React.useState(`P1`);
    React.useEffect(function solution() {
        console.clear();
        
        let grid = data.trim().split("\n").map(x => x.split("").map(y => parseInt(y)));
        let H = grid.length;
        let W = grid[0].length;

        // Bottom row
        for (let c = W - 2; c >= 0; c--) {
            grid[H - 1][c] += grid[H - 1][c + 1];
        }

        // Right most column
        for (let r = H - 2; r >= 0; r--) {
            grid[r][W - 1] += grid[r + 1][W - 1];
        }

        for (let r = H - 2; r >= 0; r--) {
            for (let c = W - 2; c >= 0; c--) {
                grid[r][c] += Math.min(grid[r + 1][c], grid[r][c + 1]);
            }
        }

        let final = Math.min(grid[1][0], grid[0][1]);

        p(final);
    });

    return (
        <div className={styles.P1}>{ans}</div>
    );
}