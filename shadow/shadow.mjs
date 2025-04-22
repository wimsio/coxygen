

import fs from "fs";
import path from "path";
import {
  RootPrivateKey,
  bytesToHex,
  Crypto,
  PubKeyHash,
  Program,
  Address,
  StakeAddress,
  ValidatorHash,
  BIP39_DICT_EN,
  bytesToText
} from "./helios-min.js";

const HELP_TEXT = `Shadow CLI Toolkit

    Usage: at the root folder terminal type node followed by the file shadow.mjs the the command e.g. to-pkh 
    followed by the parameter <bech32> e.g. addr_test1qpnhjk2v44axnvhlccuqhlmky09fgn0tvrjlrm6tnzure9qkm0guvx66e0lsh4s22y3ywp2zpkkvhnv2a7jfu7jrr4vqw3zfl4
    pubkeyhash example: 6779594cad7a69b2ffc6380bff7623ca944deb60e5f1ef4b98b83c94

    List of commands and arguments:

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


Commands:
  gen-wallet        Generate new payment/stake keys, addresses, mnemonic
  compile           Compile a Helios contract to .plutus, hash, and address
`;

const FULL_HELP = `
Usage: node shadow.mjs <command> [options]

🔑 Wallet & Contracts:
  gen-wallet                     Generate wallet with mnemonic, keys, and addresses
  compile <contract.hl>          Compile a Helios contract to .plutus, hash, and address

🧮 Encoding & Conversion:
  hex-encode "Hello"             Convert text to hex
  hex-decode <hex>               Convert hex to text
  str-to-bin <text>              Convert string to binary
  bin-to-str <binary>            Convert binary to text
  hex-to-bin <hex>               Convert hex to binary
  bin-to-hex <binary>            Convert binary to hex

🖋 Sign & Verify:
  sign <hex> <payment.skey>      Sign a hex message
  verify <hex> <sig> <vkey>      Verify a signed message

📦 Bech32 Tools:
  to-pkh <addr>                  Extract pubKeyHash from bech32 address
  to-binary <addr>               Get binary bytes of bech32 address
  to-hex <addr>                  Get hex of bech32 address
  to-address <addr>              Normalize a bech32 address

🌐 Network Flags:
  --mainnet                      Use mainnet (default is testnet)
  --staking                      Use staking address format (compile)
  --nft                          Mark script as NFT policy
  --show-cli                     Print suggested CLI command

  --help                         Show this help message
`;

const args = process.argv.slice(2);
const command = args[0];

const IS_MAINNET = args.includes("--mainnet");
const IS_STAKING = args.includes("--staking");
const IS_NFT = args.includes("--nft");
const SHOW_CLI = args.includes("--show-cli");
const NETWORK_LABEL = IS_MAINNET ? "mainnet" : "testnet";

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
}

function saveKeyPair(prefix, privKey, pubKey, role) {
  const privHex = bytesToHex(privKey.bytes);
  const pubHex = bytesToHex(pubKey.bytes);

  const skey = {
    type: `${role}SigningKeyShelley_ed25519`,
    description: `${role} Signing Key`,
    cborHex: `5820${privHex}`
  };

  const vkey = {
    type: `${role}VerificationKeyShelley_ed25519`,
    description: `${role} Verification Key`,
    cborHex: `5820${pubHex}`
  };

  fs.writeFileSync(`${prefix}.skey`, JSON.stringify(skey, null, 2));
  fs.writeFileSync(`${prefix}.vkey`, JSON.stringify(vkey, null, 2));
}

function genWallet() {
  const entropy = Array.from({ length: 32 }, () => Math.floor(Math.random() * 256));
  const rootKey = new RootPrivateKey(entropy);
  const mnemonic = rootKey.toPhrase(BIP39_DICT_EN);

  const paymentKey = rootKey.deriveSpendingKey(0, 0);
  const stakingKey = rootKey.deriveStakingKey(0, 0);

  const paymentPub = paymentKey.derivePubKey();
  const stakingPub = stakingKey.derivePubKey();

  const paymentHash = new PubKeyHash(Crypto.blake2b(paymentPub.bytes, 28));
  const stakingHash = new PubKeyHash(Crypto.blake2b(stakingPub.bytes, 28));

  const address = Address.fromHashes(paymentHash, stakingHash, !IS_MAINNET).toBech32();
  const stakeAddress = StakeAddress.fromPubKeyHash(!IS_MAINNET, stakingHash).toBech32();

  fs.writeFileSync("wallet.json", JSON.stringify({
    mnemonic,
    payment: {
      pubKeyHash: paymentHash.hex,
      address
    },
    staking: {
      pubKeyHash: stakingHash.hex,
      stakeAddress
    }
  }, null, 2));

  saveKeyPair("payment", paymentKey, paymentPub, "Payment");
  saveKeyPair("staking", stakingKey, stakingPub, "Stake");

  fs.writeFileSync(`payment.${NETWORK_LABEL}.addr`, address);
  fs.writeFileSync(`stake.${NETWORK_LABEL}.addr`, stakeAddress);

  console.log("✅ Wallet generated, keys saved.");
}

function compileContract(filePath) {
  const src = fs.readFileSync(filePath, "utf8");
  const base = path.basename(filePath, ".hl");

  const program = Program.new(src);
  const uplc = program.compile(true);
  const cborBytes = uplc.toCbor();
  const cborHex = bytesToHex(cborBytes);

  const hash = Crypto.blake2b(cborBytes, 28);
  const validatorHash = new ValidatorHash(hash);
  const scriptHash = bytesToHex(hash);

  let addr;
  if (IS_STAKING) {
    addr = StakeAddress.fromValidatorHash(!IS_MAINNET, validatorHash).toBech32();
  } else {
    addr = Address.fromHash(validatorHash, !IS_MAINNET).toBech32();
  }

  fs.writeFileSync(`${base}.plutus`, JSON.stringify({
    type: "PlutusScriptV2",
    description: IS_NFT ? "CIP-68 NFT Policy Script" : "",
    cborHex
  }, null, 2));

  fs.writeFileSync(`${base}.hash`, scriptHash);
  fs.writeFileSync(`${base}.${NETWORK_LABEL}.addr`, addr);

  console.log(`✅ Contract compiled: ${base}.plutus`);
  console.log(`🔗 Hash: ${scriptHash}`);
  console.log(`🏷️  ${IS_STAKING ? "Staking" : "Validator"} Address: ${addr}`);

  if (IS_NFT) {
    console.log("🪙 NFT Policy ID:", scriptHash);
  }

  if (SHOW_CLI) {
    console.log("\n📦 Suggested deployment command:");
    console.log(`cardano-cli transaction build \\`);
    console.log(`  --tx-in <TX_IN> \\`);
    console.log(`  --tx-out ${addr}+<LOVELACE> \\`);
    console.log(`  --change-address <WALLET_ADDR> \\`);
    console.log(`  --out-file tx.raw \\`);
    console.log(`  --alonzo-era \\`);
    console.log(`  --${IS_MAINNET ? "mainnet" : "testnet-magic 1"} \\`);
    console.log(`  --script-file ${base}.plutus \\`);
    console.log(`  --script-hash ${scriptHash}`);
  }
}


if (!command || args.includes("--help")) {
  console.log(FULL_HELP);
  console.log(HELP_TEXT);
  process.exit(0);
} else if (command === "gen-wallet") {
  genWallet();
} else if (command === "compile") {
  const filePath = args[1];
  if (!filePath) {
    console.error("❌ Please specify a .hl contract file to compile.");
    process.exit(1);
  }
  compileContract(filePath);
} else {
  console.log("❓ Unknown command\n");
  console.log(HELP_TEXT);
}

function hex(bytes) {
    return bytes.map(b => b.toString(16).padStart(2, '0')).join('');
}
function toBytes(hexStr) {
    return hexStr.match(/.{1,2}/g).map(b => parseInt(b, 16));
}
function encodeHex(str) {
    return Buffer.from(str, 'utf8').toString('hex');
}
function decodeHex(hexStr) {
    return Buffer.from(hexStr, 'hex').toString('utf8');
}
function strToBin(str) {
    return str.split('').map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
}
function binToStr(bin) {
    return bin.trim().split(/\s+/).map(b => String.fromCharCode(parseInt(b, 2))).join('');
}
function hexToBin(hexStr) {
    return toBytes(hexStr).map(b => b.toString(2).padStart(8, '0')).join(' ');
}
function binToHex(binStr) {
    return binStr.trim().split(/\s+/).map(b => parseInt(b, 2).toString(16).padStart(2, '0')).join('');
}
function strToHex(str) {
  return Buffer.from(str, 'utf8').toString('hex');
}

function hexToStr(hexStr) {
  return Buffer.from(hexStr, 'hex').toString('utf8');
}

function writeFileSyncSafe(filename, content) {
    fs.mkdirSync(path.dirname(filename), { recursive: true });
    fs.writeFileSync(filename, content);
}

export function bech32ToBinary(addr) {
    const [_, bytes] = Crypto.decodeBech32(addr);
    return bytes;
}

export function bech32ToPubKeyHash(addr) {
    return bech32ToBinary(addr).slice(1, 29);
}

export function bech32ToHex(addr) {
    return hex(bech32ToBinary(addr));
}

export function bech32ToAddress(addr) {
    return Address.fromBech32(addr);
}

export function generatePrivateKey(seed = Date.now()) {
    const rng = Crypto.mulberry32(seed);
    return randomBytes(rng, 32);
}

export function derivePublicKey(privateKey) {
    return Ed25519.derivePublicKey(privateKey);
}

export function derivePaymentKeyHash(pubKey) {
    return Crypto.blake2b(pubKey, 28);
}

export function makeHeliosAddress(pubKeyHashBytes, isTestnet = true) {
    const header = isTestnet ? 0b01100000 : 0b00000000;
    const payload = [header, ...pubKeyHashBytes];
    const addrBytes = new Uint8Array(payload);
    const bech32 = Crypto.encodeBech32(isTestnet ? 'addr_test' : 'addr', addrBytes);
    return Address.fromBech32(bech32);
}

export function pubKeyHashToBech32Address(pubKeyHash, isTestnet = true) {
  const bytes = pubKeyHash.bytes;
  const header = isTestnet ? 0b01100000 : 0b00000000;
  const payload = [header, ...bytes];
  const addrBytes = new Uint8Array(payload);
  return Crypto.encodeBech32(isTestnet ? 'addr_test' : 'addr', addrBytes);
}

export function exportSkeyVkey(priv, pub, addr, folder = "keys") {
    if (!fs.existsSync(folder)) fs.mkdirSync(folder);

    writeFileSyncSafe(`${folder}/payment.skey`, JSON.stringify({
        type: "PaymentSigningKeyShelley_ed25519",
        description: "Private signing key",
        cborHex: `5820${hex(priv)}`
    }, null, 2));

    writeFileSyncSafe(`${folder}/payment.vkey`, JSON.stringify({
        type: "PaymentVerificationKeyShelley_ed25519",
        description: "Public verification key",
        cborHex: `5820${hex(pub)}`
    }, null, 2));

    writeFileSyncSafe(`${folder}/payment.addr`, addr.toBech32());
    console.log(`🔐 Keys and address written to ${folder}/`);
}

export function signMessage(msgHex, skeyPath) {
    const msg = toBytes(msgHex);
    const skey = JSON.parse(fs.readFileSync(skeyPath));
    const priv = toBytes(skey.cborHex.slice(4));
    const sig = Ed25519.sign(priv, msg);
    console.log(`🖋 Signature: ${hex(sig)}`);
}

export function verifySignature(msgHex, sigHex, vkeyPath) {
    const msg = toBytes(msgHex);
    const sig = toBytes(sigHex);
    const vkey = JSON.parse(fs.readFileSync(vkeyPath));
    const pub = toBytes(vkey.cborHex.slice(4));
    const valid = Ed25519.verify(pub, msg, sig);
    console.log(valid ? '✅ Signature valid' : '❌ Signature INVALID');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [,, command, ...args] = process.argv;
  const isMainnet = args.includes('--mainnet');
  const addrArg = args.find(a => !a.startsWith('--'));

  console.log("🚀 CLI loaded with command:", command);

  if (!command || command === '--help') {
      console.log("\n🌑 Shadow CLI Help\nTry 'node helios-bech32-cli.js interactive' for guided mode.\n");
  }

  if (command === 'interactive') {
      const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

      function ask(question) {
          return new Promise(resolve => rl.question(question, resolve));
      }

      async function mainMenu() {
          console.log("\n🧠 Welcome to Shadow Interactive CLI\n");
          console.log("1. Wallet & Contracts\n2. Bech32 Tools\n3. Signing & Verification\n4. Encoding & Conversion\n0. Exit\n");
          const cat = await ask("Select a category [0-4]: ");
          switch (cat) {
              case '1':
                  console.log("\n1. Generate Wallet\n2. Compile Contract\n");
                  const wc = await ask("Choose [1-2]: ");
                  if (wc === '1') {
                      const net = await ask("Use mainnet? (y/N): ");
                      process.argv = ['node', 'helios-bech32-cli.js', 'gen-wallet', ...(net.toLowerCase() === 'y' ? ['--mainnet'] : [])];
                      await import('./helios-bech32-cli.js');
                  }
                  break;
              case '2':
                  console.log("\n1. Bech32 to pubKeyHash\n2. PubKeyHash to Bech32\n3. Bech32 Info\n");
                  const b2 = await ask("Choose [1-3]: ");
                  if (b2 === '1') {
                      const b = await ask("Bech32 address: ");
                      console.log(hex(bech32ToPubKeyHash(b)));
                  } else if (b2 === '2') {
                      const h = await ask("PubKeyHash hex: ");
                      console.log(pubKeyHashToBech32Address(new PubKeyHash(toBytes(h))));
                  } else if (b2 === '3') {
                      const b = await ask("Bech32 address: ");
                      const pkh = new PubKeyHash(bech32ToPubKeyHash(b));
                      console.log("🔑", pkh.hex);
                      console.log("🏷️", pubKeyHashToBech32Address(pkh));
                  }
                  break;
              case '3':
                  console.log("\n1. Sign Message\n2. Verify Signature\n");
                  const s = await ask("Choose [1-2]: ");
                  if (s === '1') {
                      const msg = await ask("Hex message: ");
                      const skey = await ask("Path to .skey: ");
                      signMessage(msg, skey);
                  } else if (s === '2') {
                      const msg = await ask("Hex message: ");
                      const sig = await ask("Hex signature: ");
                      const vkey = await ask("Path to .vkey: ");
                      verifySignature(msg, sig, vkey);
                  }
                  break;
              case '4':
                  console.log("\n1. hex-encode\n2. hex-decode\n3. str-to-bin\n4. bin-to-str\n5. hex-to-bin\n6. bin-to-hex\n");
                  const e = await ask("Choose [1-6]: ");
                  const input = await ask("Input: ");
                  const map = {
                      '1': encodeHex,
                      '2': decodeHex,
                      '3': strToBin,
                      '4': binToStr,
                      '5': hexToBin,
                      '6': binToHex,
                  };
                  console.log(map[e](input));
                  break;
              default:
                  console.log("👋 Exiting.");
          }
          rl.close();
      }

      mainMenu();
      //return;
  }
    if (command === 'to-pkh') {
        const pkh = bech32ToPubKeyHash(addrArg);
        console.log(hex(pkh));
    } else if (command === 'to-binary') {
        console.log(hex(bech32ToBinary(addrArg)));
    } else if (command === 'to-hex') {
        console.log(bech32ToHex(addrArg));
    } else if (command === 'to-address') {
        const addr = bech32ToAddress(addrArg);
        console.log(addr.toBech32());
    } else if (command === 'gen-keys') {
        const seedArg = parseInt(addrArg);
        const priv = generatePrivateKey(isNaN(seedArg) ? Date.now() : seedArg);
        const pub = derivePublicKey(priv);
        const pkh = derivePaymentKeyHash(pub);
        const addr = makeHeliosAddress(pkh, !isMainnet);
        console.log(`🔑 Payment Address: ${addr.toBech32()}`);
        exportSkeyVkey(priv, pub, addr);
    } else if (command === 'sign') {
        const [msg, skey] = args;
        signMessage(msg, skey);
    } else if (command === 'verify') {
        const [msg, sig, vkey] = args;
        verifySignature(msg, sig, vkey);
    } else if (command === 'hex-encode') {
        const [text] = args;
        console.log(encodeHex(text));
    } else if (command === 'hex-to-str') {
        const [hexStr] = args;
        console.log(hexToStr(hexStr));
    } else if (command === 'str-to-hex') {
        const [text] = args;
        console.log(strToHex(text));
    } else if (command === 'hex-decode') {
        const [hexStr] = args;
        console.log(decodeHex(hexStr));
    } else if (command === 'str-to-bin') {
        const [text] = args;
        console.log(strToBin(text));
    } else if (command === 'bin-to-str') {
        const [binStr] = args;
        console.log(binToStr(binStr));
    } else if (command === 'hex-to-bin') {
        const [hexStr] = args;
        console.log(hexToBin(hexStr));
    } else if (command === 'bin-to-hex') {
        const [binStr] = args;
        console.log(binToHex(binStr));
    } else {
        console.log(`\n
        Usage: at the root folder terminal type node followed by the file shadow.mjs the the command e.g. to-pkh 
        followed by the parameter <bech32> e.g. addr_test1qpnhjk2v44axnvhlccuqhlmky09fgn0tvrjlrm6tnzure9qkm0guvx66e0lsh4s22y3ywp2zpkkvhnv2a7jfu7jrr4vqw3zfl4
        pubkeyhash example: 6779594cad7a69b2ffc6380bff7623ca944deb60e5f1ef4b98b83c94

        List of commands and arguments:

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
        node shadow.mjs str-to-hex <string>
        node shadow.mjs hex-to-str <hex>

        \n`
    );
    }
}

