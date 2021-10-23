import React from 'react';
import Link from 'next/link';
import styles from '../styles/index.module.css';

export default function Index() {
    const ctx = require.context('./', true, /\.js$/);
    const pages = ctx
        .keys()
        .filter(v => v.match(/p[1|2].js$/) !== null) // Find anything that ends in p1.js or p2.js
        .map(page => {
            page = page
                .replace(/\.(\/)?/i, '') // Remove "./" prefix
                .replace(/\.js$/i, ''); // Remove ".js" suffix
                return page;
        })
        .map(page => {
            return (
                <Link key={page} href={`/${page}`}>
                    <a>{page}</a>
                </Link>
            );            
        });

    return (
        <div className={styles.Index}>{pages}</div>
    )
}
