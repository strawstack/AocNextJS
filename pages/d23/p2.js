import React from 'react';
import styles from './P2.module.css';
import data from './input.txt';
import * as utils from '../../utils/utils.js';

const p = (v) => console.log(v);

export default function P2() {
    let [ans, setAns] = React.useState(`P2`);
    React.useEffect(function solution() {
        console.clear();
        
        // Original stack start states
        let stacks = [
            ['B', 'D', 'D', 'A'],
            ['C', 'B', 'C', 'D'],
            ['D', 'A', 'B', 'B'],
            ['A', 'C', 'A', 'C']
        ];

        // Represents holding areas
        let holding = [
            null, null, // left side
            null, null, null, // center
            null,null // right side
        ];

        // Set of hashes of previous states
        let prevState = {};

        // Function for number of upward steps to get out of stack
        let upSteps = (si) => {
            return 5 - stacks[si].length();
        };

        // 2D array [stack number][holding number]
        let sideSteps = [
            [2,1,1,3,5,7,8],
            [4,3,1,1,3,5,6],
            [6,5,3,1,1,3,4],
            [8,7,5,3,1,1,2]
        ];

    });

    return (
        <div className={styles.P2}>{ans}</div>
    );
}