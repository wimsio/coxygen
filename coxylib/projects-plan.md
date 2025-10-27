# 🚀 WIMS Cardano Open Source Ecosystem

**Projects** : Coxylib · Jimba · Shadow CLI · Coxy Wallet

**Author**   : Bernard Sibanda

**Date**     : 27-10-2025 

### **Project Specifications Document (v1.0.0)**

> 📅 **Timeline:** 6 Months (24 Weeks)
> 🧑‍💻 **Team Size:** 20 Student Developers
> 🧠 **Includes:** Coxylib · Jimba · Shadow CLI · Coxy Wallet

## 📑 Table of Contents

1. [Overview](#1-overview)
2. [Coxylib Library](#2-coxylib-library)

   * 2.1 Documentation
   * 2.2 Testing (via Jimba)
   * 2.3 Frontend Templates
   * 2.4 Server Side (PHP)
   * 2.5 MySQL Database
   * 2.6 Onchain & Offchain
   * 2.7 AI Integration
   * 2.8 VSCode Extension
   * 2.9 **Coxylib Playground 🧩 (New)**
3. [Jimba Library](#3-jimba-library)
4. [Shadow CLI Library](#4-shadow-cli-library)
5. [Coxy Wallet](#5-coxy-wallet)
6. [Cross-Project Integrations](#6-cross-project-integrations)
7. [Developer Roles](#7-developer-roles)
8. [Milestones & Timelines](#8-milestones--timelines)

## 1. Overview

### 🌍 Purpose

This suite of open-source projects powers **next-generation Cardano dApps and developer tools**, combining onchain/offchain logic, testing automation, and AI-driven analysis.

| Library            | Function                                    | Core Language       |
| ------------------ | ------------------------------------------- | ------------------- |
| 🧩 **Coxylib**     | Cardano smart contract integration library  | JavaScript / PHP    |
| 🧪 **Jimba**       | Testing automation & property-based engine  | JavaScript          |
| ⚙️ **Shadow CLI**  | Developer & CI/CD command-line automation   | JavaScript          |
| 💳 **Coxy Wallet** | Lightweight wallet SDK for ADA, tokens, DEX | JavaScript / Helios |

## 2. Coxylib Library

### 🧩 Overview

Coxylib provides Cardano smart contract developers with a modular toolkit for building onchain/offchain apps with clean interfaces.

### 2.1 📘 Documentation

**🧑‍💻 Developers Needed:** 2 Writers + 1 JS Dev
**📦 Deliverables:**

* [ ] `docs/api_reference.md`
* [ ] Tutorials with code samples
* [ ] Helios code walkthroughs (`/docs/helios_examples/`)

**⏳ Duration:** 2 Weeks
**🎯 Outcome:** Clear, example-rich documentation for developers.

### 2.2 🧪 Testing (via Jimba)

**🧑‍💻 Developers:** 1 JS Dev + 1 QA Engineer
**📦 Deliverables:**

* [ ] Jimba unit & property tests
* [ ] 90%+ coverage
* [ ] CI/CD integration

**⏳ Duration:** 1.5 Weeks
**🎯 Outcome:** Reliable test automation with AI-generated suggestions.

### 2.3 🎨 Frontend Templates (HTML/CSS/JS)

**🧑‍💻 Developers:** 1 Frontend Dev + 1 Designer
**📦 Deliverables:**

* [ ] Wallet connect form
* [ ] Transaction viewer
* [ ] Token mint/swap UIs

**⏳ Duration:** 1 Week
**🎯 Outcome:** Vanilla JS templates to demo Coxylib integration.

### 2.4 🧱 Server Side (PHP)

**🧑‍💻 Developers:** 1 Backend Dev
**📦 Deliverables:**

* [ ] Wallet/Transaction API endpoints
* [ ] JWT authentication
* [ ] JSON-based API

**⏳ Duration:** 1 Week
**🎯 Outcome:** Lightweight backend for offchain logic.

### 2.5 🗄️ MySQL Database

**🧑‍💻 Developers:** 1 DB Engineer
**📦 Deliverables:**

* [ ] Schema: `users`, `transactions`, `tokens`, `wallet_sessions`
* [ ] Encrypted keys
* [ ] Schema file: `/docs/db_schema.sql`

**⏳ Duration:** 4 Days
**🎯 Outcome:** Secure and scalable DB layer.

### 2.6 ⛓️ Onchain & Offchain Modules

**🧑‍💻 Developers:** 2 Helios/JS Devs
**📦 Deliverables:**

* [ ] Minting, staking, swaps in Helios
* [ ] Offchain JS/PHP transaction builders
* [ ] Emulator test setup

**⏳ Duration:** 3 Weeks
**🎯 Outcome:** Complete Cardano transaction and script toolkit.

### 2.7 🤖 AI Integration

**🧑‍💻 Developers:** 1 AI Engineer
**📦 Deliverables:**

* [ ] AI helper for contract suggestions
* [ ] Live syntax/error tips

**⏳ Duration:** 2 Weeks
**🎯 Outcome:** Intelligent feedback loop during script development.

### 2.8 💡 VSCode Extension

**🧑‍💻 Developers:** 1 Extension Dev
**📦 Deliverables:**

* [ ] Autocomplete + syntax highlighting
* [ ] Inline compiler diagnostics

**⏳ Duration:** 2 Weeks
**🎯 Outcome:** Developer productivity enhancement.

### 2.9 🧩 **Coxylib Playground (New Feature)**

**🎯 Purpose:**
An **interactive sandbox** for developers to test Coxylib and Helios scripts directly in the browser.

**🧑‍💻 Developers:** 2 Frontend + 1 Backend + 1 AI Engineer
**📦 Deliverables:**

* [ ] Web-based UI (HTML/CSS/JS)
* [ ] Code editor with syntax highlighting
* [ ] Real-time execution of onchain/offchain scripts
* [ ] “AI Assistant” for explaining outputs/errors
* [ ] Local storage for user sessions

**⏳ Duration:** 3 Weeks
**🎯 Outcome:**
A live testing environment — **“Run, Debug, Learn”** for Coxylib developers.

## 3. Jimba Library

### 🧪 Overview

AI-powered testing library for Cardano/Helios applications.

| Component         | Deliverable                                                               | Duration  |
| ----------------- | ------------------------------------------------------------------------- | --------- |
| 🧩 Core Runner    | CLI test engine (`Jimba.run()`)                                           | 2 Weeks   |
| 🔢 Property Tests | Randomized + mutation testing                                             | 1.5 Weeks |
| 🗂️ Group Reports | JSON + HTML output                                                        | 1 Week    |
| 🧠 AI Automation  | 5 Modules (Suggestor, Property Generator, Explainer, Optimizer, Reporter) | 4 Weeks   |

**🎯 Outcome:**
A self-learning test suite capable of generating, refactoring, and explaining tests.

## 4. Shadow CLI Library

### ⚙️ Overview

Developer command-line tool for automation, project builds, and system integration.

| Feature     | Deliverables                                  | Duration |
| ----------- | --------------------------------------------- | -------- |
| 📖 Docs     | CLI commands, flags                           | 5 Days   |
| 🧪 Tests    | Argument + snapshot tests                     | 1 Week   |
| 🔌 Features | Plugin system + auto-update + AI command help | 2 Weeks  |

**🎯 Outcome:**
Unified CLI for Coxylib, Jimba, and Wallet workflows.

## 5. Coxy Wallet

### 💳 Overview

Wallet SDK + UI toolkit for ADA and tokens with decentralized capabilities.

| Feature            | Deliverables         | Developers | Duration |
| ------------------ | -------------------- | ---------- | -------- |
| 🧾 Docs            | API & user guides    | 2 Writers  | 2 Weeks  |
| 🧪 Tests           | Integration + mocks  | 2 Devs     | 2 Weeks  |
| 💸 Send/Receive    | Wallet UI            | 2 JS Devs  | 1 Week   |
| 🔑 Addresses       | Derive & validate    | 1 Dev      | 3 Days   |
| 🔍 Explorer        | Block/Tx viewer      | 1 Dev      | 1 Week   |
| 🧠 Mnemonics       | Backup & restore     | 1 Dev      | 1 Week   |
| 💎 Staking         | Delegation & rewards | 2 Devs     | 2 Weeks  |
| 🗳️ DRep/Voting    | Governance logic     | 1 Dev      | 2 Weeks  |
| 🎨 Token/NFT Mint  | Helios templates     | 2 Devs     | 2 Weeks  |
| 🛒 Token/NFT Sales | Auction/fixed sale   | 2 Devs     | 2 Weeks  |
| ⚖️ DEX             | Swap + pool          | 3 Devs     | 3 Weeks  |

**🎯 Outcome:**
A complete open-source wallet for Cardano — modular, testable, and DEX-ready.

## 6. Cross-Project Integrations

| Integration            | Description                     | Responsible   |
| ---------------------- | ------------------------------- | ------------- |
| 🧩 Coxylib ↔ Jimba     | Auto-testing of Coxylib modules | QA Team       |
| ⚙️ Shadow CLI ↔ Wallet | CLI-based wallet control        | CLI Team      |
| 🧠 Jimba AI ↔ All      | Test generation + explanations  | AI Team       |
| 💡 VSCode ↔ Coxylib    | Inline debugging                | Extension Dev |
| 🗄️ DB ↔ PHP API       | Tx sync and session handling    | Backend Dev   |

## 7. Developer Roles

| Role                | Responsibilities                           |
| ------------------- | ------------------------------------------ |
| 🧑‍🎨 Frontend Dev  | UI templates, playground, wallet interface |
| ⚙️ Backend Dev      | PHP APIs, MySQL integration                |
| 🧠 AI Engineer      | Jimba AI modules, Coxylib Playground AI    |
| 🔥 Helios Dev       | Smart contract logic                       |
| 🧪 QA Engineer      | Test automation & coverage                 |
| 🧾 Technical Writer | Docs & tutorials                           |
| 🧰 CLI Dev          | Shadow CLI utilities                       |
| 🧩 Extension Dev    | VSCode tooling                             |
| 🧭 Project Manager  | Timeline & task coordination               |

## 8. Milestones & Timelines

### 🗓️ **Phase 1 (Weeks 1–6): Core Foundations**

* [x] Coxylib Core + Docs
* [x] Jimba Core Test Runner
* [x] Shadow CLI Base

### 🗓️ **Phase 2 (Weeks 7–12): Integrations**

* [x] Jimba AI Modules
* [x] Coxylib PHP + MySQL
* [x] Coxy Wallet Alpha

### 🗓️ **Phase 3 (Weeks 13–18): Advanced Features**

* [ ] Coxylib Playground
* [ ] Coxy Wallet DEX & Governance
* [ ] VSCode Extension

### 🗓️ **Phase 4 (Weeks 19–24): Stabilization**

* [ ] Full Documentation
* [ ] QA Testing & Reports
* [ ] Deployment + CI/CD Pipelines

## ✅ Summary Chart

| Project        | Duration     | Status         | Key Deliverables       |
| -------------- | ------------ | -------------- | ---------------------- |
| 🧩 Coxylib     | 12 Weeks     | ⏳ In Progress  | Playground, AI, VSCode |
| 🧪 Jimba       | 8 Weeks      | 🧠 AI Active   | Test Generation        |
| ⚙️ Shadow CLI  | 4 Weeks      | ⏳ Pending      | Plugins, Auto-update   |
| 💳 Coxy Wallet | 12 Weeks     | 🚧 In Dev      | DEX + Staking          |
| **Total**      | **24 Weeks** | **🟢 Ongoing** | Unified Ecosystem      |
