import React from 'react';
import styles from './P2.module.css';
import data from './input.txt';
//import data from './input_test.txt';
import * as utils from '../../utils/utils.js';

const p = (v) => console.log(v);
const d = false;
/*
if (d) { console.log(`name: ${name}`); }
*/
const low = 0;
const hi = 1;

// If a node has children, then 'state' is null

let root = {
    'cube': { // dimensions (init by reading in input)
        x: [Infinity, -Infinity],
        y: [Infinity, -Infinity],
        z: [Infinity, -Infinity]
    },
    'state': false, // true -> on, false -> off, null -> see children
    'children': null // list of children
};

export default function P2() {
    let [ans, setAns] = React.useState(`P2`);
    React.useEffect(function solution() {
        console.clear();

        // Steps is a list of cubes
            // A cube is:
            // {cmd: true/false, x: [low, hi], y: [low, hi], z: [low, hi]}
        let steps = data.trim().split("\n").map(x => x.split(" "));
        steps = steps.map(x => {
            let [cmd, other] = x;
            other = other.split(",").map(y => y.split("=")[1]);
            other = other.map(z => z.split("..").map(k => parseInt(k)));

            // Update max bounds for root
            root.cube.x[low] = Math.min(
                root.cube.x[low],
                other[0][low]
            );
            root.cube.x[hi]  = Math.max(
                root.cube.x[hi],
                other[0][hi]
            );

            root.cube.y[low] = Math.min(
                root.cube.y[low],
                other[1][low]
            );
            root.cube.y[hi]  = Math.max(
                root.cube.y[hi],
                other[1][hi]
            );

            root.cube.z[low] = Math.min(
                root.cube.z[low],
                other[2][low]
            );
            root.cube.z[hi]  = Math.max(
                root.cube.z[hi],
                other[2][hi]
            );

            return {
                cmd: (cmd === 'on') ? true : false,
                cube: {
                    x: other[0],
                    y: other[1],
                    z: other[2]
                }
            };
        });

        // Add each cube to the tree
        for (let action of steps) {
            addCube(root, action);

            if (d) { console.log(`root:`); }
            if (d) { console.log(root); }
            if (d) { console.log(`count: ${calculateTree(root)}`); }
        }

        //p(root);

        // Iterate over leafs of the tree adding cubes
        // that represent 'on' nodes
        let answer = calculateTree(root);

        // 77940 - too low
        // 124168 - too low
        p(answer);
    });

    return (
        <div className={styles.P2}>{ans}</div>
    );
}

// Add cube to tree
    // If 'on' (true), create new nodes via spliting
    // If 'off' (false), remove any nodes where there is full overlap
function addCube(node, action) {
    if (d) { console.log(`** addCube called`); }

    if (d) { console.log(`node:`); }
    if (d) { console.log(node); }

    if (d) { console.log(`action:`); }
    if (d) { console.log(action); }

    // If node cube is fully contained in action cube
    let fc = fullyContained(node.cube, action.cube);
    if (d) { console.log(`fullyContained: ${fc}`); }
    if (fc) {
        // Change state of this node
        node.state = action.cmd;
        // Remove child nodes if any
        node.children = null;
        return;
    }

    // Action was not fullyContained
    // so create child nodes
    if (d) { console.log(`no children. Generating...`); }
    if (node.children === null) {
        let subAreas = splitCube(node.cube);
        node.children = [];
        for (let area of subAreas) {
            let childNode = {
                'cube': area,
                'state': false,
                'children': null
            };
            node.children.push(childNode);
        }
    }

    if (d) { console.log(`For each child...`); }
    for (let childNode of node.children) {
        if (d) { console.log(`overlap check:`); }
        if (d) { console.log(action.cube); }
        if (d) { console.log(childNode.cube); }
        let overl = overlap(action.cube, childNode.cube);
        if (d) { console.log(`overlap: ${overl}`); }
        if (overl) {
            addCube(childNode, action);
        }
    }
}

// Exact match between cubes
function match(a, b) {
    if (a.x[low] === b.x[low] && a.x[hi] === b.x[hi]) {
        if (a.y[low] === b.y[low] && a.y[hi] === b.y[hi]) {
            if (a.z[low] === b.z[hi] && a.z[low] === b.z[hi]) {
                return true;
            }
        }
    }
    return false;
}

// Check if 'a' is fully contained inside 'b'
// Then we can apply action uniformly to the space
function fullyContained(a, b) {
    // 'b' must start before 'a' and end after for all axis
    let [a_x_start, a_x_end] = a.x;
    let [a_y_start, a_y_end] = a.y;
    let [a_z_start, a_z_end] = a.z;

    let [b_x_start, b_x_end] = b.x;
    let [b_y_start, b_y_end] = b.y;
    let [b_z_start, b_z_end] = b.z;

    if (b_x_start <= a_x_start && b_x_end >= a_x_end) {
        if (b_y_start <= a_y_start && b_y_end >= a_y_end) {
            if (b_z_start <= a_z_start && b_z_end >= a_z_end) {
                return true;
            }
        }
    }

    return false;
}

// Split cube into eight equal sized cubes
function splitCube(cube) {

    let xlo = cube.x[low];
    let xhi = cube.x[hi];
    let xmi = cube.x[low] + Math.floor((xhi - xlo) / 2);

    let ylo = cube.y[low];
    let yhi = cube.y[hi];
    let ymi = cube.y[low] + Math.floor((yhi - ylo) / 2);

    let zlo = cube.z[low];
    let zhi = cube.z[hi];
    let zmi = cube.z[low] + Math.floor((zhi - zlo) / 2);

    let c1 = {x: [xlo, xmi], y: [ylo, ymi], z: [zlo, zmi]};
    let c2 = {x: [xlo, xmi], y: [ylo, ymi], z: [zmi + 1, zhi]};
    let c3 = {x: [xlo, xmi], y: [ymi + 1, yhi], z: [zlo, zmi]};
    let c4 = {x: [xlo, xmi], y: [ymi + 1, yhi], z: [zmi + 1, zhi]};

    let c5 = {x: [xmi + 1, xhi], y: [ylo, ymi], z: [zlo, zmi]};
    let c6 = {x: [xmi + 1, xhi], y: [ylo, ymi], z: [zmi + 1, zhi]};
    let c7 = {x: [xmi + 1, xhi], y: [ymi + 1, yhi], z: [zlo, zmi]};
    let c8 = {x: [xmi + 1, xhi], y: [ymi + 1, yhi], z: [zmi + 1, zhi]};

    return [c1, c2, c3, c4, c5, c6, c7, c8];
}

// Does cube 'a' overlap with cube 'b'
function overlap(a, b) {
    let xOver = intervalOverlap(a.x, b.x);
    let yOver = intervalOverlap(a.y, b.y);
    let zOver = intervalOverlap(a.z, b.z);

    if (xOver && yOver && zOver) {
        return true;
    }
    return false;
}

// Does interval 'a' overlap with interval 'b'
function intervalOverlap(a, b) {
    const isStart = 1;

    let [start_a, end_a] = a;
    let [start_b, end_b] = b;

    let lst = [
        [start_a, true], [end_a, false],
        [start_b, true], [end_b, false]
    ];

    // sort ascending
    // first by coord then by action (true happens first)
    lst.sort((a, b) => {
        if (a[0] === b[0]) {
            let va = (a[1])?1:0;
            let vb = (b[1])?1:0;
            return vb - va;
        }
        return a[0] - b[0];
    });

    let total = 0;
    for (let item of lst) {
        total += (item[isStart]) ? 1 : -1;
        if (total === 2) {
            return true;
        }
    }
    return false;
}

// Return only the portion of 'a' that falls inside 'b'
function intersectCube(a, b) {

    let ca = JSON.parse(JSON.stringify(a));
    let cb = JSON.parse(JSON.stringify(b));

    // Reposition both cubes so their corner is at
    // origin. Return the smaller dimension in all axis
    // reposition new cube so lower left corner matches
    // Original area lower left corner

    // This creates a cubes that is sized appropriatly for the
    // intersection volume and is positioned in the correct location

    // Calculate delta shift of each axis
    let a_dx = -1 * ca.x[low];
    let a_dy = -1 * ca.y[low];
    let a_dz = -1 * ca.z[low];

    let b_dx = -1 * cb.x[low];
    let b_dy = -1 * cb.y[low];
    let b_dz = -1 * cb.z[low];

    // Re-position coords
    ca.x[low] += a_dx;
    ca.x[hi]  += a_dx;
    ca.y[low] += a_dy;
    ca.y[hi]  += a_dy;
    ca.z[low] += a_dz;
    ca.z[hi]  += a_dz;

    cb.x[low] += b_dx;
    cb.x[hi]  += b_dx;
    cb.y[low] += b_dy;
    cb.y[hi]  += b_dy;
    cb.z[low] += b_dz;
    cb.z[hi]  += b_dz;

    let interCube = {
        x: [0, Math.min(ca.x[hi], cb.x[hi])],
        y: [0, Math.min(ca.y[hi], cb.y[hi])],
        z: [0, Math.min(ca.z[hi], cb.z[hi])]
    };

    interCube.x[0] += Math.max(a_dx, b_dx);
    interCube.y[0] += Math.max(a_dy, b_dy);
    interCube.z[0] += Math.max(a_dz, b_dz);

    return interCube;
}

function calculateTree(node) {
    // Recursive walk to leaves, leaves
    // report number of cubes in their cube/region if state is 'on'
    if (node.children === null) {
        if (node.state === true) {
            let xSide = node.cube.x[hi] - node.cube.x[low] + 1;
            let ySide = node.cube.y[hi] - node.cube.y[low] + 1;
            let zSide = node.cube.z[hi] - node.cube.z[low] + 1;
            let volume = (xSide * ySide) * zSide;
            return volume; // volume is number of 'on' cubes
        } else {
            return 0;
        }
    } else {
        let total = 0;
        for (let child of node.children) {
            let ans = calculateTree(child);
            total += ans;
        }
        return total;
    }
}








// end
