# Coxylib v1.1.0 - 23-08-2025

**Atomic Helios wrapper functions for fast, testable Cardano smart-contract development — no build tools required.**

* ⚡ **Client-side only** (works on any static host, even cPanel)
* 📦 **No Node/NPM** needed
* 📜 **MIT Licensed**
* 🟢 **Status:** Stable • ready for preprod/mainnet
* 🧪 **Build in testing Jimba.js**

> Docs: [Coxylib](https://coxylib.xyz/index.html) | [Helios](https://helios-lang.io/) | [Jimba](https://www.npmjs.com/package/jimba)



## 📑 Table of Contents

1. [Why Coxylib?](#1️⃣-why-coxylib-)
2. [Live Examples](#2️⃣-live-examples-)
3. [Quick Start](#3️⃣-quick-start-)
4. [Usage Snippets](#4️⃣-usage-snippets-)

   * [Get UTXOs](#-1-get-utxos)
   * [Send ADA](#-2-send-ada)
   * [Send Tokens](#-3-send-tokens)
   * [Mint a Simple NFT](#-4-mint-a-simple-nft)
   * [Consolidate UTXOs](#-5-consolidate-utxos)
   * [Wallet Derivation](#-6-wallet-derivation)
   * [Metadata Utilities](#-7-metadata-utilities)
5. [Network Config](#5️⃣-network-config-)
6. [API Reference](#6️⃣-api-reference-)
7. [Browser Support](#7️⃣-browser-support-)
8. [Glossary](#8️⃣-glossary-of-terms-)
9. [Contributing](#9️⃣-contributing-)
10. [Links & Contact](#🔟-links--contact-)



## 1️⃣ Why Coxylib? ⚡

Coxylib focuses on **small, composable browser functions** on top of \[Helios]. Ideal for rapid prototyping:

* 🧩 Testable atomic utilities
* 🔑 Wallet helpers (CIP-30 + mnemonics)
* 🪙 Minting & transfer flows
* 📜 CIP-68 + metadata tools
* 🌐 Drop-in on static sites
* 🐞 Jimba.js logging/testing



## 2️⃣ Live Examples 🌍

* [Coxy Wallet](https://coxygen.co/universities/wallet.php)
* [https://coxygen.co/universities](https://coxygen.co/universities)
* [https://cardanopropertysolutions.co](https://cardanopropertysolutions.co)
* [https://coxygen.co/coxygen.co/demo/00-20062025/vesting.html](https://coxygen.co/coxygen.co/demo/00-20062025/vesting.html)
* [https://coxygen.co/coxygen.co/rido/DonationApp-v4-15112024/](https://coxygen.co/coxygen.co/rido/DonationApp-v4-15112024/)

## 3️⃣ Quick Start 🚀

```html
<script type="module" src="./helios-min.js"></script>
<script type="module" src="./jimba.js"></script>
<script type="module" src="./coxylib.js"></script>
```

```js
import {
  hlib,
  getAllTxInputs,
  TEST_BLOCKFROST,
  TEST_NETWORK_PARAMS_PREPROD,
  txPrerequisites,
  sendADA,
  sendAssets,
  mintBurnToken,
  sumUTXOADA,
  textToHex,
  hexToText
} from "./coxylib.js";
```

## 4️⃣ Usage Snippets 💻

### 🔹 (1) Get UTXOs

```js
const addr = hlib.Address.fromBech32("addr_test1...");
const utxos = await getAllTxInputs(addr);
console.log("UTXOs", utxos);
```

### 🔹 (2) Send ADA

```js
const txh = await sendADA("addr_test1q...recipient", 5, myPaymentKey);
console.log("tx hash", txh);
```

### 🔹 (3) Send Tokens

```js
const data = {
  pk: myPaymentKey,
  utxos: myUtxos,
  address: "addr_test1...sender",
  toAddress: "addr_test1...recipient",
  assetMPH: "policyidhere...",
  assetName: "MyToken",
  assetQty: 10,
  clickBtnElem: el("btnSendAssets"),
  displayElem: el("assetElement")
};

const txh = await sendAssets(data);
console.log("tx hash", txh);
```

### 🔹 (4) Mint a Simple NFT

```js
import { scriptForMintingUniversitiesCollegesNFT } from "./scripts/scriptForMintingUniversitiesCollegesNFT.js";
import { scriptForLockingUCNFTs } from "./scripts/scriptForLockingUCNFTs.js";

const info = {
  assetName: textToHex("MyNFT"),
  assetTitle: "Demo NFT",
  imageIPFS: "ipfs://.../demo.png",
  organization: "Demo Org",
  assetPurpose: "NFT",
  quantity: 1,
  recipientPayKey: myPaymentKey,
  baseAddress: hlib.Address.fromBech32("addr_test1..."),
  TEST_BLOCKFROST,
  TEST_NETWORK_PARAMS_PREPROD
};

const txh = await mintBurnToken(
  scriptForMintingUniversitiesCollegesNFT,
  scriptForLockingUCNFTs,
  info
);
console.log("minted tx hash", txh);
```

### 🔹 (5) Consolidate UTXOs

```js
const txh = await sumUTXOADA(
  myAddress,
  hlib.TxInput,
  myAddress.pubKeyHash,
  myPaymentKey,
  TEST_NETWORK_PARAMS_PREPROD,
  TEST_BLOCKFROST
);
console.log("consolidated tx hash", txh);
```

### 🔹 (6) Wallet Derivation

```js
const enc = await getEncryptedData("./keys.php", { pin, postStatus: "get", PrimaryEmail: email });
const wordsCsv = await decryptMnemonic(passphrase, enc.salt, enc.iv, enc.ct);
const words = wordsCsv.split(",");

const root = hlib.RootPrivateKey.fromPhrase(words);
const payKey = root.deriveSpendingRootKey(0).derive(1).derive(0);
const stakeKey = root.deriveStakingRootKey(0).derive(0);

const addr = hlib.Address.fromPubKeyHash(
  payKey.derivePubKey().pubKeyHash,
  stakeKey.derivePubKey().pubKeyHash,
  hlib.config.IS_TESTNET
);

console.log("derived address", addr.toBech32());
```

### 🔹 (7) Metadata Utilities

```js
import { generateMetadata } from "./coxylib.js";

const m721 = generateMetadata({
  policyId: "policyidhere...",
  assets: [{ name: "MyNFT", image: "ipfs://.../demo.png" }]
});

console.log("721 metadata", m721);
```

## 5️⃣ Network Config ⚙️

* **Network params:** `./params/preprod.json`
* **Min ADA UTxO:** `4,000,000` lovelace
* **Max fee cap:** `3,000,000` lovelace

## 6️⃣ API Reference 📚

* `getAllTxInputs` → fetch UTXOs
* `sendADA` → transfer ADA
* `sendAssets` → transfer tokens
* `mintBurnToken` → mint/burn
* `sumUTXOADA` → consolidate
* `generateMetadata` → CIP-721 JSON
* `createFiveWalletAddresses` → derive 5 addresses

## 7️⃣ Browser Support 🌐

Modern evergreen browsers. Use `import` via HTTP(S), not `file://`.

## 8️⃣ Glossary of Terms 📖

* **UTXO** – Unspent Transaction Output
* **Lovelace** – smallest ADA unit (1 ADA = 1,000,000 lovelace)
* **PKH** – Public Key Hash
* **Mnemonic** – 12/24 recovery words for wallets
* **Policy ID (MPH)** – identifier for token minting policy
* **CIP-68** – Reference NFTs w/ inline metadata
* **CIP-721** – NFT metadata JSON standard
* **Blockfrost** – API service to query/submit Cardano txs
* **Network Params** – protocol constants (fees, min ADA, etc.)
* **Preprod / Preview** – safe Cardano testnets

## 9️⃣ Contributing 🤝

1. Fork
2. Branch
3. Commit clearly
4. PR with notes

## 🔟 Links & Contact 🔗

* 🌍 [Website](https://coxygen.co)
* 📧 [admin@coxygen.co](mailto:admin@coxygen.co) | [cto@wims.io](mailto:cto@wims.io)
* 🐦 [Twitter/X](https://twitter.com/coxygenco)
* 💬 [Discord](https://discord.gg/RxrhMgnSb4)
* 📱 [Telegram](https://t.me/+JOi40VWgvMg0MzBk)
* 📞 [WhatsApp](https://chat.whatsapp.com/I6y3xrRLMRfAIXQPb1IuU3)
* 📦 [GitHub](https://github.com/wimsio/coxygen/tree/main/coxylib)

