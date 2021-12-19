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

export default function P2() {
    let [ans, setAns] = React.useState(`P2`);
    React.useEffect(function solution() {
        console.clear();
        
        // List of sensors
        // each sensor has list of many beacon coords
        let sensors = data.trim().split("\n\n").map(a => {
            let cooordsList = a.split("\n").slice(1);
            return cooordsList.map(b => {
                let [x, y, z] = b.split(",").map(c => parseInt(c));
                return {x, y, z};
            });
        });
        
        // clouds is a list of sensors
        // each sensor has a list of beacons
        // each beacon has a cloud (set of magnitues to other beacons)
        let clouds = [];
        // relativePositions is a list of sensors
        // each sensor has a list of beacons
        // each beacon has a list of relative vectors to other beacons
        let relativeVectors = [];
        for (let sensorId = 0; sensorId < sensors.length; sensorId++) {
            let beaconClouds = [];
            let vectors = {};
            for (let beaconId = 0; beaconId < sensors[sensorId].length; beaconId++) {
                let beaconCloud = {};
                vectors[beaconId] = {};
                for (let otherBeaconId = 0; otherBeaconId < sensors[sensorId].length; otherBeaconId++) {
                    if (beaconId !== otherBeaconId) {
                        let b1 = sensors[sensorId][beaconId];
                        let b2 = sensors[sensorId][otherBeaconId];
                        
                        let mag = getMagnitued(b1, b2);
                        let vec = getRelativeVec(b1, b2);

                        beaconCloud[mag] = true;
                        vectors[beaconId][otherBeaconId] = vec;
                    }
                }
                beaconClouds.push(beaconCloud);
            }
            clouds.push(beaconClouds);
            relativeVectors.push(vectors);
        }

        // matches is a list of sensors
        // each sensor has a list of beacons
        // each beacon is a map {key -> value} -> {sensorId -> list of matches with other beacons} 
        let matches = {};
        for (let s1 = 0; s1 < sensors.length; s1++) {
            matches[s1] = {};
            for (let s2 = 0; s2 < sensors.length; s2++) {

                if (s1 === s2) { continue; }

                if (d) { console.log(`s1: ${s1}, s2: ${s2}`); }
                let [sensorMatch, details] = compareSensorBeacons(clouds[s1], clouds[s2]);
                if (sensorMatch) {
                    matches[s1][s2] = details;
                }
            }
        }

        let groups = unionFind(matches);
        //p(groups)
        // Shortest path from 0 to other sensors
        // map from 0 -> otherSensorId -> list path to other coord system
        let paths = findPaths(matches);
        
        // sensor one -> sensor two -> magnitude between them 
        let travelCost = {};

        // map sensor to sensor 
        // providing rotation and translation info
        let beaconTraslation = {};
        for (let k1 in matches) {
            beaconTraslation[k1] = {};
            travelCost[k1] = {};
            for (let k2 in matches[k1]) {
                let matchingPairs = matches[k1][k2];
                let [a1, a2] = matchingPairs[0];
                let [b1, b2] = matchingPairs[1];

                let v1 = relativeVectors[k1][a1][b1];
                let v2 = relativeVectors[k2][a2][b2];

                let rotationData = getRotationData(v2, v1);

                let p1 = sensors[k1][a1];
                let p2 = sensors[k2][a2];

                let translationData = getTranslationData(transform(p2, rotationData.order, rotationData.flip), p1);

                let cost = getMagnituedOne(addVector(p1, inverseVector(translationData)));
                travelCost[k1][k2] = cost;

                if (!(k2 in travelCost)) {
                    travelCost[k2] = {};
                }
                travelCost[k2][k1] = cost;

                beaconTraslation[k1][k2] = { rotationData, translationData };
            }
        }

        // other sensor id -> single rotation and translation that converts other to one
        let translationToZero = {};
        for (let s = 1; s < sensors.length; s++) {
            let sensorPath = paths[0][s];

            let totalOrder = [0, 1, 2];
            let totalFlip = [1, 1, 1];
            let totalTranslation = {x: 0, y: 0, z: 0};

            for (let p = sensorPath.length - 2; p >= 0; p--) {
                let from = sensorPath[p + 1];
                let to = sensorPath[p];

                let {rotationData, translationData} = beaconTraslation[to][from];
                let {order, flip} = rotationData;

                totalOrder = addOrder(totalOrder, order);
                totalFlip = addFlip(totalFlip, flip);
                totalTranslation = addTranslation(totalTranslation, translationData);
            }
            translationToZero[s] = {
                order: totalOrder,
                flip: totalFlip,
                translation: totalTranslation
            };
        }

        // set of hash of beacon positions
        let allBeaconsPoints = {};

        // For all sensors
        for (let s = 0; s < sensors.length; s++) {
            
            // For all beacons
            for (let b = 0; b < sensors[s].length; b++) {

                if (s === 0) {
                    allBeaconsPoints[hash(sensors[s][b])] = true;
                } else {
                    let op = sensors[s][b];
                    let tp = applySeriesOfTransforms(beaconTraslation, paths[0][s], op);
                    allBeaconsPoints[hash(tp)] = true;
                }
            }
        }

        let mostFar = -1;
        for (let s1 = 0; s1 < sensors.length; s1++) {
            for (let s2 = 0; s2 < sensors.length; s2++) {
                if (s1 === s2) { continue; }
                let cost = bfs(travelCost, s1, s2);
                mostFar = Math.max(mostFar, cost);
            }
        }

        // 18675 to high
        // 18073 to high
        p(mostFar)
        
    });

    return (
        <div className={styles.P2}>{ans}</div>
    );
}

function bfs(edges, start, end, visited, totalCost) {
    if (visited === undefined) { visited = {}; }
    if (totalCost === undefined) { totalCost = 0; }

    if (start == end) { 
        return totalCost;
    }

    visited[start] = true;

    let bestCost = Infinity;
    for (let otherEdge in edges[start]) {
        if (otherEdge in visited) { continue; }
        let cost = edges[start][otherEdge];
        let cvisited = {...visited};
        let value = bfs(edges, otherEdge, end, cvisited, totalCost + cost);
        bestCost = Math.min(bestCost, value);
    }
    return bestCost;
}

function addVector(v1, v2) {
    return {
        x: v1.x + v2.x, 
        y: v1.y + v2.y, 
        z: v1.z + v2.z
    };
}

function inverseVector(v1) {
    return {
        x: -1 * v1.x,
        y: -1 * v1.y,
        z: -1 * v1.z
    };
}

function unhash(p) {
    return p.split(":").map(x => parseInt(x));
}

// Transform op using all transforms along path
function applySeriesOfTransforms(beaconTraslation, path, op) {
    let currentPoint = {...op};

    for (let p = path.length - 2; p >= 0; p--) {
        let from = path[p + 1];
        let to = path[p];

        let {rotationData, translationData} = beaconTraslation[to][from];
        let {order, flip} = rotationData;

        let tf = {
            order: order,
            flip: flip,
            translation: translationData
        };

        currentPoint = applyTransform(tf, {...currentPoint});
    }
    return currentPoint;
}

function applyTransform({order, flip, translation}, op) {
    let rotPoint = transform(op, order, flip);
    let translatedPoint = translate(rotPoint, translation);
    return translatedPoint;
}

function hash(pos) {
    return `${pos.x}:${pos.y}:${pos.z}`;
}

function addOrder(o1, o2) {
    let orig = [...o1];
    let newOrder = [-1, -1, -1];
    for (let i = 0; i < o2.length; i++) {
        newOrder[o2[i]] = orig[i];
    }
    return newOrder;
}

function addFlip(f1, f2) {
    return [f1[0] * f2[0], f1[1] * f2[1], f1[2] * f2[2]];
} 

function addTranslation(t1, t2) {
    return {
        x: t1.x + t2.x,
        y: t1.y + t2.y,
        z: t1.z + t2.z
    };
}

function getTranslationData(v2, v1) {
    return {
        x: v1.x - v2.x,
        y: v1.y - v2.y,
        z: v1.z - v2.z
    };
}

function getMagnitued(b1, b2) {
    return Math.abs(b1.x - b2.x) + Math.abs(b1.y - b2.y) + Math.abs(b1.z - b2.z);
}

function getMagnituedOne(b1) {
    return Math.abs(b1.x) + Math.abs(b1.y) + Math.abs(b1.z);
}

function getRelativeVec(b1, b2) {
    return {
        x: b2.x - b1.x, 
        y: b2.y - b1.y,
        z: b2.z - b1.z
    };
}

// Returns count of number of beacons that match 12 or more magnitudes from the other beacon cloud
function compareSensorBeacons(s1Beacons, s2Beacons) {
    let totalCount = 0;
    let details = [];
    for (let b1 = 0; b1 < s1Beacons.length; b1++) {
        for (let b2 = 0; b2 < s2Beacons.length; b2++) {
            if (d) { console.log(`    b1: ${b1}, b2: ${b2}`); }
            let count = compareBeacons(s1Beacons[b1], s2Beacons[b2]);
            if (count >= 11) {
                totalCount += 1;
                details.push([b1, b2]);
            }
        }
    }
    return [totalCount >= 11, details];
} 

function compareBeacons(b1Cloud, b2Cloud) {
    let count = 0;
    for (let k in b1Cloud) {
        if (k in b2Cloud) {
            count += 1;
        }
    }
    return count;
}

function getRotationData(v2, v1) {
    let orderings = [
        [0, 1, 2],
        [0, 2, 1],
        [1, 0, 2],
        [1, 2, 0],
        [2, 0, 1],
        [2, 1, 0]
    ];
    let flips = [
        [1, 1, 1],
        [1, 1, -1],
        [1, -1, 1],
        [1, -1, -1],
        [-1, 1, 1],
        [-1, 1, -1],
        [-1, -1, 1],
        [-1, -1, -1]
    ];
    for (let order of orderings) {
        for (let flip of flips) {
            let tv2 = transform(v2, order, flip);
            if (match(tv2, v1)) {
                return {order, flip};
            }
        }
    }
}

function transform(v2, order, flip) {
    let lv2 = [v2.x, v2.y, v2.z];
    return {
        x: lv2[order[0]] * flip[0],
        y: lv2[order[1]] * flip[1],
        z: lv2[order[2]] * flip[2]
    };
}

function translate(p, translation) {
    return {
        x: p.x + translation.x,
        y: p.y + translation.y,
        z: p.z + translation.z
    };
}

function match(v2, v1) {
    return v2.x === v1.x && v2.y === v1.y && v2.z === v1.z;
}

function unionFind(matches) {
    let pointers = [];
    let answer = [];
    for (let i = 0; i < 28; i++) {
        pointers.push(i);
        answer.push(0);
    }
    for (let k1 in matches) {
        for (let k2 in matches[k1]) {
            let a = k1;
            let b = k2;
            pointers[findGroup(pointers, a)] = findGroup(pointers, b);
        }
    }
    for (let i = 0; i < 28; i++) {
        answer[i] = findGroup(pointers, i);
    }
    return answer;
}

function findGroup(pointers, index) {
    while (pointers[index] !== index) {
        index = pointers[index];
    }
    return index;
}

function findPaths(matches) {
    let paths = {};
    paths[0] = {};
    let q = [{
        current: 0,
        path: [0]
    }];
    let visited = {};
    visited[0] = true;
    // NOTE "Object.keys(matches).length - 1" is 27 for normal input
    while (Object.keys(paths[0]).length < Object.keys(matches).length - 1) {
        let q2 = [];
        for (let {current, path} of q) {
            for (let k2 in matches[current]) {
                if (!(k2 in visited)) {
                    visited[k2] = true;
                    let cpath = [...path];
                    cpath.push(k2);
                    q2.push({
                        current: k2,
                        path: cpath
                    });
                    paths[0][k2] = cpath.map(x => parseInt(x));
                }
            }
        }
        q = q2;
    }
    return paths;
}