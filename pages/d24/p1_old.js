import React from 'react';
import styles from './P1.module.css';
import data from './input.txt';
import * as utils from '../../utils/utils.js';

const p = (v) => console.log(v);

export default function P1() {
    let [ans, setAns] = React.useState(`P1`);
    React.useEffect(function solution() {
        console.clear();

        // Manually derive equation

        let values = [
            1, // d0 -0.3076923076923077
            3, // d1 -0.01183431952662728
            5, // d2 -0.000455166135639562
            9, // d3 0.00045516613563945096
            4, // d4 -0.000455166135639562
            9, // d5 0.00045516613563945096
            1, // d6 -0.000455166135639562
            8, // d7 -0.000017506389832333547
            2, // d8 -0.0000006733226859401142
            9, // d9 0.0000006733226857735808e
            9, // d10 0.000017506389832167013
            9, // d11 0.00045516613563945096
            9, // d12 0.011834319526627168
            9  // d13 0.3076923076923076
        ];

        console.log(values.map(x => x.toString()).join(""));

        let d0 = values[0];
        let d1 = values[1];
        let d2 = values[2];
        let d3 = values[3];
        let d4 = values[4];
        let d5 = values[5];
        let d6 = values[6];
        let d7 = values[7];
        let d8 = values[8];
        let d9 = values[9];
        let d10 = values[10];
        let d11 = values[11];
        let d12 = values[12];
        let d13 = values[13];

        let ans = (((((((d3 + 11) + ((((d5 + ((((((((d9 + 6) - (d8 + 1) + (((d10 + 10) + (((d11 + 12) + (((d12 + 3) + ((d13 + 5) * 26)) * 26)) * 26)) * 26)) / 26) - (d7 + 11)) / 26) - (d6 + 4)) / 26) * 26)) - (d4 + 5)) / 26) * 26)) - (d2 + 5)) / 26) - (d1 + 10)) / 26) - (d0 + 13)) / 26;

        // When all numbers are 1
        let base = -0.31753704284756246;

        // 13891918299999 - too high
        // 13594918299999 - too high
        console.log(ans);
    });

    return (
        <div className={styles.P1}>{ans}</div>
    );
}
