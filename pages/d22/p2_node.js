let fs = require('fs');
const p = (v) => console.log(v);
const d = false;
const inputFileName = './input.txt';
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

function P2(data) {
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
    let count = 0;
    for (let action of steps) {

        if (d) { console.log(`count: ${count}`) };
        count += 1;
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
};

// Main
let data = fs.readFileSync(inputFileName).toString('utf-8');
P2(data);

// Add cube to tree
    // If 'on' (true), create new nodes via spliting
    // If 'off' (false), remove any nodes where there is full overlap
function addCube(node, action) {

    if (d) { console.log(`** addCube called`); }

    if (d) { console.log(`node:`); }
    if (d) { console.log(node.cube); }

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

    // If not fully contained and volume is one then stop
    if (getVolume(node.cube) === 1) {
        if (d) { console.log(`size one`); }
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
    let xmi = xlo + Math.floor((xhi - xlo) / 2);
    let xs = [];
    if (xlo === xhi) {
        xs.push([xlo, xhi]);
    } else {
        xs.push([xlo, xmi]);
        xs.push([xmi + 1, xhi]);
    }

    let ylo = cube.y[low];
    let yhi = cube.y[hi];
    let ymi = ylo + Math.floor((yhi - ylo) / 2);
    let ys = [];
    if (ylo === yhi) {
        ys.push([ylo, yhi]);
    } else {
        ys.push([ylo, ymi]);
        ys.push([ymi + 1, yhi]);
    }

    let zlo = cube.z[low];
    let zhi = cube.z[hi];
    let zmi = zlo + Math.floor((zhi - zlo) / 2);
    let zs = [];
    if (zlo === zhi) {
        zs.push([zlo, zhi]);
    } else {
        zs.push([zlo, zmi]);
        zs.push([zmi + 1, zhi]);
    }

    let lst = [];
    for (let xx of xs) {
        for (let yy of ys) {
            for (let zz of zs) {
                lst.push({
                    x: [...xx],
                    y: [...yy],
                    z: [...zz]
                });
            }
        }
    }

    return lst;
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

function calculateTree(node) {
    // Recursive walk to leaves, leaves
    // report number of cubes in their cube/region if state is 'on'
    if (node.children === null) {
        if (node.state === true) {
            let volume = getVolume(node.cube);
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

// Return volume of cube
function getVolume(a) {
    let xSide = a.x[hi] - a.x[low] + 1;
    let ySide = a.y[hi] - a.y[low] + 1;
    let zSide = a.z[hi] - a.z[low] + 1;
    let volume = (xSide * ySide) * zSide;
    return volume;
}








// end
