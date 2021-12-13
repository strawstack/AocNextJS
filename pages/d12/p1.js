import React from 'react';
import styles from './P1.module.css';
import data from './input.txt';
//import data from './test_small_input.txt';   // ans: 10
//import data from './test_large_input.txt';   // ans: 19
//import data from './test_largest_input.txt'; // ans: 226

import * as utils from '../../utils/utils.js';

const p = (v) => console.log(v);

let totalPathCount = 0;

// For each unvisited node adj to node
// Call bfs on that node
// If end is reached, count the path and continue building 
function dfs(edgeList, visited, node) {

    if (node in visited && node.toLowerCase() === node) {
        return;
    }
    visited[node] = true;

    if (node === "end") {
        totalPathCount += 1;
    }

    for (let adjNode of edgeList[node]) {
        let copyVisited = copy(visited);
        dfs(edgeList, copyVisited, adjNode);
    }

    return;
}

function copy(obj) {
    return JSON.parse(JSON.stringify(obj));
}

export default function P1() {
    let [ans, setAns] = React.useState(`P1`);
    React.useEffect(function solution() {
        console.clear();
        
        let lst = data.trim().split("\n").map(x => x.split("-"));

        let edgeList = {};
        for (let [a, b] of lst) {

            if (!(a in edgeList)) {
                edgeList[a] = [];
            }
            if (!(b in edgeList)) {
                edgeList[b] = [];
            }

            edgeList[a].push(b);
            edgeList[b].push(a);
        }

        let visited = {};
        let startNode = "start";
        dfs(edgeList, visited, startNode);

        p(totalPathCount);
    });

    return (
        <div className={styles.P1}>{ans}</div>
    );
}