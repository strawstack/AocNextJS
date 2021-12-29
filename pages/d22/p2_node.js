let fs = require('fs');
const p = (v) => console.log(v);
const d = false;
const inputFileName = './input.txt';

const low = 0;
const hi = 1;

function P2(data) {
    // Steps is a list of cubes
        // A cube is:
        // {cmd: true/false, x: [low, hi], y: [low, hi], z: [low, hi]}
    let steps = data.trim().split("\n").map(x => x.split(" "));
    steps = steps.map(x => {
        let [cmd, other] = x;
        other = other.split(",").map(y => y.split("=")[1]);
        other = other.map(z => z.split("..").map(k => parseInt(k)));

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
    let onList  = [];
    let offList = [];
    for (let action of steps) {
        //addCube(root, action);
        if (action.cmd) {
            onList.push(cubeRegion(action.cube));
        } else {
            offList.push(cubeRegion(action.cube));
        }
    }

    let onRegion = `RegionUnion[${onList.join(',')}]`;
    let offRegion = `RegionUnion[${offList.join(',')}]`;
    let diff = `RegionDifference[${onRegion}, ${offRegion}]`;
    let volume = `Volume[${diff}]`;

    // Paste string in Wolfran Cloud
    //p(onRegion);
    p(offRegion);

    // answer from Wolfram Cloud

};

// Main
let data = fs.readFileSync(inputFileName).toString('utf-8');
P2(data);

function cubeRegion(c) {
    return `Region[
        Cuboid[
            {${c.x[low]},${c.y[low]},${c.z[low]}},
            {${c.x[hi] + 1},${c.y[hi] + 1},${c.z[hi] + 1}}
        ]
    ]`;
}


// end
