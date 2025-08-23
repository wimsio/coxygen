# Coxylib v1.1.0

**Atomic Helios wrapper functions for fast, testable Cardano smart-contract development — no build tools required.**

- **Client-side only** (works on any static host, even cPanel)
- **No Node/NPM** needed
- **MIT Licensed**
- **Status:** Stable • ready for preprod/mainnet
- **Build in testing Jimba.js**

> Documentation: [Coxylib Docs](https://coxylib.xyz/index.html) | [Helios Docs](https://helios-lang.io/) | [Jimba](https://www.npmjs.com/package/jimba)

## Table of contents

- [Why Coxylib?](#why-coxylib)
- [Live examples](#live-examples)
- [Quick start](#quick-start)
- [Usage snippets](#usage-snippets)
  - [Initialize wallet](#initialize-wallet)
  - [Mint a simple NFT](#mint-a-simple-nft)
  - [Send ADA / assets](#send-ada--assets)
  - [CIP-68 helpers](#cip-68-helpers)
  - [Metadata utilities](#metadata-utilities)
- [Network config](#network-config)
- [API reference](#api-reference)
- [Browser support](#browser-support)
- [Contributing](#contributing)
- [License](#license)
- [Credits & contact](#credits--contact)
- [Links](#links)

## Why Coxylib?

Coxylib focuses on **small, composable browser functions** that sit on top of [Helios] for Cardano. It’s ideal when you want to prototype or ship quickly without a bundler:

- Testable atomic utilities
- Wallet helpers (CIP-30)
- Fast minting & transaction flows
- CIP-68 helpers & metadata tools
- Drop-in on any static site
- The functions are wrapped up with Jimba for introspective toggleable testing and logging

## Live examples

Websites connected to Cardano via **Helios + Coxylib**:

- https://coxygen.co/universities  
- https://cardanopropertysolutions.co  
- https://coxygen.co/coxygen.co/demo/00-20062025/vesting.html  
- https://coxygen.co/coxygen.co/rido/DonationApp-v4-15112024/  

## Quick start

Include **Helios**, **Jimba**, and **Coxylib** on a static page and start coding.

```html
<!-- Include dependencies -->
<script type="module" src="./helios-min.js"></script>
<script type="module" src="./jimba.js"></script>

<!-- Import Coxylib -->
<script type="module">
  import * as coxy from "./coxylib.js";

  // 1) Initialize
  const wallet = await coxy.init(coxy.j);

  // 2) Get wallet essentials (CIP-30 + helpers)
  const info = await coxy.walletEssentials(
    wallet,
    coxy.Cip30Wallet,
    coxy.WalletHelper,
    coxy.Value,
    coxy.txPrerequisites.minAda,
    coxy.j
  );

  console.log("Ready:", info);
</script>
```

> Tip: Serve the folder with any static server (e.g., `python -m http.server`) so `module` imports work.



## Usage snippets

Below are minimal patterns. See the JSDoc pages for full signatures and options.

### Initialize wallet

```js
import * as coxy from "./coxylib.js";

const wallet = await coxy.init(coxy.j);
const essentials = await coxy.walletEssentials(
  wallet,
  coxy.Cip30Wallet,
  coxy.WalletHelper,
  coxy.Value,
  coxy.txPrerequisites.minAda,
  coxy.j
);
```

### Mint a simple NFT

```js
// Pseudocode: consult docs for the exact shape of params
// See: ./global.html#mint_ (or #mint)
await coxy.mint_({
  name: "MyFirstNFT",
  image: "ipfs://.../image.png",
  // policy, recipient, and other fields per docs…
});
```

### Send ADA / assets

```js
// See: ./global.html#sendADA and ./global.html#sendAssets
await coxy.sendADA({
  to: "addr1...",            // Bech32 recipient
  lovelace: 4_000_000,       // amount in lovelace
  note: "Thanks!"
});

// For tokens:
await coxy.sendAssets({
  to: "addr1...",
  assets: [{ policyId: "...", name: "TOKEN", qty: 1 }],
});
```

### CIP-68 helpers

```js
// See: ./global.html#createCIP68Token
const names = coxy.createCIP68Token({
  policyId: "...",
  baseName: "MyAsset",   // library helps with reference/content names per CIP-68
});
console.log(names);
```

### Metadata utilities

```js
// See: ./global.html#generateMetadata
const m721 = coxy.generateMetadata({
  policyId: "...",
  assets: [{ name: "MyFirstNFT", image: "ipfs://..." }],
});
console.log(m721);
```



## Network config

Default values shipped with this repo (adjust to your needs):

* **Network params:** `./params/preprod.json`
* **Min ADA UTxO:** `4,000,000` lovelace
* **Max fee (cap):** `3,000,000` lovelace

You can swap the params file for preview/mainnet or your custom JSON when you build transactions.

## API reference

* **Namespaces:** [`hlib`](./hlib.html), [`psxTime`](./psxTime.html)
* **Popular functions:**

  * [`mint`](./global.html#mint), [`mint_`](./global.html#mint_)
  * [`sendADA`](./global.html#sendADA), [`sendAssets`](./global.html#sendAssets)
  * [`createCIP68Token`](./global.html#createCIP68Token)
  * [`tokenFound`](./global.html#tokenFound)
  * [`generateMetadata`](./global.html#generateMetadata)

## Browser support

Modern evergreen browsers (Chromium, Firefox, Safari). The library is loaded using **ES modules**, so serve over HTTP(S) rather than opening `file://` directly.

## Contributing

Issues and PRs are welcome!

1. Fork the repo
2. Create a feature branch
3. Commit with clear messages
4. Open a PR describing the change and any testing notes

## Links

1. **Website:** [https://coxygen.co](https://coxygen.co)
2. **Email:** [admin@coxygen.co](mailto:admin@coxygen.co), [cto@coxygen.co](mailto:cto@coxygen.co)
3. **GitHub (Org/Repo):** [https://github.com/wimsio/coxygen](https://github.com/wimsio/coxygen)
4. **WhatsApp (Community):** [https://chat.whatsapp.com/I6y3xrRLMRfAIXQPb1IuU3](https://chat.whatsapp.com/I6y3xrRLMRfAIXQPb1IuU3)
5. **Telegram:** [https://t.me/+JOi40VWgvMg0MzBk](https://t.me/+JOi40VWgvMg0MzBk)
6. **Twitter/X:** [https://twitter.com/coxygenco](https://twitter.com/coxygenco)
7. **Discord:** [https://discord.gg/RxrhMgnSb4](https://discord.gg/RxrhMgnSb4)

8. ## License

MIT © Coxygen Global

## Credits & contact

**Author:** Bernard Sibanda
**Company:** Coxygen Global Pty Ltd

**Repository:** [https://github.com/wimsio/coxygen/tree/main/coxylib](https://github.com/wimsio/coxygen/tree/main/coxylib)

**Address:** 7 Gold Reef Road, Ormonde, 2190
**Email:** [cto@wims.io](mailto:cto@wims.io), [admin@coxygen.co](mailto:admin@coxygen.co)
**Mobile:** +27 73 182 0631

> Security note: Always test on **preprod/preview** before mainnet. Validate inputs, set sensible fee/UTxO caps, and handle wallet permissions carefully.

