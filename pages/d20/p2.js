import React from 'react';
import styles from './P2.module.css';
import data from './input.txt';
//import data from './input_test.txt';
import * as utils from '../../utils/utils.js';

const p = (v) => console.log(v);

export default function P2() {
    let [ans, setAns] = React.useState(`P2`);
    React.useEffect(function solution() {
        console.clear();
        
        let [enhance, inputImage] = data.trim().split("\n\n");
        inputImage = inputImage.split("\n");

        let minRow = 0;
        let maxRow = inputImage.length;
        let minCol = 0;
        let maxCol = inputImage[0].length;

        let inputImageLookup = {};
        for (let r in inputImage) {
            for (let c in inputImage[r]) {
                let char = inputImage[r][c];
                inputImageLookup[hash({r, c})] = char;
            }
        }

        let count = 0;
        while (count < 50) {
            let outputInputImageLookup = {};

            minRow -= 1;
            maxRow += 1;
            minCol -= 1;
            maxCol += 1;

            for (let r = minRow; r <= maxRow; r++) {
                for (let c = minCol; c <= maxCol; c++) {
                    let coord = {r, c};
                    let outPutChar = getOutputCharacter(inputImageLookup, enhance, coord, minRow, maxRow, minCol, maxCol, count);
                    outputInputImageLookup[hash(coord)] = outPutChar;
                }
            }

            inputImageLookup = outputInputImageLookup;
            count += 1;
        }

        let total = 0;
        for (let k in inputImageLookup) {
            if (inputImageLookup[k] === "#") {
                total += 1;
            }
        }
        
        // 10000 incorrect
        // 211 to low
        // 6089 to high
        // 5958 incorrect
        p(total)

    });

    return (
        <div className={styles.P2}>{ans}</div>
    );
}

function hash(coord) {
    return `${coord.r}:${coord.c}`;
}

function getOutputCharacter(inputImageLookup, enhance, coord, minRow, maxRow, minCol, maxCol, round) {
    let adj = [
        {r: -1, c: -1},
        {r: -1, c: 0},
        {r: -1, c: 1},

        {r: 0, c: -1},
        {r: 0, c: 0},
        {r: 0, c: 1},

        {r: 1, c: -1},
        {r: 1, c: 0},
        {r: 1, c: 1}
    ];

    let pattern = [];
    for (let a of adj) {
        let target = add(coord, a);
        let th = hash(target);
        if (!(th in inputImageLookup)) {
            pattern.push((round % 2 === 1) ? "#" : ".");
        } else {
            pattern.push(inputImageLookup[th]);
        }
    }
    let ps = pattern.join("");
    ps = ps.replaceAll("#", "1");
    ps = ps.replaceAll(".", "0");
    let number = parseInt(ps, 2);
    
    return enhance[number]; 
}

function add(coord, adj) {
    return {
        r: coord.r + adj.r,
        c: coord.c + adj.c
    };
}

function inBounds(coord, minRow, maxRow, minCol, maxCol) {
    return coord.r >= minRow && coord.r <= maxRow && coord.c >= minCol && coord.c <= maxCol;
}