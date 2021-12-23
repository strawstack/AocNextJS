import React from 'react';
import styles from './P1.module.css';
import data from './input.txt';
import * as utils from '../../utils/utils.js';

const p = (v) => console.log(v);

export default function P1() {
    let [ans, setAns] = React.useState(`P1`);
    React.useEffect(function solution() {
        console.clear();
        
        let steps = data.trim().split("\n").slice(0, 20).map(x => x.split(" ")); 
        steps = steps.map(x => {
            let [cmd, other] = x;
            other = other.split(",").map(y => y.split("=")[1]);
            other = other.map(z => z.split("..").map(k => parseInt(k)));
            return {
                cmd: cmd,
                x: other[0],
                y: other[1],
                z: other[2]
            };
        });

        p(steps)

        let grid = {};
        
        for (let {cmd, x, y, z} of steps) {
            executeCmd(grid, cmd, x, y, z);
        }
        
        let bounds = {
            x: [-50, 50],
            y: [-50, 50],
            z: [-50, 50]
        };

        let count = 0;
        for (let xi = bounds.x[0]; xi <= bounds.x[1]; xi++) {
            for (let yi = bounds.y[0]; yi <= bounds.y[1]; yi++) {
                for (let zi = bounds.z[0]; zi <= bounds.z[1]; zi++) {
                    let h = hash({x: xi, y: yi, z: zi});
                    if (h in grid) {
                        count += 1;
                    }
                }
            }
        }

        p(count);

    });

    return (
        <div className={styles.P1}>{ans}</div>
    );
}

function executeCmd(grid, cmd, x, y, z) {
    
    for (let xi = x[0]; xi <= x[1]; xi++) {
        for (let yi = y[0]; yi <= y[1]; yi++) {
            for (let zi = z[0]; zi <= z[1]; zi++) {
                let h = hash({x: xi, y: yi, z: zi});

                if (cmd === 'on') {
                    grid[h] = true;
                    
                } else { // cmd === 'off'
                    delete grid[h];

                }

            }
        }
    }
}

function hash(point) {
    return JSON.stringify(point);
}