import React from 'react';
import styles from './P1.module.css';
import data from './input.txt';
import * as utils from '../../utils/utils.js';

const p = (v) => console.log(v);

function copy(point) {
    return {...point};
}

function equal(p1, p2) {
    return p1.x === p2.x && p1.y === p2.y;
}

function getLinePoints(line) {
    let dx = line.x2 - line.x1;
    let dy = line.y2 - line.y1;
    let norm = {'x': dx === 0 ? 0 : dx / Math.abs(dx), 'y': dy === 0 ? 0 : dy / Math.abs(dy)};
    let currentPoint = {'x': line.x1, 'y': line.y1};
    let endPoint = {'x': line.x2, 'y': line.y2};
    let linePoints = [copy(currentPoint)];
    while (!equal(currentPoint, endPoint)) {
        currentPoint.x += norm.x; 
        currentPoint.y += norm.y;
        linePoints.push(copy(currentPoint));
    }
    return linePoints;
}

function hash(point) {
    return `${point.x}:${point.y}`;
}

export default function P1() {
    let [ans, setAns] = React.useState(`P1`);
    React.useEffect(function solution() {
        console.clear();
        
        let lst = data.trim().split("\n").map(x => {
            let [xy1, xy2] = x.split(" -> ");
            let [x1, y1] = xy1.split(",");
            let [x2, y2] = xy2.split(",");
            return {
                'x1': parseInt(x1),
                'y1': parseInt(y1),
                'x2': parseInt(x2),
                'y2': parseInt(y2)
            };
        });

        // Get only horizontal and vertical lines
        let hv_lines = lst.filter(line => line.x1 === line.x2 || line.y1 === line.y2);

        let area = {};

        for (let line of hv_lines) {
            let linePoints = getLinePoints(line);
            for (let point of linePoints) {
                let h = hash(point);
                if (!(h in area)) {
                    area[h] = 0;
                }
                area[h] += 1;
            }
        }

        let count = 0;
        for (let k in area) {
            let value = area[k];
            if (value >= 2) { 
                count += 1;
            }
        }

        p(count);
        setAns(count);

    });

    return (
        <div className={styles.P1}>{ans}</div>
    );
}