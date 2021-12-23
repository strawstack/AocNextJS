
let lookup = {};
for (let i = 0; i < 10; i++) {
    lookup[i] = true;
}

let total = 0;
for (let k in lookup) {
    total = (total + k) % 1000000;
}

console.log(total);