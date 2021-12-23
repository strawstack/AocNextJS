import React from 'react';
import styles from './P2.module.css';
import data from './input.txt';
import * as utils from '../../utils/utils.js';

const p = (v) => console.log(v);

// map: state -> [p1_wins, p2_wins]
let stateLookup = {};

// All outcomes that can result from rolling three 3-sided die
let outcomes = getThreeDiceOutcomes();

export default function P2() {
    let [ans, setAns] = React.useState(`P2`);
    React.useEffect(function solution() {
        console.clear();
        
        // Get inital player position
        let pos = data.split("\n").map(x => parseInt(x.split(": ")[1]));
        
        // debug
        //pos = [4, 8];

        let p1_score = 0;
        let p2_score = 0;
        let turn = 0;
        let [w1, w2] = play(pos[0], p1_score, pos[1], p2_score, turn);

        p(Math.max(w1, w2));

    });

    return (
        <div className={styles.P2}>{ans}</div>
    );
}

// Play forward from a given state
// Exit as soon as possible
// Path is history of states
function play(pos1, p1_score, pos2, p2_score, turn) {

    let sh = stateHash(pos1, p1_score, pos2, p2_score, turn);

    if (sh in stateLookup) {
        return stateLookup[sh];
    }

    if (p1_score >= 21) {
        return [1, 0];
    }
    if (p2_score >= 21) {
        return [0, 1];
    }

    let w1 = 0;
    let w2 = 0;
    for (let rollValue in outcomes) {
        let times = outcomes[rollValue];
        let rollNumber = parseInt(rollValue);

        if (turn === 0) {
            
            let npos1 = ((pos1 + rollNumber - 1) % 10) + 1;
            let np1_score = p1_score + npos1;
            
            let [fw1, fw2] = play(npos1, np1_score, pos2, p2_score, 1);
            
            w1 = w1 + times * fw1;
            w2 = w2 + times * fw2;

        } else {
            let npos2 = ((pos2 + rollNumber - 1) % 10) + 1;
            let np2_score = p2_score + npos2;
            
            let [fw1, fw2] = play(pos1, p1_score, npos2, np2_score, 0);
            
            w1 = w1 + times * fw1;
            w2 = w2 + times * fw2;
        }
    }

    stateLookup[sh] = [w1, w2];
    return [w1, w2];

}

function stateHash(p1_pos, p1_score, p2_pos, p2_score, turn) {
    return `${p1_pos}:${p1_score}:${p2_pos}:${p2_score}:${turn}`;
}

function getThreeDiceOutcomes() {
    // map: value of outcome -> times hit
    let outcomes = {};
    for (let i = 1; i < 4; i++) {
        for (let j = 1; j < 4; j++) {
            for (let k = 1; k < 4; k++) {
                let rollValue = i + j + k;
                if (!(rollValue in outcomes)) {
                    outcomes[rollValue] = 0;
                }
                outcomes[rollValue] += 1;
            }
        }
    }
    return outcomes;
}