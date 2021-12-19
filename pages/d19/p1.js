import React from 'react';
import styles from './P1.module.css';
import data from './input.txt';
import * as utils from '../../utils/utils.js';

const p = (v) => console.log(v);

export default function P1() {
    let [ans, setAns] = React.useState(`P1`);
    React.useEffect(function solution() {
        console.clear();
        
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
        for (let sensorId = 0; sensorId < sensors.length; sensorId++) {
            let beaconClouds = [];
            for (let beaconId = 0; beaconId < sensors[sensorId].length; beaconId++) {
                let beaconCloud = {};
                for (let otherBeaconId = 0; otherBeaconId < sensors[sensorId].length; otherBeaconId++) {
                    if (beaconId !== otherBeaconId) {
                        let b1 = sensors[sensorId][beaconId];
                        let b2 = sensors[sensorId][otherBeaconId];
                        
                        let mag = getMagnitued(b1, b2);

                        beaconCloud[mag] = true;
                    }
                }
                beaconClouds.push(beaconCloud);
            }
            clouds.push(beaconClouds);
        }

        // matches is a list of sensors
        // each sensor has a list of beacons
        // each beacon is a map {key -> value} -> {sensorId -> list of matches with other beacons} 
        let matches = [];
        for (let s1 = 0; s1 < sensors.length; s1++) {
            for (let s2 = s1 + 1; s2 < sensors.length; s2++) {
                let sensorMatch = compareSensorBeacons(clouds[s1], clouds[s2]);

                if (sensorMatch) {
                    p(`match: ${s1} and ${s2}`);
                }

            }
        }


    });

    return (
        <div className={styles.P1}>{ans}</div>
    );
}

function getMagnitued(b1, b2) {
    return Math.abs(b1.x - b2.x) + Math.abs(b1.y - b2.y) + Math.abs(b1.z - b2.z);
}

// Returns count of number of beacons that match 12 or more magnitudes from the other beacon cloud
function compareSensorBeacons(s1Beacons, s2Beacons) {
    let totalCount = 0;
    for (let b1 = 0; b1 < s1Beacons.length; b1++) {
        for (let b2 = b1 + 1; b2 < s2Beacons.length; b2++) {
            let count = compareBeacons(s1Beacons[b1], s2Beacons[b2]);
            if (count >= 12) {
                totalCount += 1;
            }
        }
    }
    return totalCount;
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