// This is an implementation of a min heap
// that accepts a custom compare function

// For 0 based array
// Children
    // 2 * i + 1 
    // 2 * i + 2
// Parent
    // Math.floor((i - 1) / 2)

let d = false;
// if (d) { console.log(`name: ${0}`); }
// h.map(x => x.toString()).join(", ")

// true if a < b, otherwise false
let defaultCompare = (a, b) => a < b;

function heapify(h, compare) {
    if (compare === undefined) { compare = defaultCompare; }
    if (d) { console.log(`heapify called`); }
    for (let i = h.length - 1; i >= 0; i--) {
        heapdown(h, i, compare);
    }
}

function heappush(h, value, compare) {
    if (compare === undefined) { compare = defaultCompare; }
    h.push(value);
    heapup(h, h.length - 1, compare);
}

function heappeek(h) {
    if (h.length > 0) {
        return h[0];
    }
    return false;
}

function heappop(h, compare) {
    if (compare === undefined) { compare = defaultCompare; }
    let temp = h[0];
    h[0] = h[h.length - 1];
    let value = h.pop();
    heapdown(h, 0, compare);
    return temp;
}

function heapup(h, index, compare) {
    if (compare === undefined) { compare = defaultCompare; }
    while (index > 0) {
        let parent = Math.floor((index - 1) / 2);
        let parentValue = h[parent];
        // Swap the values
        if (compare(h[index], parentValue)) {
            h[parent] = h[index];
            h[index] = parentValue; 
        }
        index = parent;
    }
}

function heapdown(h, index, compare) {
    if (compare === undefined) { compare = defaultCompare; }
    if (d) { console.log(`heapdown called`); }
    while (index * 2 + 1 < h.length) {
        let leftChild = index * 2 + 1;
        let rightChild = index * 2 + 2;
        let leftChildValue = (leftChild < h.length) ? h[leftChild] : Infinity;
        let rightChildValue = (rightChild < h.length) ? h[rightChild] : Infinity;
        if (d) { console.log(`index: ${index}, indexValue: ${h[index]}`); }
        if (d) { console.log(`leftChild: ${leftChild}, rightChild: ${rightChild}`); }
        if (d) { console.log(`leftChildValue: ${leftChildValue}, rightChildValue: ${rightChildValue}`); }
        let swap = false;
        if (compare(leftChildValue, rightChildValue)) {
            if (compare(leftChildValue, h[index])) {
                h[leftChild] = h[index];
                h[index] = leftChildValue;
                if (d) { console.log(`h[leftChild] = h[index]: ${h[leftChild]} = ${h[index]}`); }
                if (d) { console.log(`h[index] = leftChildValue: ${h[index]} = ${leftChildValue}`); }
                index = leftChild;
                swap = true;
            }
        } else { // leftChildValue >= rightChildValue
            if (compare(rightChildValue, h[index])) {
                h[rightChild] = h[index];
                h[index] = rightChildValue;
                if (d) { console.log(`h[rightChild] = h[index]: ${h[rightChild]} = ${h[index]}`); }
                if (d) { console.log(`h[index] = rightChildValue: ${h[index]} = ${rightChildValue}`); }
                index = rightChild;
                swap = true;
            }
        }
        if (d) { console.log(`swap: ${swap}`); }
        if (!swap) {
            if (d) { console.log(`loop break`); }
            break;
        }
    }
    if (d) { console.log(`heapdown ends`); }

}

function equal(a, b) {
    if (a.length !== b.length) {
        return false;
    }
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
            return false;
        }
    }
    return true;
}

function main() {
    let h = [1,2,3,4,5,6,7,8,9,10,12,13,14,15,16,17,18,19,20]; // missing 11
    let final = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]; // missing 11
    for (let i = 0; i < 10; i++) {
        console.log(`** Test ${i + 1}**`);
        let ch = [...h];
        shuffleArray(ch);

        console.log(`  ch: ${ch.map(x => x.toString()).join(", ")}`);

        heapify(ch);

        let value = heappeek(ch);
        console.log(`  heappeek: ${value}`);

        heappush(ch, 11);

        let ans = [];
        while (ch.length > 0) {
            let value = heappop(ch);
            ans.push(value);
        }

        console.log(`  ans: ${ans.map(x => x.toString()).join(", ")}`);

        console.log(`  Result: ${equal(ans, final) ? "success" : "fail"}`)

        console.log("\n");
    }
}

//main()

/* Randomize array in-place using Durstenfeld shuffle algorithm */
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

module.exports = {
    heapify: heapify,
    heappush: heappush,
    heappop: heappop,
    heappeek: heappeek
};