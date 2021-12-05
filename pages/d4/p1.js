import React from 'react';
import styles from './P1.module.css';
import data from './input.txt';
import * as utils from '../../utils/utils.js';

const p = (v) => console.log(v);

// Return true or false if card has five in a row or column
function checkCard(card, cardLookup) {
    let rows = [0,0,0,0,0];
    let cols = [0,0,0,0,0];
    for (let r = 0; r < card.length; r++) {
        for (let c = 0; c < card.length; c++) {
            if (cardLookup[r][c]) {
                rows[r] += 1;
                cols[c] += 1;

                if (rows[r] == 5 || cols[c] == 5) {
                    return true;
                }
            }
        }
    }
    return false;
}

// Return the sum of all unchecked number of card
function getUncheckedSum(card, cardLookup) {
    let total = 0;
    for (let r = 0; r < card.length; r++) {
        for (let c = 0; c < card.length; c++) {
            if (!cardLookup[r][c]) {
                total += card[r][c];
            }
        }
    }
    return total;
}

export default function P1() {
    let [ans, setAns] = React.useState(0);
    React.useEffect(function solution() {
        console.clear();

        let lst = data.split("\n\n").map(x => x.trim().split("\n"));
        let numbers = lst[0][0].split(",").map(x => parseInt(x));
        let cards = lst.slice(1).map(x => x.map(y => y.trim().split(/\s+/).map(z => parseInt(z))));

        let cardLookup = [];
        for (let i = 0; i < 100; i++) {
            let cardGrid = [false,false,false,false,false];
            let temp = [];
            for (let j = 0; j < 5; j++) {
                temp.push(cardGrid.slice());
            }
            cardLookup.push(temp);
        }

        // {cardNumber -> list of card, row, col locations of that number}
        let numberLookup = {};
        for (let i = 0; i < cards.length; i++) {
            for (let r = 0; r < cards[0].length; r++) {
                for (let c = 0; c < cards[0].length; c++) {
                    let number = cards[i][r][c];
                    if (!(number in numberLookup)) {
                        numberLookup[number] = [];
                    }
                    numberLookup[number].push([i, r, c]);
                }
            }
        }

        let sol = () => {
            for (let call of numbers) {
                for (let loc of numberLookup[call]) {
                    let [i, r, c] = loc;
                    cardLookup[i][r][c] = true;
                }
                for (let i = 0; i < cards.length; i++) {
                    if (checkCard(cards[i], cardLookup[i])) {
                        let unchecked = getUncheckedSum(
                            cards[i], cardLookup[i]
                        );
                        return call * unchecked;
                    }
                }
            }
        };

        let a = sol();
        p(a);
        setAns(a);
    });

    return (
        <div className={styles.P1}>{ans}</div>
    );
}
