import React from 'react';
import styles from './P2.module.css';
import data from './input.txt';
import * as utils from '../../utils/utils.js';

const p = (v) => console.log(v);

let totalPathCount = 0;

// For each unvisited node adj to node
// Call bfs on that node
// If end is reached end 
function dfs(edgeList, visited, smallTwice, node) {

    // If we revisit the start node then stop
    if (Object.keys(visited).length && node === "start") {
        return;
    }

    // If we reach the end stop
    if (node === "end") {
        totalPathCount += 1;
        return;
    }

    // If we have visited a small cave twice and this is a visited small cave then end
    let newSmallTwice = smallTwice;
    if (newSmallTwice && node in visited && node.toLowerCase() === node) {
        return;
    }

    // Count the number of times we visit different caves
    if (!(node in visited)) {
        visited[node] = 0;
    }
    visited[node] += 1;

    // If this is a small cave that is now visited twice, track this event by setting newSmallTwice to true 
    if (node in visited && node.toLowerCase() === node && visited[node] === 2) {
        newSmallTwice = true;
    }

    // Attempt to visit all the neighbours of this node
    for (let adjNode of edgeList[node]) {
        let copyVisited = copy(visited);
        dfs(edgeList, copyVisited, newSmallTwice, adjNode);
    }

    return;
}

function copy(obj) {
    return JSON.parse(JSON.stringify(obj));
}

export default function P2() {
    let [ans, setAns] = React.useState(`P2`);
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
        let smallTwice = false;
        let startNode = "start";
        dfs(edgeList, visited, smallTwice, startNode);

        p(totalPathCount);
    });

    return (
        <div className={styles.P2}>{ans}</div>
    );
}