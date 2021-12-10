import React from 'react';
import styles from './P2.module.css';
import data from './input.txt';
import * as utils from '../../utils/utils.js';

const p = (v) => console.log(v);

const d = false;

function add(a, b) {
    return {r: a.r + b.r, c: a.c + b.c};
}

function inBounds(grid, p) {
    let height = grid.length;
    let width = grid[0].length;
    return p.r >= 0 && p.r < height && p.c >= 0 && p.c < width;
}

function hash(p) {
    return `${p.r}:${p.c}`;
}

export default function P2() {
    let [ans, setAns] = React.useState(`P2`);
    React.useEffect(function solution() {
        console.clear();
        
        let grid = data.trim().split("\n");

        //p(grid);
        
        // For all points in grid
        let lowPoints = [];
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
                    lowPoints.push({r: r, c: c});
                }
            }
        }

        let sizes = [];

        for (let point of lowPoints) {
            let adj = [{r: -1, c: 0}, {r: 1, c: 0}, {r: 0, c: -1}, {r: 0, c: 1}];
            let visited = {};
            let q = [point];
            while (q.length > 0) {

                let cpoint = q.pop();
                if (hash(cpoint) in visited) {
                    continue;
                }
                visited[hash(cpoint)] = true;

                for (let d of adj) {
                    let testPoint = add(cpoint, d);
                    if (inBounds(grid, testPoint)) {
                        let value = parseInt(grid[testPoint.r][testPoint.c]);
                        if (value !== 9 && !(hash(testPoint) in visited)) {
                            q.push(testPoint);
                        }
                    }
                }
            }
            let size = Object.keys(visited).length;
            sizes.push(size);
        }

        sizes.sort((a, b) => b - a);
        p(sizes[0] * sizes[1] * sizes[2]);
        setAns(sizes[0] * sizes[1] * sizes[2]);
    });

    return (
        <div className={styles.P2}>{ans}</div>
    );
}