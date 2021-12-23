import React from 'react';
import styles from './P2.module.css';
import data from './input.txt';
import * as utils from '../../utils/utils.js';

const p = (v) => console.log(v);

export default function P2() {
    let [ans, setAns] = React.useState(`P2`);
    React.useEffect(function solution() {
        console.clear();
        
        let steps = data.trim().split("\n").map(x => x.split(" ")); 
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

        // steps
        // list of cubes
        // a cube is {cmd: 'on/off', x: [low, hi], y: [low, hi], z: [low, hi]}

        

    });

    return (
        <div className={styles.P2}>{ans}</div>
    );
}

// Add cube to tree
    // if 'on' create new nodes via spliting
    // if 'off' remove any nodes where there is full overlap  
function addToOctTree(root, cube) {

}