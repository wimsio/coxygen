> Docs: [Coxylib API](https://coxylib.xyz/index.html) | [Helios](https://helios-lang.io/) | [Jimba](https://www.npmjs.com/package/jimba)

# 1) 📦 Coxylib (Vanilla JS for Static Sites)

Coxylib is a lightweight **browser-first** utility layer around the Helios smart contract library for Cardano. It exposes **atomic, composable functions** for addresses, UTXOs, transactions, minting, metadata, and more — all designed to be used directly from `<script type="module">` in static websites.
**Logging & testing are handled by Jimba.js**, a toggleable front-end harness that replaces `console.log` with structured UI logs and built-in unit/property-style checks.&#x20;

## 2) 🗂️ Table of Contents

1. [Coxylib (Vanilla JS for all types of websites and web applications)](#1--coxylib-vanilla-js-for-static-sites)
2. [Table of Contents](#2--️-table-of-contents)
3. [Features](#3--✨-features)
4. [Install & Import (Static HTML)](#4--🧩-install--import-static-html)
5. [Jimba.js: Logging, Testing, Property-Style Checks](#5--🧪-jimbajs-logging-testing-property-style-checks)
6. [Usage Examples (Real Calls)](#6--🚀-usage-examples-real-calls)
7. [API Notes](#7--📘-api-notes)
8. [Development Notes](#8--🛠️-development-notes)
9. [License](#9--📜-license)

## 3) ✨ Features

* 🔗 **Browser-Ready Helios Glue** — clean wrappers for Helios objects and flows.
* 💼 **Wallet / Address Helpers** — derive addresses, convert formats, PKH, etc.
* 💸 **UTXO & TX Helpers** — read UTXOs, construct/finalize/submit transactions.
* 🧱 **Asset & Minting** — mint/burn tokens (incl. CIP-68 ref tokens), metadata (721).
* 🧪 **Jimba Integration** — **toggleable UI logging**, unit tests, and **property-style** checks in the browser (no Node tooling).&#x20;

## 4) 🧩 Install & Import (Static HTML)

No npm, no bundlers. Place files in your project and import them via ES modules:

```
/project-root
 ├─ index.html
 ├─ js/
 │   ├─ helios-min.js
 │   ├─ coxylib110.js
 │   └─ jimba.js
 └─ scripts/
     ├─ tokens.js
     ├─ scriptForMintingUniversitiesCollegesNFT.js
     ├─ scriptForLockingUniversitiesCollegesNFT.js
     └─ scriptForLockingUCNFTs.js
```

```html
<!-- index.html -->
<script type="module">
  import { 
    bech32ToPkh, getAllTxInputs, TEST_NETWORK_PARAMS_PREPROD, TEST_BLOCKFROST,
    txPrerequisites, createFiveWalletAddresses, randomBytes, createMnemonic,
    encryptMnemonic, decryptMnemonic, sumUTXOADA, getValue, hlib,
    generateMetadata, hexToText, textToHex, mintBurnToken
  } from "./js/coxylib110.js";

  import { Address } from "./js/helios-min.js";
  import { opt, j } from "./js/jimba.js";

  // Jimba toggles
  opt._R = 1;  // run all tests/checks/logs
  opt._O = 0;  // logs only
  opt._M = 0;  // show stack frames for logs
  opt._T = 0;  // run tests
  opt._Ob = 0; // show test stack frames
  opt._FailsOnly = 0; // only failed tests
  opt._F = 0;  // function profiling (j.s/j.e)
  opt._tNo = 1; // test pack iterations
</script>

Example of Helios Smart Contract Code:

export const ticket = 
`minting ticket
const version: String = "TKP v0.5"

// The minting policy can either mint, convert or burn tickets
enum Redeemer { 
    Mint
    Convert {
        qty: Int
        userTicketTokenNames: []ByteArray
        refTicketTokenNames: []ByteArray
    }
    Burn
}

// Contract parameters
const TX_ID: ByteArray = #
const TX_IDX: Int = 0
const TN: ByteArray = #
const SHOWTIME: Time = Time::new(0)
const QTY: Int = 1
const PAYMENT_PKH: PubKeyHash = PubKeyHash::new(#)
const STAKE_PKH: PubKeyHash = PubKeyHash::new(#)
const HOLD_VAL_HASH: ValidatorHash = ValidatorHash::new(#)
const MIN_LOVELACE: Int = 2_000_000

// Global variables
const txId: TxId = TxId::new(TX_ID)
const outputId: TxOutputId = TxOutputId::new(txId, TX_IDX)
const minLovelaceVal: Value = Value::lovelace(MIN_LOVELACE)

func totalAssetVal( tokenNames: []ByteArray, 
                    refTokenNames: []ByteArray, 
                    mph: MintingPolicyHash, 
                    qty: Int) -> Value {

    tokenAssetClass: AssetClass = AssetClass::new(
        mph, 
        tokenNames.get(0)
    );
    refTokenAssetClass: AssetClass = AssetClass::new(
        mph, 
        refTokenNames.get(0)
    );
    if (tokenNames.length == 1) {
        Value::new(tokenAssetClass, 1) + Value::new(refTokenAssetClass, 1) 
    } else {
        totalAssetVal(tokenNames.tail, refTokenNames.tail, mph, qty - 1) 
                + (Value::new(tokenAssetClass, 1))
                + (Value::new(refTokenAssetClass, 1))
    }
}

// Define the main minting policty
func main(redeemer: Redeemer, ctx: ScriptContext) -> Bool {
    print(version.show());
    tx: Tx = ctx.tx;
    mph: MintingPolicyHash = ctx.get_current_minting_policy_hash();
    ticket_assetclass: AssetClass = AssetClass::new(
        mph, 
        TN
    );
    value_minted: Value = tx.minted;
    now: Time = tx.time_range.start;

    redeemer.switch {
        Mint => {
            // Check that the contract parameter UTXO is included in the inputs
            // and that the minted amount is equal to the quanty given
            (value_minted == Value::new(ticket_assetclass, QTY)).trace("TKP1: ") &&
            tx.inputs.any((input: TxInput) -> Bool {
                                (input.output_id == outputId).trace("TKP2: ")
                                }
                        ) &&
            // Check that the transaction is signed by stake key
            tx.is_signed_by(STAKE_PKH).trace("TKP3: ") &&
            // Check that the minted value is going to the holding validator
            (tx.value_locked_by(HOLD_VAL_HASH) ==  value_minted + minLovelaceVal).trace("TKP:4 ") &&
            // Don't allow minting of ticket after showtime
            (now < SHOWTIME).trace("TKP5: ")
        },
        red: Convert => { 
            // Construct the ticket token value to burn
            burnTokenValue: Value = Value::new(ticket_assetclass, (-1) * red.qty);
            mintTokenValue: Value = totalAssetVal(  red.userTicketTokenNames,
                                                    red.refTicketTokenNames, 
                                                    mph, 
                                                    red.qty);
            totalValue: Value = burnTokenValue + mintTokenValue;
    
            // Check that the amount of tokens to convert is greater than 0
            (red.qty > 0).trace("TKP6: ") &&
            // Check that the total value is what is actually minted/burned 
            (value_minted == totalValue).trace("TKP7")
   
        },
        Burn => {
            // Allow any quantity of the minting policy to be burned in a transaction
            (value_minted.get_policy(mph).all( (_, amount: Int) -> Bool {
                amount < 0
            }).trace("TKP8: ")) &&
            // Burning only allowed by event owner
            tx.is_signed_by(STAKE_PKH).trace("TKP9: ") 
        }
    } 
}`
```

> **Note:** Coxylib v1.1.1 exports ready-to-use constants like `TEST_NETWORK_PARAMS_PREPROD`, `TEST_BLOCKFROST`, and `txPrerequisites`. Functions mirror the signatures in your code.&#x20;

## 5) 🧪 Jimba.js: Logging, Testing, Property-Based Testing

* **One-liner logging convention:** always log on the **same line** as the variable being created/used for ultra-compact, toggleable diagnostics.

  * Example: `const words = await createMnemonic(); j.log({words})`
* **Why Jimba (vs console):**
  
<img width="1830" height="722" alt="image" src="https://github.com/user-attachments/assets/7dea4a43-7a05-4d0a-a9b9-28457151cb3b" />

  * 🧷 **Toggleable**: switch between silent/logs/tests without touching code.
  * 🧩 **Front-End Harness**: logs render in your app UI, not hidden in DevTools.
  * ⏱️ **Profiling**: use `j.s()`/`j.e()` to measure function spans.
  * ✅ **Unit Tests**: `j.test()` / `j.check()` for assertions right in the browser.
  * 🎲 **Property-Based Testing**: write randomized checks (e.g., varying inputs with `randomBytes`, mnemonics) to simulate **property-based** test behavior in-browser — fast feedback without extra libraries.&#x20;

## 6) 🚀 Usage Examples (Real Calls)

All examples follow your **same-line logging** convention.

### 6.1 🔑 Create Mnemonic & Derive 5 Addresses

```js
const words = await createMnemonic(); j.log({words})
const addrs = createFiveWalletAddresses(words); j.log({addrs})
// Example: show first payment addr
const firstAddrB32 = addrs[0].paymentAddressBech32; j.log({firstAddrB32})
```

### 6.2 🏦 Convert Bech32 → PubKeyHash

```js
const pkh = bech32ToPkh(firstAddrB32); j.log({pkh})
```

### 6.3 📦 Fetch UTXOs for an Address

```js
const addr = Address.fromBech32(firstAddrB32); j.log({addr})
const utxos = await getAllTxInputs(addr); j.log({utxos})
```

### 6.4 🔐 Encrypt & Decrypt Mnemonic (Argon2 + AES-GCM)

```js
const pass = "Strong passphrase here"; j.log({pass})
const enc = await encryptMnemonic(pass, words.join(",")); j.log({enc})
const dec = await decryptMnemonic(pass, enc.salt, enc.iv, enc.ct); j.log({dec})
```

### 6.5 🎲 Randomness Utilities

```js
const rb = randomBytes(16); j.log({rb})
```

### 6.6 🔁 Hex/Text Helpers

```js
const hexed = textToHex("hello"); j.log({hexed})
const text  = hexToText(hexed);   j.log({text})
```

### 6.7 🧮 Sum UTXO ADA (Example flow)

> This function uses Helios `TxInput`, signs, submits (see source). Provide the required inputs as in your app flow.

```js
// Example placeholders (wire these from your wallet/session state):
// const txHash = await sumUTXOADA(addr, hlib.TxInput, addr.pubKeyHash, myRootPrivateKey, TEST_NETWORK_PARAMS_PREPROD, TEST_BLOCKFROST); j.log({txHash})
```

### 6.8 🧾 Generate CIP-721 Metadata

```js
const info = {
  policyId: "policyHex",
  assetName: "WIMS",
  assetTitle: "WIMS Token",
  tickerIconIPFS: "ipfs://...icon.png",
  organization: "WIMS-Cardano SADC",
  organizationWebsiteUrl: "https://wims.io",
  assetDescription: "Demo asset",
  assetPurpose: "Education",
  quantity: "1",
  imageIPFS: "ipfs://...image.png",
  videoIPFS: "ipfs://...video.mp4",
  dateExpires: "0",
  otherInfo: "More details",
  assetType: "NFT",
  assetAuthor: "Author Name",
  tags: "wims,cardano,edu",
  assetClassification: "NFT"
}; j.log({info})

const md = generateMetadata(info); j.log({md})
```

### 6.9 🪙 Mint & Lock (CIP-68-friendly) with `mintBurnToken`

> Expects your compiled script strings and an `info` object (note: **`baseAddress` must be a Helios `Address`**). Coxylib will build, finalize, sign, and submit; submission uses **`info.TEST_BLOCKFROST`**.&#x20;

```js
import { scriptForMintingUniversitiesCollegesNFT as mintScript } from "./scripts/scriptForMintingUniversitiesCollegesNFT.js";
import { scriptForLockingUniversitiesCollegesNFT  as lockScript } from "./scripts/scriptForLockingUniversitiesCollegesNFT.js";

const baseAddress = Address.fromBech32(firstAddrB32); j.log({baseAddress})

const infoMint = {
  baseAddress,                         // Helios Address
  assetName: "WIMS-DEMO",              // Text or bytes accepted by script param
  quantity: 1,
  recipientPayKey: /* your signing key encrypted */, 
  TEST_BLOCKFROST: TEST_BLOCKFROST,    // Coxylib expects this inside info
  txhash: document.getElementById("txhash"), // optional DOM target
  dbRecordStatus: "open",
  assetTitle: "WIMS Demo NFT",
  StudentNumber: "12345",
  assetNameCode: "WIMS01",
  cip68InlineDatum: undefined,         // provide if needed for CIP-68
  phpFileName: "./saveProgressTokens.php" //this can be java, python, c#, etc.
}; j.log({infoMint})

const done = await mintBurnToken(mintScript, lockScript, infoMint); j.log({done})
```

### 6.10 🧰 `hlib` Shortcut Access to Helios Types

```js
const v = new hlib.Value(0n); j.log({v})
```

### 6.11 💾 App Key/Value Storage (Server-side helper)

```js
const someVal = await getValue("myKey"); j.log({someVal})
```

## 7) 📘 API Notes

* **Exports**: `hlib`, `txPrerequisites`, `TEST_NETWORK_PARAMS_PREPROD`, `TEST_BLOCKFROST`, `createMnemonic`, `createFiveWalletAddresses`, `randomBytes`, `encryptMnemonic`, `decryptMnemonic`, `getAllTxInputs`, `bech32ToPkh`, `hexToText`, `textToHex`, `generateMetadata`, `mintBurnToken`, `getValue`, etc. (see source for the complete list).&#x20;
* **Network Params**: `TEST_NETWORK_PARAMS_PREPROD` auto-loads preprod params; `txPrerequisites.networkParamsUrl` is also used in flows.&#x20;
* **Blockfrost**: `TEST_BLOCKFROST` is a ready instance for **preprod** in v1.1.1; pass it when required (e.g., `mintBurnToken(info.TEST_BLOCKFROST)`).&#x20;
* **Same-line Jimba logging**: keep `j.log({var})` **on the same line** as the variable usage to maintain compact, opt-out diagnostics.

## 8) 🛠️ Development Notes

* 100% client-side dApp flows are possible; deploy on simple hosting (even cPanel).
* Prefer **atomic** building blocks; compose them for higher-level UX flows.
* Extend with your scripts (validators/minting policies), forms, and UI widgets.&#x20;

## 9) 📜 License

**MIT** © 2025 — Coxygen Global Pty Ltd / Authors.&#x20;

