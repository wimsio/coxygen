# 1. 🌑 Shadow – A Helios-Based Smart Contract & Cryptographic CLI

**Shadow** is a lightweight, developer-focused CLI toolset built around the [Helios](https://github.com/Hyperion-BT/Helios) smart contract language. It is designed to simplify the process of working with Plutus smart contracts, keys, addresses, and encodings — without relying on `cardano-cli`.

---

## 2. ✅ What Shadow Does

| Area               | Description                                                                 |
|--------------------|-----------------------------------------------------------------------------|
| 🧠 Smart Contracts | Compile `.hl` Helios source files into `.plutus` scripts and blockchain-ready addresses |
| 🔐 Key Tools       | Generate wallets, mnemonic phrases, payment/stake key pairs, pubKeyHashes, and addresses |
| 🖋 Signing         | Sign and verify hex-encoded messages using Helios-native Ed25519 crypto      |
| 🧮 Encoding Tools  | Convert between Bech32, Hex, Binary, and UTF-8 encodings                    |

> 💡 While Shadow provides a `--show-cli` flag that prints suggested `cardano-cli` commands, this is purely a **convenience feature** — Shadow itself does **not depend on or require** `cardano-cli`.

---

## 3. 🚀 Getting Started

### Basic Usage

```bash
node shadow.mjs <command> [options]
```

### Wallet & Contract Commands

```bash
node shadow.mjs gen-wallet [--mainnet]
node shadow.mjs compile <contract.hl> [--mainnet] [--staking] [--nft] [--show-cli]
```

### Signing & Verification

```bash
node shadow.mjs sign <hex-msg> keys/payment.skey
node shadow.mjs verify <hex-msg> <signature> keys/payment.vkey
```

### Address & Bech32 Utilities e.g. bech32 address demo : addr_test1qpnhjk2v44axnvhlccuqhlmky09fgn0tvrjlrm6tnzure9qkm0guvx66e0lsh4s22y3ywp2zpkkvhnv2a7jfu7jrr4vqw3zfl4

```bash
node shadow.mjs to-pkh <bech32>
node shadow.mjs to-binary <bech32>
node shadow.mjs to-hex <bech32>
node shadow.mjs to-address <bech32>
```

### Encoding & Conversion Tools

```bash
node shadow.mjs gen-wallet [--mainnet]
node shadow.mjs compile <contract.hl> [--mainnet] [--staking] [--nft] [--show-cli]
node shadow.mjs to-pkh <bech32>
node shadow.mjs to-binary <bech32>
node shadow.mjs to-hex <bech32>
node shadow.mjs to-address <bech32>
node shadow.mjs gen-keys [seed] [--mainnet]
node shadow.mjs sign <hex-msg> <payment.skey>
node shadow.mjs verify <hex-msg> <signature> <payment.vkey>
node shadow.mjs hex-encode "Hello world"
node shadow.mjs hex-decode 48656c6c6f20776f726c64
node shadow.mjs str-to-bin "text"
node shadow.mjs bin-to-str "01110100 01100101 01111000 01110100"
node shadow.mjs hex-to-bin 74657874
node shadow.mjs bin-to-hex "01110100 01100101 01111000 01110100" 
node helios-bech32-cli.js to-bech32 <pubKeyHash-hex> [--mainnet]
node helios-bech32-cli.js interactive
node shadow  compile my_script.hl --optimize --output my_script.json
node shadow  compile always_succeed.hl --optimize --output always_succeed.json
node shadow  compile always_succeed.hl --optimize --output always_succeed.plutus
node shadow  compile signature_smart_contract.hl -DOWNER "9f711be3753ee805982a020ffe3c904c496db4e13ee064e66fd7469d" -O --output signature_smart_contract.plutus
node shadow  eval signature_smart_contract.hl OWNER {"bytes": "9f711be3753ee805982a020ffe3c904c496db4e13ee064e66fd7469d"}
node shadow  eval signature_smart_contract.hl OWNER -DOWNER 9f711be3753ee805982a020ffe3c904c496db4e13ee064e66fd7469d {"bytes": "9f711be3753ee805982a020ffe3c904c496db4e13ee064e66fd7469d"}
node shadow  address signature_smart_contract.plutus addr_test1wqlzgsd368uxyjv5z8uwvg8t5cwuhf69zuydkykc7g90qag660hq7
node shadow  address signature_smart_contract.plutus --mainnet addr1wylzgsd368uxyjv5z8uwvg8t5cwuhf69zuydkykc7g90qagpjmt0m

```

---

## 4. 🧾 Command Reference

### 🔑 Wallet & Contract Tools
- `gen-wallet` — Generate a wallet (mnemonic + payment/stake keys + addresses)
- `compile` — Compile a `.hl` file into `.plutus`, output hash and address

### 🖋 Signing Tools
- `sign` — Sign a hex-encoded message using a `.skey`
- `verify` — Verify a message signature using a `.vkey`

### 📦 Bech32 Utilities
- `to-pkh` — Extract pubKeyHash from a Bech32 address
- `to-binary` — Convert a Bech32 address to raw binary
- `to-hex` — Convert a Bech32 address to hex
- `to-address` — Parse and normalize a Bech32 address

### 🧮 Encoding Tools
- `hex-encode` — Convert UTF-8 string to hex
- `hex-decode` — Convert hex to UTF-8 string
- `str-to-bin` — Convert string to binary
- `bin-to-str` — Convert binary to string
- `hex-to-bin` — Convert hex to binary
- `bin-to-hex` — Convert binary to hex

### 🌐 Network Flags
- `--mainnet` — Use mainnet address formats (default is testnet)
- `--staking` — Use staking script address format (for `compile`)
- `--nft` — Mark compiled script as a CIP-68 NFT policy
- `--show-cli` — Print a suggested `cardano-cli` deployment command
- `--help` — Display help message

---

## 5. 📦 Metadata

- **Author:** Bernard Sibanda  
- **Date:** 20 April 2025  
- **Company:** Coxygen Global  
- **GitHub:** [github.com/wimsio/coxygen](https://github.com/wimsio/coxygen)  
- **Website:** [coxygen.co](https://coxygen.co)  

---

## 6. 📚 Learn More

- 📖 [Helios Book – Official Documentation](https://www.hyperion-bt.org/helios-book/intro.html)  
- 🔗 [Helios CLI by Hyperion (Source)](https://github.com/Hyperion-BT/helios-cli/tree/main)

---

## 7. 🧪 Try It

```bash
node shadow.mjs --help
```

Use this to explore the tool’s capabilities and available commands.
