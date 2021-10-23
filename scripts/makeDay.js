import fs from 'fs';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';
import secrets from './secrets.js';

const session = secrets.session_cookie;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const day = process.argv[2];

const template_day_js = fs.readFileSync(path.join(__dirname, 'template_day.js')).toString('utf-8');
const template_day_css = fs.readFileSync(path.join(__dirname, 'template_day.css')).toString('utf-8');

const day_js_p1 = template_day_js.replace(/TEMPLATE/g, "P1");
const day_js_p2 = template_day_js.replace(/TEMPLATE/g, "P2");

const day_css_p1 = template_day_css.replace(/TEMPLATE/g, "P1");
const day_css_p2 = template_day_css.replace(/TEMPLATE/g, "P2");

const PATH = path.join(__dirname, '..', 'pages', `d${day}`);

try {
    fs.mkdirSync(PATH);
} catch {}

fs.writeFileSync(path.join(PATH, 'p1.js'), day_js_p1);
fs.writeFileSync(path.join(PATH, 'p2.js'), day_js_p2);

fs.writeFileSync(path.join(PATH, 'P1.module.css'), day_css_p1);
fs.writeFileSync(path.join(PATH, 'P2.module.css'), day_css_p2);

fetch(`https://adventofcode.com/2015/day/${day}/input`, {
    "headers": {
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-language": "en-US,en;q=0.9,la;q=0.8",
        "cache-control": "max-age=0",
        "sec-ch-ua": "\"Chromium\";v=\"94\", \"Google Chrome\";v=\"94\", \";Not A Brand\";v=\"99\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "same-origin",
        "sec-fetch-user": "?1",
        "upgrade-insecure-requests": "1",
        "cookie": `session=${session}`
    },
    "referrer": `https://adventofcode.com/2015/day/${day}`,
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": null,
    "method": "GET",
    "mode": "cors"
    })
    .then(res => {
        res.text().then(data => {
            fs.writeFileSync(path.join(PATH, 'input.txt'), data);
        });
    })
    .catch(e => {
        console.log(e);
    });