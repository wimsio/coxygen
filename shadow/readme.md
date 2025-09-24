# 1. 🌑 Shadow – A Helios-Based Smart Contract & Cryptographic CLI

**Shadow** is a lightweight, developer-focused CLI built around the [Helios](https://github.com/Hyperion-BT/Helios) smart contract language. It simplifies day-to-day work with Plutus smart contracts, keys, addresses, and encodings — without requiring `cardano-cli`.

## 2. 📑 Table of Contents

1. 🌑 [Overview](#1--shadow--a-helios-based-smart-contract--cryptographic-cli)
2. 📑 [Table of Contents](#2--table-of-contents)
3. ✅ [What Shadow Does](#3--what-shadow-does)
4. 🧰 [Requirements](#4--requirements)
5. 🛠 [Installation](#5--installation)
6. ⚡ [Quick Start](#6--quick-start)
7. 📖 [Command Reference](#7--command-reference)

   * 🔑 [Wallet & Contract](#71--wallet--contract)
   * 🖋 [Sign & Verify](#72--sign--verify)
   * 📦 [Bech32 Tools](#73--bech32-tools)
   * 🧮 [Encoding & Conversion](#74--encoding--conversion)
   * 🌐 [Global Flags](#75--global-flags)
8. 🧭 [Detailed Guides](#8--detailed-guides)

   * 📜 [Compile a Contract](#81-compile-a-contract)
   * 🔐 [Generate a Wallet](#82-generate-a-wallet)
   * ✍️ [Sign & Verify Messages](#83-sign--verify-messages)
   * 🏷 [Bech32 Utilities](#84-bech32-utilities)
   * 🔄 [Encoding Utilities](#85-encoding-utilities)
9. ⌨️ [Shell Tab-Completion](#9--shell-tab-completion)
10. 🛠 [Troubleshooting & FAQs](#10--troubleshooting--faqs)
11. 📕 [Glossary](#11--glossary)
12. 🧾 [Metadata](#12--metadata)
13. 📚 [Learn More](#13--learn-more)

## 3. ✅ What Shadow Does

| Area                   | Description                                                                               |
| ---------------------- | ----------------------------------------------------------------------------------------- |
| 🧠 **Smart Contracts** | Compile `.hl` Helios source into `.plutus` scripts and derive blockchain-ready addresses. |
| 🔐 **Key Tools**       | Generate wallets, mnemonic phrases, payment/stake key pairs, pubKeyHashes, and addresses. |
| 🖋 **Signing**         | Sign and verify messages using Helios-native Ed25519 crypto.                              |
| 🧮 **Encoding**        | Convert between Bech32, Hex, Binary, and UTF-8 encodings.                                 |

💡 **Note**: Shadow can display suggested `cardano-cli` commands with `--show-cli`. This is only for developer convenience. Shadow itself does **not require** `cardano-cli`.

## 4. 🧰 Requirements

* **Node.js** v18+ (v20+ recommended)
* **Helios runtime** (via `helios-min.mjs`)
* **POSIX shell** (Bash/Zsh; Windows users can use WSL or Git Bash)

## 5. 🛠 Installation

```bash
chmod +x install-shadow.sh
./install-shadow.sh
# Optional: specify location of shadow.mjs
# ./install-shadow.sh --shadow /absolute/path/to/shadow.mjs
```

Enable immediately in current shell:

```bash
source ~/.bashrc 2>/dev/null || source ~/.zshrc 2>/dev/null
hash -r
```

## 6. ⚡ Quick Start

```bash
shadow always_succeed.hl
# Equivalent:
shadow compile scripts/always_succeed.hl
```

See all commands:

```bash
shadow --commands
```

## 7. 📖 Command Reference

### 7.1. 🔑 Wallet & Contract

* `shadow gen-wallet [--mainnet]`
* `shadow compile <contract.hl> [--mainnet] [--staking] [--nft] [--show-cli]`

### 7.2. 🖋 Sign & Verify

* `shadow signHex <hex-msg> <payment.skey>`
* `shadow signMessage "text" <payment.skey>`
* `shadow verifyHex <hex-msg> <signatureHex> <payment.vkey>`
* `shadow verify <hex-msg> <signatureHex> <payment.vkey>`

### 7.3. 📦 Bech32 Tools

* `shadow addrBech32-to-pkh <addr>`
* `shadow addrBech32-to-binary <addr>`
* `shadow addrBech32-to-hex <addr>`
* `shadow addrBech32-to-address <addr>`

### 7.4. 🧮 Encoding & Conversion

* `shadow hex-encode "text"`
* `shadow hex-decode <hex>`
* `shadow str-to-bin "text"`
* `shadow bin-to-str "bits"`
* `shadow hex-to-bin <hex>`
* `shadow bin-to-hex "bits"`
* `shadow str-to-hex "text"`
* `shadow hex-to-str <hex>`
* `shadow bytes-to-text <hex>`

### 7.5. 🌐 Global Flags

* `--mainnet`
* `--staking`
* `--nft`
* `--show-cli`
* `--help`


## 8. 🧭 Detailed Guides

### 8.1. 📜 Compile a Contract

1. Place `.hl` file in `./scripts/`.
2. Run `shadow my_contract.hl`.
3. Outputs: `.plutus`, `.hash`, `.addr`.

### 8.2. 🔐 Generate a Wallet

```bash
shadow gen-wallet
shadow gen-wallet --mainnet
```

Produces mnemonic, keys, and addresses.

### 8.3. ✍️ Sign & Verify Messages

```bash
shadow signHex DEADBEEF... payment.skey
shadow signMessage "hello" payment.skey
shadow verifyHex DEADBEEF... sigHex payment.vkey
```

### 8.4. 🏷 Bech32 Utilities

```bash
shadow addrBech32-to-pkh <addr>
shadow addrBech32-to-hex <addr>
```

### 8.5. 🔄 Encoding Utilities

```bash
shadow hex-encode "Hello"
shadow bin-to-str "01110100..."
```


## 9. ⌨️ Shell Tab-Completion

* `shadow <Tab>` → lists all commands
* `shadow compile <Tab>` → completes `scripts/*.hl`

Enable:

```bash
source ~/.bashrc 2>/dev/null || source ~/.zshrc 2>/dev/null
```


## 10. 🛠 Troubleshooting & FAQs

* **`shadow: command not found`** → reload shell
* **Missing contract** → ensure `.hl` file exists in `scripts/`
* **`verifyMessage` not implemented** → use `verifyHex` instead


## 11. 📕 Glossary

* **Helios** → Smart contract language for Cardano
* **Plutus Script** → On-chain program (`.plutus`)
* **CBOR** → Compact binary format used in Cardano
* **Bech32** → Encoding for addresses
* **PubKeyHash (PKH)** → Hash of a public key
* **Stake Address** → Address used for staking rewards
* **Ed25519** → Cryptographic signature scheme

## 12. 📖 Command Reference

### 12.0. 🗂 Command Summary Table

| Icon | Command                 | Usage                                                                       | Description                                                            |
| ---- | ----------------------- | --------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| 🔑   | `gen-wallet`            | `shadow gen-wallet [--mainnet]`                                             | Generate wallet (mnemonic, keys, addresses)                            |
| 🔑   | `compile`               | `shadow compile <contract.hl> [--mainnet] [--staking] [--nft] [--show-cli]` | Compile Helios contracts to `.plutus`, hash, and address               |
| 🖋   | `signHex`               | `shadow signHex <hex-msg> <payment.skey>`                                   | Sign hex-encoded message with private key                              |
| 🖋   | `signMessage`           | `shadow signMessage "text" <payment.skey>`                                  | Sign plain text message                                                |
| 🖋   | `verifyHex`             | `shadow verifyHex <hex> <sigHex> <payment.vkey>`                            | Verify signature against a hex message                                 |
| 🖋   | `verify`                | `shadow verify <hex> <sigHex> <payment.vkey>`                               | Alias of `verifyHex`                                                   |
| 🖋   | `verifyMessage` ⚠️      | `shadow verifyMessage "text" <sigHex> <payment.vkey>`                       | Referenced in code, but not implemented                                |
| 📦   | `addrBech32-to-pkh`     | `shadow addrBech32-to-pkh <bech32>`                                         | Extract PubKeyHash from Bech32 address                                 |
| 📦   | `addrBech32-to-binary`  | `shadow addrBech32-to-binary <bech32>`                                      | Get binary from Bech32 address                                         |
| 📦   | `addrBech32-to-hex`     | `shadow addrBech32-to-hex <bech32>`                                         | Convert Bech32 address to hex                                          |
| 📦   | `addrBech32-to-address` | `shadow addrBech32-to-address <bech32>`                                     | Normalize a Bech32 address                                             |
| 🧮   | `hex-encode`            | `shadow hex-encode "Hello"`                                                 | Convert string → hex                                                   |
| 🧮   | `hex-decode`            | `shadow hex-decode <hex>`                                                   | Convert hex → string                                                   |
| 🧮   | `str-to-bin`            | `shadow str-to-bin "text"`                                                  | Convert string → binary                                                |
| 🧮   | `bin-to-str`            | `shadow bin-to-str "01110100..."`                                           | Convert binary → string                                                |
| 🧮   | `hex-to-bin`            | `shadow hex-to-bin <hex>`                                                   | Convert hex → binary                                                   |
| 🧮   | `bin-to-hex`            | `shadow bin-to-hex "01110100..."`                                           | Convert binary → hex                                                   |
| 🧮   | `str-to-hex`            | `shadow str-to-hex "text"`                                                  | Convert string → hex                                                   |
| 🧮   | `hex-to-str`            | `shadow hex-to-str <hex>`                                                   | Convert hex → string                                                   |
| 🧮   | `bytes-to-text`         | `shadow bytes-to-text <hex>`                                                | Decode hex bytes → UTF-8 text                                          |
| 🌐   | `--mainnet`             | flag                                                                        | Use mainnet network format                                             |
| 🌐   | `--staking`             | flag                                                                        | Compile to staking script address                                      |
| 🌐   | `--nft`                 | flag                                                                        | Compile as CIP-68 NFT policy                                           |
| 🌐   | `--show-cli`            | flag                                                                        | Show suggested `cardano-cli` command                                   |
| ℹ️   | `--help`                | flag                                                                        | Show help text                                                         |
| ℹ️   | `--commands`            | flag                                                                        | Show local command list                                                |
| 🩺   | `doctor`                | `shadow doctor`                                                             | Check `shadow.mjs` for missing features (`verifyMessage`, `FULL_HELP`) |

## 13. 🧾 Metadata

* 👨‍💻 **Author:** Bernard Sibanda
* 🏢 **Company:** Coxygen Global
* 📅 **Date Updated:** 24 September 2025
* 🌐 **GitHub:** [github.com/wimsio/coxygen](https://github.com/wimsio/coxygen)
* 🔗 **Website:** [coxygen.co](https://coxygen.co)

## 14. 📚 Learn More

* 📖 [Helios Book](https://www.hyperion-bt.org/helios-book/intro.html)
* 🔗 [Helios CLI (Source)](https://github.com/Hyperion-BT/helios-cli/tree/main)

---
