# **Helios Transaction Body Building**

*Learn how to build, inspect, and understand Cardano transaction bodies using the Helios JavaScript library. This guide covers simple ADA transfers, advanced Plutus smart contract transactions, and every relevant feature in the Helios `TxBody`.*

---

## **Table of Contents**

1. [Introduction](#introduction)
2. [Prerequisites](#prerequisites)
3. [The Structure of a Helios Transaction](#the-structure-of-a-helios-transaction)

   * 3.1 [TxBody Overview](#txbody-overview)
   * 3.2 [Key Fields and Features](#key-fields-and-features)
4. [Basic ADA Transfer Transaction](#basic-ada-transfer-transaction)

   * 4.1 [Source Code](#source-code-basic-ada)
   * 4.2 [Explanation](#explanation-basic-ada)
5. [Advanced Transaction: Plutus Script Spend](#advanced-transaction-plutus-script-spend)

   * 5.1 [Source Code](#source-code-plutus)
   * 5.2 [Explanation](#explanation-plutus)
6. [Deep Dive: TxBody Fields](#deep-dive-txbody-fields)

   * 6.1 [Inputs](#inputs)
   * 6.2 [Outputs](#outputs)
   * 6.3 [Fee](#fee)
   * 6.4 [Signers](#signers)
   * 6.5 [Scripts](#scripts)
   * 6.6 [Datums](#datums)
   * 6.7 [Redeemers](#redeemers)
   * 6.8 [Collateral](#collateral)
   * 6.9 [Minted Assets](#minted-assets)
   * 6.10 [Certificates](#certificates)
   * 6.11 [Reference Inputs](#reference-inputs)
   * 6.12 [Validity Range](#validity-range)
7. [Inspecting and Serializing Transactions](#inspecting-and-serializing-transactions)
8. [FAQ & Common Issues](#faq--common-issues)
9. [References](#references)

---

## 1. **Introduction**

Helios is a powerful JavaScript library for building Cardano smart contracts and transactions. Understanding how to construct and inspect a `TxBody` is essential for any on-chain developer.

---

## 2. **Prerequisites**

* Node.js & npm
* Helios library (`helios.js` or installed via npm)
* Familiarity with Cardano concepts: UTxOs, addresses, CBOR
* A funded testnet wallet for running real transactions

---

## 3. **The Structure of a Helios Transaction**

### 3.1 **TxBody Overview**

In Helios, a `TxBody` contains all information about a Cardano transaction—inputs, outputs, fees, signers, scripts, etc. It forms the core of the transaction, to be signed and submitted.

### 3.2 **Key Fields and Features**

* **inputs**: UTxOs to spend
* **outputs**: Where assets go
* **fee**: Transaction fee in Lovelace
* **signers**: List of required public key hashes
* **scripts**: Smart contract code (if used)
* **datums**: Data attached to outputs or scripts
* **redeemers**: Data to unlock scripts
* **collateral**: UTxOs used as fallback for scripts
* **minted**: Info on tokens minted/burned
* **dcerts**: Delegation certificates for staking
* **refInputs**: Reference UTxOs (advanced)
* **validity range**: Min/max slot for validity

---

## 4. **Basic ADA Transfer Transaction**

### 4.1 **Source Code** <a name="source-code-basic-ada"></a>

```js
import { 
  RootPrivateKey, Address, Value, Tx, TxOutput 
} from 'helios.js';

// 1. Prepare sender keys and address
const mnemonic = 'your 24-word mnemonic here';
const rootKey = RootPrivateKey.fromPhrase(mnemonic);
const senderKey = rootKey.deriveSpendingKey(0, 0);
const senderPkh = senderKey.derivePubKey().pubKeyHash;
const senderAddr = Address.fromPubKeyHash(senderPkh);

// 2. Prepare recipient address (Bech32)
const recipientBech32 = 'addr_test1...';
const recipientAddr = Address.fromBech32(recipientBech32);

// 3. Query UTXOs for sender
const utxos = await getAllTxInputs(senderAddr);
const amount = BigInt(2_000_000);
const selectedUtxo = utxos.find(u => u.value.lovelace >= amount);

// 4. Build transaction
const txBuilder = Tx.new()
  .addInput(selectedUtxo)
  .addOutput(new TxOutput(recipientAddr, new Value(amount)))
  .addSigner(senderPkh);

const estimateFees = txBuilder.estimateFee(NETWORK_PARAMS);

// 5. Finalize and sign
const unsignedTx = await txBuilder.finalize(NETWORK_PARAMS, senderAddr, utxos.filter(u => !u.eq(selectedUtxo)));
unsignedTx.addSignature(senderKey.sign(unsignedTx.bodyHash));

// 6. Submit
const txId = await BLOCKFROST.submitTx(unsignedTx);

console.log({txId});
```

### 4.2 **Explanation** <a name="explanation-basic-ada"></a>

* **Inputs/Outputs**: Select a UTXO to spend, create a new output for the recipient.
* **Signers**: Only the sender’s key is needed for a basic ADA transfer.
* **Fee**: Estimated and included automatically.
* **No scripts, datums, redeemers, or collateral** are involved in this simple tx.

---

## 5. **Advanced Transaction: Plutus Script Spend**

### 5.1 **Source Code** <a name="source-code-plutus"></a>

```js
import { 
  Tx, TxOutput, Value, Address, RootPrivateKey, 
  PlutusScript, Data, Redeemer 
} from 'helios.js';

// 1. Prepare Plutus script and script address
const script = new PlutusScript("...cbor hex...");
const scriptAddr = Address.fromScript(script, true);

// 2. Find a script UTxO
const scriptUtxos = await getAllTxInputs(scriptAddr);
const utxo = scriptUtxos[0]; // Pick the UTxO to spend

// 3. Prepare datum and redeemer
const datum = Data.fromJson({ myField: 123 });     // or Data.fromCbor(...)
const redeemer = Redeemer.fromJson({ action: "spend" });

// 4. Prepare recipient and collateral
const recipientBech32 = "addr_test1...";
const recipientAddr = Address.fromBech32(recipientBech32);
const recipientValue = new Value(BigInt(2_000_000));
const collateralUtxo = await selectCollateralUtxo(senderAddr);

// 5. Build the transaction
const txBuilder = Tx.new()
  .addInput(utxo)
  .addOutput(new TxOutput(recipientAddr, recipientValue))
  .addScript(script)
  .addDatum(datum)
  .addRedeemer(redeemer)
  .addSigner(senderPkh)
  .addCollateral(collateralUtxo);

// 6. Finalize, sign, and submit
const unsignedTx = await txBuilder.finalize(NETWORK_PARAMS, senderAddr, []);
unsignedTx.addSignature(senderKey.sign(unsignedTx.bodyHash));
const txId = await BLOCKFROST.submitTx(unsignedTx);

console.log({txId});
```

### 5.2 **Explanation** <a name="explanation-plutus"></a>

* **inputs**: Script UTxO is spent (needs script, datum, redeemer).
* **outputs**: Sends funds to recipient.
* **scripts**: The Plutus validator script.
* **datums**: Data originally locked at the script address.
* **redeemers**: Data provided to unlock the script.
* **collateral**: UTxO that will be consumed if the script fails.
* **signers**: The transaction must be signed by the required party.
* **fee, validity range**: Handled automatically or set as needed.

---

## 6. **Deep Dive: TxBody Fields**

### 6.1 **Inputs**

* **Array of `TxInput`** objects, each referencing a previous UTxO by id.
* **Mandatory for all txs.**

### 6.2 **Outputs**

* **Array of `TxOutput`** objects: destination address, amount, and (optionally) a datum.
* **Every transaction must create at least one output.**

### 6.3 **Fee**

* **ADA fee** paid to miners, required for all txs.

### 6.4 **Signers**

* **Array of PubKeyHash**: the addresses required to sign the tx.
* **Must match actual signatures in witnesses.**

### 6.5 **Scripts**

* **Array of Plutus scripts** (serialized).
* **Used when spending from or paying to a script address, or minting tokens.**

### 6.6 **Datums**

* **Array/ListData** of additional data objects.
* **Used in script UTxOs and advanced outputs.**

### 6.7 **Redeemers**

* **Array of data** used to unlock script outputs.
* **Required for script spends.**

### 6.8 **Collateral**

* **Array of inputs** used as fallback for failed script txs.

### 6.9 **Minted Assets**

* **Records of tokens** minted/burned in this transaction.
* **Requires minting policy scripts and matching signatures.**

### 6.10 **Certificates (dcerts)**

* **Staking/delegation operations** (e.g., registering a stake key, delegating).

### 6.11 **Reference Inputs**

* **Inputs used as read-only references**, not consumed, for reference scripts/datums.

### 6.12 **Validity Range**

* **Slots (firstValidSlot, lastValidSlot)** defining when tx is valid.

---

## 7. **Inspecting and Serializing Transactions**

* **To inspect:**

  ```js
  console.log(tx.body.inputs);
  console.log(tx.body.outputs);
  console.log(tx.body.datums);
  console.log(tx.body.redeemers);
  console.log(tx.body.scripts);
  ```

* **To serialize for submission:**

  ```js
  const txCbor = tx.toCbor(); // Hex or bytes
  await BLOCKFROST.submitTx(txCbor);
  ```

---

## 8. **FAQ & Common Issues**

| Problem                  | Solution                                           |
| ------------------------ | -------------------------------------------------- |
| Transaction rejected     | Check signatures and required witnesses            |
| “Missing redeemer” error | Add a redeemer for every script input              |
| CBOR deserialization     | Make sure to serialize tx to bytes/hex, not object |
| Fee too low              | Use `.estimateFee()` before finalizing             |
| Invalid collateral       | Ensure collateral UTxO meets network requirements  |
| Not enough signers       | Ensure `.addSigner()` matches the key used to sign |

---

## 9. **References**

* [Helios Official Documentation](https://www.hyperion-bt.org/helios-book/)
* [Cardano Transaction Structure (Docs)](https://docs.cardano.org/cardano-transactions/)
* [Cardano Serialization Library](https://github.com/Emurgo/cardano-serialization-lib)
* [Blockfrost API](https://blockfrost.io/)

---

# **Conclusion**

**Building Cardano transactions with Helios is flexible and powerful—** whether you’re doing simple ADA transfers or sophisticated dApp smart contract interactions. By understanding the structure and features of the `TxBody`, you can confidently build, inspect, and debug Cardano transactions.

---

