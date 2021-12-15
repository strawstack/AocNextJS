import React from 'react';
import styles from './P1.module.css';
import data from './input.txt';
//import data from './testinput.txt';
import * as utils from '../../utils/utils.js';
import { PureComponent } from 'react/cjs/react.production.min';

const p = (v) => console.log(v);

export default function P1() {
    let [ans, setAns] = React.useState(`P1`);
    React.useEffect(function solution() {
        console.clear();
        
        let grid = data.trim().split("\n").map(x => x.split("").map(y => parseInt(y)));
        let H = grid.length;
        let W = grid[0].length;

        let startPos = {r: 0, c: 0};
        let endPos = {r: H - 1, c: W - 1};
        let parentMatrix = dijkstra(grid, H, W, startPos, endPos);
        
        let value = extractPathValue(parentMatrix, grid, H, W);
        p(value)
    });

    return (
        <div className={styles.P1}>{ans}</div>
    );
}

function dijkstra(grid, H, W, startPos, endPos) {
    
    let vCost = {};

    // Elements of form {from: point, to: point} 
    // where cost is values of the 'to' point 
    let q = [
            {
                from: {...startPos},
                to: {r: 1, c: 0}
            },
            {
                from: {...startPos},
                to: {r: 0, c: 1}
            }
    ];

    vCost[hash(q[0].to)] = grid[q[0].to.r][q[0].to.c];
    vCost[hash(q[1].to)] = grid[q[1].to.r][q[1].to.c];

    let visited = {};
    visited[hash(startPos)] = true;
    let adj = [{r: 1, c: 0},{r: -1, c: 0},{r: 0, c: 1},{r: 0, c: -1}];
    let parent = makeGridOfSize(H, W, null);

    parent[q[0].to.r][q[0].to.c] = q[0].from;
    parent[q[1].to.r][q[1].to.c] = q[1].from;

    // Add starting edges
 
    while (q.length > 0) {

        // Take lowest cost edge from explored region
        q.sort((a, b) => vCost[hash(b.to)] - vCost[hash(a.to)]);
        let nextEdge = q.pop();

        // If dest vert is already visited then ignore
        let vertHash = hash(nextEdge.to);
        if (vertHash in visited) {
            continue;
        }
        visited[vertHash] = true;

        if (equals(nextEdge.to, endPos)) {
            break;
        }

        // Add adj edges to queue
        for (let d of adj) {
            let newPos = {r: nextEdge.to.r + d.r, c: nextEdge.to.c + d.c};
            if (inBounds(newPos, H, W)) {
                let newHash = hash(newPos);
                if (!(newHash in visited)) {
                    q.push({
                        from: {...nextEdge.to},
                        to: {...newPos}
                    });

                    let newCost = vCost[vertHash] + grid[newPos.r][newPos.c];
                    let curentCost = (newHash in vCost) ? vCost[newHash] : Infinity;

                    if (newCost < curentCost) {
                        vCost[newHash] = newCost;
                        parent[newPos.r][newPos.c] = nextEdge.to; // Update parent
                    }
                }
            }
        }
    }
    return parent;
}

function inBounds(p, H, W) {
    return p.r >= 0 && p.r < H && p.c >= 0 && p.c < W;
}

function extractPathValue(parentMatrix, grid, H, W) {
    let p = {r: H - 1, c: W - 1};
    let total = 0;
    while (parentMatrix[p.r][p.c] !== null) {
        total += grid[p.r][p.c];
        p = parentMatrix[p.r][p.c];
    }
    return total;
}

function equals(e1, e2) {
    return e1.r === e2.r && e1.c === e2.c;
}

function makeGridOfSize(rows, cols, fillValue) {
    let rtn = [];
    let tempRow = [];
    for (let c = 0; c < cols; c++) {
        tempRow.push(fillValue);
    }
    for (let r = 0; r < rows; r++) {
        rtn.push([...tempRow]);
    }
    return rtn;
}

function hash(point) {
    return `${point.r}:${point.c}`;
}