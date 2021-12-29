import React from 'react';
import styles from './P2.module.css';
import data from './input.txt';
//import data from './input_test.txt';
import * as utils from '../../utils/utils.js';

const p = (v) => console.log(v);

const low = 0;
const hi = 1;

let uid = 0;
let getUid = () => {
    let nuid = uid;
    uid += 1;
    return nuid;
};

export default function P2() {
    let [ans, setAns] = React.useState(`P2`);
    React.useEffect(function solution() {
        console.clear();

        // Steps is a list of cubes
            // A cube is:
            // {cmd: true/false, cube: {x: [low, hi], y: [low, hi], z: [low, hi]}}
        let steps = data.trim().split("\n").map(x => x.split(" "));
        steps = steps.map(x => {
            let [cmd, other] = x;
            other = other.split(",").map(y => y.split("=")[1]);
            other = other.map(z => z.split("..").map(k => parseInt(k)));

            return {
                cmd: (cmd === 'on') ? true : false,
                id: getUid(),
                cube: {
                    x: other[0],
                    y: other[1],
                    z: other[2]
                }
            };
        });

        let cubeSet = [];

        let onSet = [];
        let offSet = [];

        // Add each cube to the tree
        for (let action of steps) {

            if (action.cmd) {
                //addCubeToSet(action.cube, cubeSet);
                onSet.push(makeRegion(action.cube));

            } else {
                //removeCubeFromSet(action.cube, cubeSet);
                offSet.push(makeRegion(action.cube));

            }
        }

        p(`{${onSet.join(",").replace(/\s+/g, "")}}`);
        p(`{${offSet.join(",").replace(/\s+/g, "")}}`);

        /*
        let total = 0;
        for (let cube of cubeSet) {
            total += volume(cube);
        }
        p(total); */

    });

    return (
        <div className={styles.P2}>{ans}</div>
    );
}

function makeRegion(cube) {
    let add = 1;
    return `Region[Cuboid[
        {${cube.x[low]},${cube.y[low]},${cube.z[low]}},
        {${cube.x[hi] + add},${cube.y[hi] + add},${cube.z[hi] + add}}
    ]]`;
}

function addCubeToSet(cube, cubeSet) {
    // If cube fully overlaps remove from set

    // If cube does not overlap continue

    // If cube C partially overlaps
        // Split C based on intersection
        // Remove fully overlapping piece of C
        // For each piece of C
            // addCubeToSet("piece of C", cubeSet)

        // Split P according to intersection
        // Throw out fully overlapping P sub-cubes
        // Re-add non-overlapping P sub-cubes
        // Split C based on intersection
        // Throw out fully overlapping C sub-cubes
        // Add non-overlapping C sub-cubes

}

function removeCubeFromSet(cube, cubeSet) {
    // If cube fully overlaps remove cube from set

    // If cube does not overlap continue

    // If cube partially overlaps
        // Pop cube P from set
        // Split P according to intersection
        //
}


// end
