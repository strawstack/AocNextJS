import React from 'react';
import styles from './P1.module.css';
import data from './input.txt';
//import data from './input2.txt';
import * as utils from '../../utils/utils.js';

const p = (v) => console.log(v);

const d = false;
/*
if (d) { console.log(`name: ${value}`); }
*/

export default function P1() {
    let [ans, setAns] = React.useState(`P1`);
    React.useEffect(function solution() {
        console.clear();
        
        // Get binary string
        let bitChunks = data.trim().split("").map(x => pad(parseInt(x, 16).toString(2), 4));
        let bits = [];
        for (let chunk of bitChunks) {
            bits.push(...chunk);
        }
        bits = bits.join("");
        let index = 0;

        let parsePacket = () => {
            if (d) { console.log(`parsePacket called`); }
            let version = getVersion();
            let type = getType();
            if (d) { console.log(`version: ${version}, type: ${type}`); }
            let value = null;
            let children = [];
            if (type === 4) {
                value = getLiteralValue();
                if (d) { console.log(`LiteralValue: ${value}`); }
            } else { // type !== 4, so operator
                let lengthType = getLengthType();
                if (d) { console.log(`lengthType: ${lengthType}`); }
                if (lengthType === 0) {
                    let totalLength = getTotalLength();
                    if (d) { console.log(`totalLength: ${totalLength}`); }
                    while (true) {
                        let startIndex = index;
                        let p = parsePacket();
                        let endIndex = index;
                        let packetLength = endIndex - startIndex;
                        if (d) { console.log(`packetLength: ${packetLength}`); }
                        children.push(p);
                        totalLength -= packetLength;
                        if (totalLength <= 0) {
                            break;
                        }
                    }
                    
                } else { // lengthType === 1
                    let numSubPackets = getNumberOfSubpackets();
                    if (d) { console.log(`numSubPackets: ${numSubPackets}`); }
                    let count = numSubPackets;
                    while (count > 0) {
                        let p = parsePacket();
                        children.push(p);
                        count -= 1;
                    }
                }
            }
            return {
                version: version,
                type: type,
                value: value,
                children: children
            };
        };

        let getVersion = () => {
            return parseInt(getBits(3), 2);
        };

        let getType = () => {
            return parseInt(getBits(3), 2);
        };

        let getNumberOfSubpackets = () => {
            return parseInt(getBits(11), 2);
        };

        let getTotalLength = () => {
            return parseInt(getBits(15), 2);
        };

        let getLengthType = () => { // 1 or 0
            return parseInt(getBits(1), 2);
        };

        let getBits = (n) => {
            let pack = [];
            for (let i = index; i < index + n; i++) {
                pack.push(bits[i]);
            }
            index += n;
            return pack.join("");
        };

        let getLiteralValue = () => {
            let valueData = [];
            let bitCount = 0;
            while (true) {
                let fivePack = getBits(5);
                for (let i = 1; i < fivePack.length; i++) {
                    valueData.push(fivePack[i]);
                }
                bitCount += 5;

                // Last packet reached
                if (fivePack[0] === "0") {
                    break;
                }
            }
            return parseInt(valueData.join(""), 2);
        };

        // Root object representing packet hiearchy and their children
        let packetRoot = parsePacket();
        
        p(sumVersions(packetRoot));

    });

    return (
        <div className={styles.P1}>{ans}</div>
    );
}

function sumVersions(packetRoot) {
    let total = 0;
    total += packetRoot.version;
    if (packetRoot.type !== 4) {
        for (let child of packetRoot.children) {
            total += sumVersions(child);
        }
    }
    return total;
}

function pad(strValue, padLength, char) {
    if (char === undefined) { char = "0"; }
    let diff = padLength - strValue.length;
    let final = [];
    if (diff > 0) {
        for (let i = 0; i < diff; i++) {
            final.push(char);
        }
    }
    for (let letter of strValue) {
        final.push(letter);
    }
    return final.join("");
}

