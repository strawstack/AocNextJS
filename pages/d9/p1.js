import React from 'react';
import styles from './P1.module.css';
import data from './input.txt';
import * as utils from '../../utils/utils.js';

const p = (v) => console.log(v);

function add(a, b) {
    return {r: a.r + b.r, c: a.c + b.c};
}

function inBounds(grid, p) {
    let height = grid.length;
    let width = grid[0].length;
    return p.r >= 0 && p.r < height && p.c >= 0 && p.c < width;
}

export default function P1() {
    let [ans, setAns] = React.useState(`P1`);
    React.useEffect(function solution() {
        console.clear();
        
        let grid = data.trim().split("\n");

        //p(grid);
        
        // For all points in grid
        let ans = [];
        for (let r = 0; r < grid.length; r++) {
            for (let c = 0; c < grid[0].length; c++) {
                let adj = [{r: -1, c: 0}, {r: 1, c: 0}, {r: 0, c: -1}, {r: 0, c: 1}];
                let locValue = parseInt(grid[r][c]);
                
                // Test the four adj points 
                let isLow = true;
                for (let d of adj) {
                    let testPoint = add({r: r, c: c}, d);
                    if (inBounds(grid, testPoint)) {
                        let value = parseInt(grid[testPoint.r][testPoint.c]);
                        if (value <= locValue) {
                            isLow = false;
                        }
                    }
                }
                if (isLow) {
                    ans.push(locValue + 1);
                }
            }
        }

        p(ans.reduce((p, c) => p + c));
        
    });

    return (
        <div className={styles.P1}>{ans}</div>
    );
}