import React from 'react';
import styles from './P2.module.css';
import data from './input.txt';
//import data from './input_test.txt';
import * as utils from '../../utils/utils.js';

const p = (v) => console.log(v);

const d = false;
/*
if (d) { console.log(`name: ${000}`); }
*/

let uid = 0;
let getUid = () => {
    let nextUid = uid;
    uid += 1;
    return nextUid;
};

export default function P2() {
    let [ans, setAns] = React.useState(`P2`);
    React.useEffect(function solution() {
        console.clear();
        
        let rows = data.trim().split("\n").map(x => JSON.parse(x));

        let ansList = [];
        for (let i = 0; i < rows.length; i++) {
            for (let j = 0; j < rows.length; j++) {
                if (i === j) { continue; }
                let root = add(makeTree(rows[i]), makeTree(rows[j]));
                while (true) {
                    while (true) {
                        let actionOccurs = reduceSnailExplode(root);
                        if (!actionOccurs) { break; }
                    }
                    let actionOccurs = reduceSnailSplit(root);
                    if (!actionOccurs) { break; }
                }
                let answer = evaluate(root);
                ansList.push(answer);
            }
        }

        p(Math.max(...ansList));

    });

    return (
        <div className={styles.P2}>{ans}</div>
    );
}

// Add two trees by joining them with a new tree root
function add(r1, r2) {
    let newRoot = {};

    newRoot.parent = null;
    newRoot.value = null;
    r1.parent = newRoot;
    r2.parent = newRoot;

    newRoot.left = r1;
    newRoot.right = r2;
    
    return newRoot; 
}

// Reduce in place a snail expression given the root of the tree
function reduceSnailExplode(node, level) {
    if (node === null) { return false; }
    if (level === undefined) { level = 0; }

    if (d) { console.log(`reduceSnail called. Level: ${level}`); }

    // If level 4 and we have a pair
    // This pair should explode
    if (level === 4 && node.value === null) {

        if (d) { console.log(`Pair found: ${printNode(node)}`); }
        let leftTarget = findTarget(node, true);
        let rightTarget = findTarget(node, false);

        if (d) { console.log(`leftTarget: ${printNode(leftTarget)}`); }
        if (d) { console.log(`rightTarget: ${printNode(rightTarget)}`); }

        let leftNumber = node.left.value;
        let rightNumber = node.right.value;

        // Add numbers
        if (leftTarget !== null) {
            leftTarget.value += leftNumber; 
        }
        if (rightTarget !== null) {
            rightTarget.value += rightNumber;
        }

        // Change this node into a zero
        node.value = 0;
        node.left = null;
        node.right = null;

        return true;
    }

    if (reduceSnailExplode(node.left, level + 1)) {
        return true;
    }

    if (reduceSnailExplode(node.right, level + 1)) {
        return true;
    }

    // No reduce action occured 
    return false;
}

function reduceSnailSplit(node, level) {
    if (node === null) { return false; }
    if (level === undefined) { level = 0; }

    if (d) { console.log(`reduceSnailSplit called. Level: ${level}`); }

    if (node.value >= 10) {
        // Transform this node into one that has left and right children
        let half = node.value / 2.0;
        let leftValue = Math.floor(half); 
        let rightValue = Math.ceil(half);
        node.left = {
            id: getUid(),
            parent: node,
            value: leftValue,
            left: null,
            right: null
        };
        node.right = {
            id: getUid(),
            parent: node,
            value: rightValue,
            left: null,
            right: null
        };
        node.value = null;
        return true;
    }

    if (reduceSnailSplit(node.left, level + 1)) {
        return true;
    }

    if (reduceSnailSplit(node.right, level + 1)) {
        return true;
    }

    // No reduce action occured 
    return false;
}

function findTarget(node, findNextLeft) {
    let originalNode = node;
    let previousNodeId = originalNode.id;
    if (findNextLeft) {
        // Climb parent chain until you can go left
        while (true) {
            node = node.parent;

            if (node === null) {
                break;
            }

            if (node.left !== null && node.left.id !== previousNodeId) {
                node = node.left;
                break;
            }
            previousNodeId = node.id;
        }

        if (node !== null) {
            while (node.right !== null) {
                node = node.right;
            }
        }

        if (node !== null) {
            return node;
        }

        return null;

    } else { // find next right
        previousNodeId = originalNode.id;
        // Climb parent chain until you can go right
        while (true) {
            node = node.parent;

            if (node === null) {
                break;
            }

            if (node.right !== null && node.right.id !== previousNodeId) {
                node = node.right;
                break;
            }
            previousNodeId = node.id;
        }

        if (node !== null) {
            while (node.left !== null) {
                node = node.left;
            }
        }

        if (node !== null) {
            return node;
        }

        return null;
    }
}

// Evalucate snail expression with root
function evaluate(node) {
    if (node.value === null) {
        return 3 * evaluate(node.left) + 2 * evaluate(node.right);
    } else {
        return node.value;
    }
}

function makeTree(pairOrNumber, parent) {
    if (parent === undefined) { parent = null; }
    let node = {};
    node.parent = parent;
    node.id = getUid();

    if (typeof(pairOrNumber) === 'number') {
        node.value = pairOrNumber;
        node.left = null;
        node.right = null;
    } else {
        node.value = null;
        node.left = makeTree(pairOrNumber[0], node);
        node.right = makeTree(pairOrNumber[1], node);
    }
    return node;
}

function printNode(node) {
    if (node === null) {
        return "node(NULL)";
    }
    return `node: id: ${node.id}, value: ${node.value}, left: ${printNumber(node.left)}, right: ${printNumber(node.right)}`;
}
function printNumber(node) {
    if (node === null) {
        return 'node(NULL)';
    } else if (node.value === null) {
        return 'PAIR';
    } else {
        return `node(value: ${node.value})`;
    }
}