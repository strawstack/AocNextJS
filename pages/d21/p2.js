import React from 'react';
import styles from './P2.module.css';
import data from './input.txt';
import * as utils from '../../utils/utils.js';

const p = (v) => console.log(v);

// map: state -> [p1_wins, p2_wins]
let stateLookup = {};

// All outcomes that can result from rolling three 3-sided die
let outcomes;

export default function P2() {
    let [ans, setAns] = React.useState(`P2`);
    React.useEffect(function solution() {
        console.clear();
        
        // Get inital player position
        let pos = data.split("\n").map(x => parseInt(x.split(": ")[1]));
        
        // debug
        pos = [4, 8];

        // Calculate possible outcomes
        outcomes = getThreeDiceOutcomes();

        p(outcomes)

        // Init recursive query to play all games 
        let turn = 0;
        let startState = [pos[0], 0, pos[1], 0, turn];
        let result = play(startState); // dfs by the way

        // 55893788 - too low
        // 1509132276 - too low
        p(Math.max(...result));

        let p1_debug_answer = 444356092776315;
        let p2_debug_answer = 341960390180808;
        if (p1_debug_answer === result[0] && p2_debug_answer === result[1]) {
            p("Correct! You get a star *");

        } else {
            if (result[0] < p1_debug_answer) {
                p("too low");
                p(p1_debug_answer - result[0]);

            } else {
                p("too high");
                p(result[0] - p1_debug_answer);
            }
        }

    });

    return (
        <div className={styles.P2}>{ans}</div>
    );
}

// Play forward from a given state
// Exit as soon as possible
// Path is history of states
function play([p1_pos, p1_score, p2_pos, p2_score, turn]) {
    let sh = stateHash([p1_pos, p1_score, p2_pos, p2_score, turn]);

    // We've been here before, and we know the results
    if (sh in stateLookup) {
        let result = stateLookup[sh];
        return result;
    }

    // A player has won in this state
    if (p1_score >= 21) {
        return [1, 0];
    }
    if (p2_score >= 21) {
        return [0, 1];
    }

    let totalResults = [0, 0];

    // For every possible outcome
    for (let rollValue in outcomes) {
        let times = outcomes[rollValue];

        if (turn === 0) { // p1 turn 

            let p1_newPos = ((p1_pos + rollValue - 1) % 10) + 1;
            let p1_newScore = p1_score + p1_newPos;

            let result = play([p1_newPos, p1_newScore, p2_pos, p2_score, 1]);

            totalResults[0] = (totalResults[0] + result[0] * times);
            totalResults[1] = (totalResults[1] + result[1] * times);

        } else { // p2 turn

            let p2_newPos = ((p2_pos + rollValue - 1) % 10) + 1;
            let p2_newScore = p2_score + p2_newPos;

            let result = play([p1_pos, p1_score, p2_newPos, p2_newScore, 0]);

            totalResults[0] = (totalResults[0] + result[0] * times);
            totalResults[1] = (totalResults[1] + result[1] * times);

        }
    }

    stateLookup[sh] = [...totalResults];
    return [...totalResults];
}

function stateHash([p1_pos, p1_score, p2_pos, p2_score, turn]) {
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