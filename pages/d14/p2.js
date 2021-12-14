import React from 'react';
import styles from './P2.module.css';
import data from './input.txt';
//import data from './testinput.txt';
import * as utils from '../../utils/utils.js';

const p = (v) => console.log(v);

export default function P2() {
    let [ans, setAns] = React.useState(`P2`);
    React.useEffect(function solution() {
        console.clear();
        
        let [base, pairs] = data.trim().split("\n\n");
        pairs = pairs.split("\n").map(x => x.split(" -> "));

        let ruleLookup = {};
        for (let [from, to] of pairs) {
            ruleLookup[from] = to;
        }

        let resultsLookup = {};

        for (let k in ruleLookup) {
            let one = doSteps(ruleLookup, 20, k.split(""));
            let two = getCount(one);
            let three = removeOuter(two, k.split(""));
            resultsLookup[k] = three;
        }

        let origBase = doSteps(ruleLookup, 20, base.split(""));
        let fz = getCount(origBase);

        for (let i = 0; i < origBase.length - 1; i++) {
            let pair = origBase[i] + origBase[i + 1];
            let fzMap = resultsLookup[pair];
            addInPlace(fz, fzMap);
        }

        let fzList = [];
        for (let k in fz) {
            let value = fz[k];
            fzList.push([value, k]);
        }
    
        fzList.sort((a, b) => a[0] - b[0]);
        let total = fzList[fzList.length - 1][0] - fzList[0][0];
        p(total);
    });

    return (
        <div className={styles.P2}>{ans}</div>
    );
}

function addInPlace(fz, fzMap) {
    for (let k in fzMap) {
        fz[k] += fzMap[k];
    }
}

function removeOuter(fzList, removeList) {
    for (let letter of removeList) {
        fzList[letter] -= 1;
    }
    return fzList;
}

function doSteps(ruleLookup, number, origBase) {    
    let steps = number;
    while (steps > 0) {
        // For each pair in the base
        let nextBase = [];
        for (let i = 0; i < origBase.length - 1; i++) {

            let pair = origBase[i] + origBase[i + 1];
            let insertChar = ruleLookup[pair];

            nextBase.push(origBase[i]);
            nextBase.push(insertChar);

        }
        nextBase.push(origBase[origBase.length - 1]);
        origBase = nextBase;
        steps -= 1;
    }

    return origBase;
}

function getCount(origBase) {
    let fz = {};
    for (let letter of origBase) {
        if (!(letter in fz)) {
            fz[letter] = 0;
        }
        fz[letter] += 1;
    }
    return fz;
}