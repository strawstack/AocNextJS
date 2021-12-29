import React from 'react';
import styles from './P2.module.css';
//import data from './input.txt';
//import data from './input_test.txt';
import * as utils from '../../utils/utils.js';

const p = (v) => console.log(v);

const d = true;
let action = false;
let a1 = false;
let a2 = false;
let a3 = false;

let bestAnswerCost = [Infinity];

const costLook = {
    'A': 1,
    'B': 10,
    'C': 100,
    'D': 1000
};

const stackLocations = [2, 4, 6, 8];

// Function for number of upward steps to get out of stack
let upSteps = stack => {
    return 5 - stack.length;
};
let downSteps = stack => {
    return 4 - stack.length;
};

let letterToStackNumber = {
    'A': 0,
    'B': 1,
    'C': 2,
    'D': 3
};

// 2D array [stack number][holding number]
let sideSteps = [
    [2,1,null,1,null,3,null,5,null,7,8],
    [4,3,null,1,null,1,null,3,null,5,6],
    [6,5,null,3,null,1,null,1,null,3,4],
    [8,7,null,5,null,3,null,1,null,1,2]
];

export default function P2() {
    let [ans, setAns] = React.useState(`P2`);
    React.useEffect(function solution() {
        console.clear();

        // Original stack states
        let stacks = [
            ['B', 'D', 'D', 'A'],
            ['C', 'B', 'C', 'D'],
            ['D', 'A', 'B', 'B'],
            ['A', 'C', 'A', 'C']
        ];

        /* Test Stack
        stacks = [
            ['A', 'D', 'D', 'B'],
            ['D', 'B', 'C', 'C'],
            ['C', 'A', 'B', 'B'],
            ['A', 'C', 'A', 'D']
        ]; */

        // Movements
            // Stack to hallway
            // Hallway to stack
            // No stopping outside room

        // BFS from each letter
            // If letter in stack with other letters below
            // Find hallway positions
            // If letter in hallway, find stack positions

        // Represents holding areas
        let holds = [
            '.', '.', // left side
            'x', '.', 'x', '.', 'x', '.', 'x', // center
            '.', '.' // right side
        ];

        let startState = {
            stacks: stacks,
            holds: holds
        };

        // Set of hashes of previous states
        let seenStates = {};

        // Advance startState in all possible directions
        // don't double step on a seenState
        // Track best answer and cull any states that cost more
        explore(startState, seenStates, 0);

        // 57952 - too high
        p(bestAnswerCost);
    });

    return (
        <div className={styles.P2}>{ans}</div>
    );
}

/*
A 10 + 8
B 4 + 3
C 3
D 3
total: 3088 -> 3288
*/

let testStates = [
    {
        state: [[
            'ADDB',
            'DBCC',
            'CABB',
            'ACAD',
        ], '..x.x.x.x..'],
        expectedCost: 0
    },
    {
        state: [[
            'ADDB',
            'DBCC',
            'CABB',
            'ACA',
        ], '..x.x.x.x.D'],
        expectedCost: 3000
    },
    {
        state: [[
            'ADDB',
            'DBCC',
            'CABB',
            'AC',
        ], 'A.x.x.x.x.D'],
        expectedCost: 3010
    },
    {
        state: [[
            'ADDB',
            'DBCC',
            'CAB',
            'AC',
        ], 'A.x.x.x.xBD'],
        expectedCost: 3050
    },
    {
        state: [[
            'ADDB',
            'DBCC',
            'CA',
            'AC',
        ], 'A.x.x.xBxBD'],
        expectedCost: 3080
    },
    { // 5 confirmed
        state: [[
            'ADDB',
            'DBCC',
            'C',
            'AC',
        ], 'AAx.x.xBxBD'],
        expectedCost: 3088
    },
    { // 6
        state: [[
            'ADDB',
            'DBC',
            'C',
            'AC',
        ], 'AAx.xCxBxBD'],
        expectedCost: 3288
    },
    { // 7
        state: [[
            'ADDB',
            'DBC',
            'CC',
            'AC',
        ], 'AAx.x.xBxBD'],
        expectedCost: 3788
    },
    { // 8
        state: [[
            'ADDB',
            'DB',
            'CC',
            'AC',
        ], 'AAx.xCxBxBD'],
        expectedCost: 4088
    },
    { // 9
        state: [[
            'ADDB',
            'DB',
            'CCC',
            'AC',
        ], 'AAx.x.xBxBD'],
        expectedCost: 4388
    },
];

function explore(
    {stacks, holds}, seenStates, costSoFar) {

    if (false) {
        let testState = testStates[8];
        let cfs = confirmState(stacks, holds, testState.state);
        if (cfs && costSoFar === testState.expectedCost && !action) {
            console.log("state confirmed");
            console.log(`cost: ${costSoFar}, expected: ${testState.expectedCost}`);
            console.log(`correct: ${costSoFar === testState.expectedCost}`);
            action = true;
        }
    }

    let cstacks = JSON.parse(JSON.stringify(stacks));
    let cholds = JSON.parse(JSON.stringify(holds));

    // Cull expensive solutions
    if (costSoFar >= bestAnswerCost) {
        return;
    }

    let h = hashState({stacks: cstacks, holds: cholds});
    if (h in seenStates && seenStates[h] <= costSoFar) {
        return;
    }
    seenStates[h] = costSoFar;

    if (answerFound(cstacks)) {
        bestAnswerCost[0] = Math.min(bestAnswerCost[0], costSoFar);
        return;
    }

    // Collect locations reachable from stack top
    let stackReach = [];
    for (let i = 0; i < cstacks.length; i++) {
        let reach = [];

        // Try left
        let loc = stackLocations[i];

        while (true) {
            loc -= 1;
            // If out of bounds
            if (loc < 0) { break; }

            // If it's a letter
            if (isLetter(cholds[loc])) { break; }

            // Push spot if not an x
            if (!(cholds[loc] === 'x')) {
                reach.push(loc);
            }
        }

        // Try right
        loc = stackLocations[i];
        while (true) {
            loc += 1;

            // If out of bounds
            if (loc >= cholds.length) { break; }

            // If it's a letter
            if (isLetter(cholds[loc])) { break; }

            // Push spot if not an x
            if (!(cholds[loc] === 'x')) {
                reach.push(loc);
            }
        }
        stackReach.push(reach);
    }

    // For each stack, try to pop an element
    // Place the element in all reachable holding cells
    for (let i = 0; i < cstacks.length; i++) {
        if (hasBadElement(cstacks, i)) {
            let upCost = upSteps(cstacks[i]);
            let ccstacks = JSON.parse(JSON.stringify(cstacks));
            let element = ccstacks[i].pop();
            for (let loc of stackReach[i]) {
                let sideCost = sideSteps[i][loc];
                let ccholds = JSON.parse(JSON.stringify(cholds));
                ccholds[loc] = element;
                let totalCost = (upCost + sideCost) * costLook[element];
                explore(
                    {stacks: ccstacks, holds: ccholds},
                    seenStates,
                    costSoFar + totalCost
                );
            }
        }
    }

    // For each holding cell element
    // Try to put it in the correct stack
    // If the stack is ready for elements to enter
    for (let i = 0; i < cholds.length; i++) {
        let elem = cholds[i];

        // Element is a letter
        if (isLetter(elem)) {
            let stackNumber = letterToStackNumber[elem];
            let targetLocation = stackLocations[stackNumber];
            let stepList = getStepList(i, targetLocation);
            let noBad = !hasBadElement(cstacks, stackNumber);

            if (noLetters(cholds, stepList) && noBad) {
                let sideCost = getSideCost(i, targetLocation);
                let downCost = downSteps(cstacks[stackNumber]);
                let totalCost = (downCost + sideCost) * costLook[elem];
                let ccholds = JSON.parse(JSON.stringify(cholds));
                let ccstacks = JSON.parse(JSON.stringify(cstacks));
                ccholds[i] = '.';
                ccstacks[stackNumber].push(elem);

                if (false) {
                    if (cfs &&
                        costSoFar === testState.expectedCost &&
                        elem === 'C') {
                        console.log(i);
                        console.log(sideCost);
                        console.log(downCost);
                        console.log(cstacks[stackNumber]);
                        console.log(ccstacks);
                        console.log(ccholds);
                        console.log(costSoFar);
                        console.log(totalCost);
                    }
                }

                explore(
                    {stacks: ccstacks, holds: ccholds},
                    seenStates,
                    costSoFar + totalCost
                );
            }
        }
    }
    return;
}

function getSideCost(i, targetLocation) {
    if (i > targetLocation) {
        return i - targetLocation;
    } else {
        return targetLocation - i;
    }
}

function confirmState(stacks, holds, [matchStacks, matchHolds]) {
    for (let i = 0; i < stacks.length; i++) {
        if (stacks[i].length !== matchStacks[i].length) {
            return false;
        }
        for (let j = 0; j < stacks[i].length; j++) {
            if (stacks[i][j] !== matchStacks[i][j]) {
                return false;
            }
        }
    }
    for (let i = 0; i < holds.length; i++) {
        if (holds[i] !== matchHolds[i]) {
            return false;
        }
    }
    return true;
}

function getStepList(i, targetLocation) {
    let dir = getDirection(i, targetLocation); // 1 or -1
    let cLoc = i;
    let steps = [];
    while (cLoc !== targetLocation) {
        cLoc += dir;
        steps.push(cLoc);
    }
    return steps;
}

function getDirection(i, targetLocation) {
    let diff = targetLocation - i;
    if (diff === 0) {
        return 0;
    } else if (diff < 0) {
        return -1;
    } else { // diff > 0
        return 1;
    }
}

// These steps in holds do not contain letters
function noLetters(cholds, stepList) {
    for (let index of stepList) {
        let symbol = cholds[index];
        if (isLetter(symbol)) {
            return false;
        }
    }
    return true;
}

function isLetter(possibleLetter) {
    if (possibleLetter === 'A') {
        return true;
    }
    if (possibleLetter === 'B') {
        return true;
    }
    if (possibleLetter === 'C') {
        return true;
    }
    if (possibleLetter === 'D') {
        return true;
    }
    return false;
}

// True if stack has element that does not belong there
function hasBadElement(stacks, i) {
    let lookup = "ABCD";
    let letter = lookup[i];
    for (let elem of stacks[i]) {
        if (elem !== letter) {
            return true;
        }
    }
    return false;
}

function hashState({stacks, holds}) {
    let hStacks = stacks.map(x => hashStack(x)).join(":");
    let hHolds = JSON.stringify(holds);
    return `${hStacks}:${hHolds}`;
}

function hashStack(stack) {
    let cstack = [...stack];
    while (cstack.length < 4) {
        cstack.push('.');
    }
    return JSON.stringify(cstack);
}

function answerFound(stacks) {
    if (stacks[0][0] !== 'A') { return false };
    if (stacks[0][1] !== 'A') { return false };
    if (stacks[0][2] !== 'A') { return false };
    if (stacks[0][3] !== 'A') { return false };

    if (stacks[1][0] !== 'B') { return false };
    if (stacks[1][1] !== 'B') { return false };
    if (stacks[1][2] !== 'B') { return false };
    if (stacks[1][3] !== 'B') { return false };

    if (stacks[2][0] !== 'C') { return false };
    if (stacks[2][1] !== 'C') { return false };
    if (stacks[2][2] !== 'C') { return false };
    if (stacks[2][3] !== 'C') { return false };

    if (stacks[3][0] !== 'D') { return false };
    if (stacks[3][1] !== 'D') { return false };
    if (stacks[3][2] !== 'D') { return false };
    if (stacks[3][3] !== 'D') { return false };
    return true;
}


// end
