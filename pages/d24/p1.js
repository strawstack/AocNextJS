import React from 'react';
import styles from './P1.module.css';
import data from './input.txt';
//import data from './input_test.txt';
import * as utils from '../../utils/utils.js';

const p = (v) => console.log(v);
const d = true;

export default function P1() {
    let [ans, setAns] = React.useState(`P1`);
    React.useEffect(function solution() {
        console.clear();

        let n = [
            1, // 0  = 11881376
            2, // 1  = 456976
            9, // 2  = 0
            3, // 3  = 17576
            4, // 4  = 0
            9, // 5  = 676
            9, // 6  = 26
            8, // 7  = 0
            9, // 8  = 0
            4, // 9  = 0
            9, // 10 = 4291014962
            1, // 11 = 4291014962
            9, // 12 = 0
            9  // 13 = 1
        ];

        let index = 0;
        let getNextNumber = () => {
            let val = n[index];
            index += 1;
            return val;
        }

        let lst = data.trim().split("\n");
        let vars = {
            w: 0, x: 0, y: 0,
            z: 0
        };

        for (let line of lst) {
            let cmd = unWrap(line, vars);
            try {
                doAction(cmd, vars, getNextNumber);
                if (d) {
                    console.log(vars);
                }
            } catch {
                console.log("crash");
            }
        }

        // 13891918299999 - too high
        // 13594918299999 - too high
        // 11919119999991 - too low

        let base = 0;
        let ans = vars.z;

        console.log(n.map(x => x.toString()).join(""));
        console.log(`base: ${base}`);
        console.log(`digits: ${(ans - base).toString().length}`);
        console.log(ans - base);
    });

    return (
        <div className={styles.P1}>{ans}</div>
    );
}

function unWrap(line, vars) {
    let parts = line.split(" ");
    let type = null;
    let v1 = null;
    let v2 = null;
    if (parts.length == 2) {
        type = parts[0];
        v1 = parts[1];

    } else { // parts.length == 3
        let [_f, _v1, _v2] = parts;
        if ("wxyz".indexOf(_v2) !== -1) {
            _v2 = vars[_v2];
        }
        type = _f;
        v1 = _v1;
        v2 = _v2;
    }
    return {
        type: type,
        a: v1,
        b: parseInt(v2)
    };
}

function doAction(cmd, vars, getNextNumber) {
    if (cmd.type === 'inp') {
        let value = getNextNumber();
        if (d) {
            console.log(`vars.w = ${value}`);
        }
        vars.w = value;

    } else if (cmd.type === 'add') {
        if (d) {
            console.log(`vars[${cmd.a}] = ${vars[cmd.a]} + ${cmd.b}`);
        }
        vars[cmd.a] = vars[cmd.a] + cmd.b;

    } else if (cmd.type === 'mul') {
        if (d) {
            console.log(`vars[${cmd.a}] = ${vars[cmd.a]} * ${cmd.b}`);
        }
        vars[cmd.a] = vars[cmd.a] * cmd.b;

    } else if (cmd.type === 'div') {
        if (d) {
            console.log(`vars[${cmd.a}] = floor(${vars[cmd.a]} / ${cmd.b})`);
        }
        vars[cmd.a] = Math.floor(vars[cmd.a] / cmd.b);
        if (cmd.b === 0) {
            throw "crash";
        }

    } else if (cmd.type === 'mod') {
        if (d) {
            console.log(`vars[${cmd.a}] = ${vars[cmd.a]} % ${cmd.b}`);
        }
        vars[cmd.a] = vars[cmd.a] % cmd.b;
        if (vars[cmd.a] < 0 || cmd.b <= 0) {
            throw "crash";
        }

    } else if (cmd.type === 'eql') {
        if (d) {
            console.log(`vars[${cmd.a}] = ${(vars[cmd.a] === cmd.b) ? 1 : 0}`);
        }
        vars[cmd.a] = (vars[cmd.a] === cmd.b) ? 1 : 0;

    } else {
        // console.log(cmd);
    }
}
