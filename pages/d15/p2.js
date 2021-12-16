import React from 'react';
import styles from './P2.module.css';
import data from './input.txt';
//import data from './testinput.txt';
import * as utils from '../../utils/utils.js';

let heap = require('./heap.js');

const p = (v) => console.log(v);

export default function P2() {
    let [ans, setAns] = React.useState(`P2`);
    React.useEffect(function solution() {
        console.clear();
        
        let grid = data.trim().split("\n").map(x => x.split("").map(y => parseInt(y)));
        let OH = grid.length;
        let OW = grid[0].length;
        let H = OH * 5;
        let W = OW * 5;

        let startPos = {r: 0, c: 0};
        let endPos = {r: H - 1, c: W - 1};
        let answer = dijkstra(grid, OH, OW, startPos, endPos);
        p(answer);
    });

    return (
        <div className={styles.P2}>{ans}</div>
    );
}

function getGridValue(grid, OH, OW, pos) {
    let row_tile = Math.floor(pos.r / OH);
    let col_tile = Math.floor(pos.c / OW);
    let gridValue = grid[pos.r % OH][pos.c % OW];
    let offset = row_tile + col_tile;
    let actualValue = gridValue + offset;
    if (actualValue >= 10) {
        actualValue -= 9;
    }
    return actualValue;
}

function dijkstra(grid, OH, OW, startPos, endPos) {
    
    let vCost = {};

    let compareFunction = (a, b) => {
        if (a === Infinity) {
            return false;
        }
        if (b === Infinity) {
            return false;
        }
        return vCost[hash(a.to)] < vCost[hash(b.to)];
    };

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

    heap.heapify(q, compareFunction);

    vCost[hash(q[0].to)] = getGridValue(grid, OH, OW, q[0].to);
    vCost[hash(q[1].to)] = getGridValue(grid, OH, OW, q[1].to);

    let visited = {};
    visited[hash(startPos)] = true;
    let adj = [{r: 1, c: 0},{r: -1, c: 0},{r: 0, c: 1},{r: 0, c: -1}];

    // Add starting edges
 
    while (q.length > 0) {

        // Take lowest cost edge from explored region
        //q.sort((a, b) => vCost[hash(b.to)] - vCost[hash(a.to)]);
        let nextEdge = heap.heappop(q, compareFunction);

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
            if (inBounds(newPos, OH, OW)) {
                let newHash = hash(newPos);
                if (!(newHash in visited)) {
                    heap.heappush(q, {
                        from: {...nextEdge.to},
                        to: {...newPos}
                    }, compareFunction);
                    vCost[newHash] = Math.min(
                        vCost[vertHash] + getGridValue(grid, OH, OW, newPos),
                        (newHash in vCost) ? vCost[newHash] : Infinity
                    );
                }
            }
        }
    }
    return vCost[hash(endPos)];
}

function inBounds(p, H, W) {
    return p.r >= 0 && p.r < H * 5 && p.c >= 0 && p.c < W * 5;
}

function equals(e1, e2) {
    return e1.r === e2.r && e1.c === e2.c;
}

function hash(point) {
    return `${point.r}:${point.c}`;
}