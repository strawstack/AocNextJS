import React from 'react';
import styles from './P2.module.css';
import data from './input.txt';
import * as utils from '../../utils/utils.js';
import { urlObjectKeys } from 'next/dist/shared/lib/utils';

const p = (v) => console.log(v);

function copy(a) {
    return {...a};
}

// subtract b from a 
function sub(a, b) {
    let _a = copy(a);
    let _b = copy(b);
    for (let k in _b) {
        if (k in _a) {
            delete _a[k];
        }
    }
    return _a;
}

function getSingle(a) {
    return Object.keys(a)[0];
}

function size(a) {
    return Object.keys(a).length;
}

function equal(a, b) {
    return size(sub(a, b)) === 0 && size(sub(b, a)) === 0;
}

function stringToMap(a) {
    let m = {};
    for (let letter of a) {
        m[letter] = true;
    }
    return m;
}

let numberLookup = [
    stringToMap("abcefg"),  // 0
    stringToMap("cf"),      // 1
    stringToMap("acdeg"),   // 2
    stringToMap("acdfg"),   // 3
    stringToMap("bcdf"),    // 4
    stringToMap("abdfg"),   // 5
    stringToMap("abdefg"),  // 6
    stringToMap("acf"),     // 7
    stringToMap("abcdefg"), // 8
    stringToMap("abcdfg"),  // 9
];
function numberToPattern(number) {
    return numberLookup[number];
}

let patternLookup = {
    "abcefg": 0,
    "cf": 1,
    "acdeg": 2,
    "acdfg": 3,
    "bcdf": 4,
    "abdfg": 5,
    "abdefg": 6,
    "acf": 7,
    "abcdefg": 8,
    "abcdfg": 9
};
function patternToNumber(pattern) {
    return patternLookup[pattern];
}

function segContains(seg, values) {
    for (let letter of values) {
        if (seg.indexOf(letter) === -1) {
            return false;
        }
    }
    return true;
}

function segContainsNumber(seg, values) {
    let count = 0;
    for (let letter of values) {
        if (seg.indexOf(letter) !== -1) {
            count += 1;
        }
    }
    return count;
}

function endCondition(rules) {
    let lookup = {};
    for (let rule of rules) {
        let keys = Object.keys(rule[0]);
        if (keys.length === 1) {
            lookup[keys[0]] = true;
        }
    }
    return Object.keys(lookup).length === 7;
}

function hashRule(rule) {
    let first = Object.keys(rule[0]);
    first.sort();
    let snd = Object.keys(rule[1]);
    snd.sort();
    return `${first.join("")}:${snd.join("")}`;
}

function mix(r1, r2) {
    if (hashRule(r1) === hashRule(r2)) {
        return false;
    }
    if (Object.keys(r2[0]).length > Object.keys(r1[0]).length) {
        let z = r1;
        r1 = r2;
        r2 = z;
    }
    // r1 is larger than r2
    let newRule = [sub(r1[0], r2[0]), sub(r1[1], r2[1])];
    return newRule;
}

function extractRules(rules) {
    let wireLookup = {};
    for (let rule of rules) {
        let keys = Object.keys(rule[0]);
        if (keys.length === 1) {
            wireLookup[keys[0]] = Object.keys(rule[1])[0];
        }
    }
    return wireLookup;
}

function translate(wireLookup, code) {
    let ans = [];
    for (let letter of code) {
        ans.push(wireLookup[letter]);
    }
    ans.sort();
    return ans.join("");
}

export default function P2() {
    let [ans, setAns] = React.useState(`P2`);
    React.useEffect(function solution() {
        console.clear();
        
        let lst = data.trim().split("\n").map(x => {
            let [in_digits, out_digits] = x.split(" | ");
            in_digits = in_digits.split(" ");
            out_digits = out_digits.split(" ");
            return [in_digits, out_digits];
        });

        let total = 0;

        for (let row of lst) {
            let segmentLookup = {};
            let rules = [];
            let segments = row[0];
            segments.sort((a, b) => a.length - b.length);

            // Ex. segments = ['df', 'cdf', 'dfae', 'dfagc', 'fgaec', 'abcgd', 'bcfage', 'adcefg', 'fgcbed', 'dcbgafe']
            for (let seg of segments) {
                if (seg.length === 2) { // 1
                    segmentLookup[1] = seg; 

                } else if (seg.length === 3) { // 7
                    segmentLookup[7] = seg;

                } else if (seg.length === 4) { // 4
                    segmentLookup[4] = seg;

                } else if (seg.length === 7) { // 8
                    segmentLookup[8] = seg;

                } else if (seg.length === 5 && segContains(seg, segmentLookup[1])) { // 3
                    segmentLookup[3] = seg;

                } else if (seg.length === 5 && segContainsNumber(seg, segmentLookup[4]) === 2) { // 2
                    segmentLookup[2] = seg;

                } else if (seg.length === 5 && segContainsNumber(seg, segmentLookup[4]) === 3) { // 5
                    segmentLookup[5] = seg;

                } else if (seg.length === 6 && segContains(seg, segmentLookup[4])) { // 9
                    segmentLookup[9] = seg;

                } else if (seg.length === 6 && segContains(seg, segmentLookup[1])) { // 0
                    segmentLookup[0] = seg;

                } else if (seg.length === 6 && !segContains(seg, segmentLookup[1])) { // 6
                    segmentLookup[6] = seg;

                }
            }
            
            for (let k in segmentLookup) {
                let seg = segmentLookup[k];
                rules.push([stringToMap(seg), numberLookup[k]]);
            }

            let existingRules = {};
            for (let rule of rules) {
                existingRules[hashRule(rule)] = true;
            }

            // endCondition = there are 7 rules that map a single letter
            while (!endCondition(rules)) {
                let newRules = [];
                for (let i = 0; i < rules.length; i++) {
                    for (let j = i + 1; j < rules.length; j++) {
                        let r1 = rules[i];
                        let r2 = rules[j];
                        let newRule = mix(r1, r2);
                        if (newRule !== false) {
                            newRules.push(newRule);
                        }
                    }
                }

                for (let newRule of newRules) {
                    let h = hashRule(newRule);
                    if (!(h in existingRules)) {
                        existingRules[h] = true;
                        rules.push(newRule);
                    }
                }
            }

            let wireLookup = extractRules(rules);
            let code = row[1];
            code = code.map(x => translate(wireLookup, x)).map(x => patternToNumber(x));

            total += parseInt(code.join(""));
        }

        p(total);
        setAns(total);
    });

    return (
        <div className={styles.P2}>{ans}</div>
    );
}