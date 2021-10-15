# aoc next js
This repo is a template for AdventOfCode built with NextJS. It is able to automatically download the input file and create template code for a give day. Once a day is generated it will automatically show in the directory at `localhost:3000`. One can visit, for example, `localhost:3000/d1/p1` to view the solution for a day 1 part 1. During development one can open the browser console and view console.logs from their code whenever their file is saved. 

## How to Use

cd scripts

create secrets file contianing `session_cookie`

run `node makeDay.js [day_number]`

visit `localhost:3000` to see a list of available days

open `pages/d[day_number]/p[part_number].js` and visit `localhost:3000/d1/p1`

open the browser console and observe that your solution code is run when the given solution file is modified and saved

---

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
