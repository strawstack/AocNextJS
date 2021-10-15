import React from 'react';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

export default function Home() {
    const ctx = require.context('./', true, /\.js$/);
    const pages = ctx
        .keys()
        .filter(page => !page.startsWith('./_'))
        .filter(page => page.indexOf('input') === -1)
        .map(page => {
        page = page
            .replace(/(\/index)?\.js$/i, '') // Removes the index.js files
            .replace(/\.(\/)?/i, ''); // Normalize the homepage directory to "/"
            return page;
        })
        .map(page => {
            return (
                <Link key={page} href={page}>
                    <a>{page}</a>
                </Link>
            );            
        });

    return (
        <div className={styles.Home}>{pages}</div>
    )
}
