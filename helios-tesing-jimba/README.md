This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

Set the following env variables:

```
export NEXT_PUBLIC_BLOCKFROST_API_KEY="get-your-blockfrost-api-key"
export NEXT_PUBLIC_BLOCKFROST_API="https://cardano-preprod.blockfrost.io/api/v0"
export NEXT_PUBLIC_NETWORK_PARAMS_URL="https://d1t0d7c2nekuk0.cloudfront.net/preprod.json"
```

Run the development server:

```bash
npm install
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.


The example testing with jimba js is in the index.tsx under pages directory.

1. Install jimba using npm as shown below :
   ```
  npm i jimba or npm i jimba --force //that is if there are dependence problems
   ```
2. Import the jimba js library and turn on switches as shown below:
 import {o,opt,tS,tE,jtest,jtrics,gNo,gNull,gAlphaNumericSymbolsString,gLowerCaseAlphabetString,gBoolean,gOnlyDigitsString,gUpperCaseAlphabetString} from 'jimba';
  opt._O = 1;
  opt._T = 1;
  opt._tNo = 100;
  opt._M = 1;
  opt._Tc = 1;
3. Testing code examples:
```

```
