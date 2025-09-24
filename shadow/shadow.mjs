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
    bytesToText,
    Ed25519
} from "./helios-min.mjs";

const args = process.argv.slice(2);

const command = args[0];

const IS_MAINNET = args.includes("--mainnet");

const IS_STAKING = args.includes("--staking");

const IS_NFT = args.includes("--nft");

const NETWORK_LABEL = IS_MAINNET ? "mainnet" : "testnet";

const HELP_TEXT = `
Shadow CLI Toolkit

Usage: At the root folder terminal type node followed by the file shadow.mjs the command 
e.g. addrBech32-to-pkh followed by the parameter <bech32> 
e.g. addr_test1qpn...7jfu7jrr4vqw3zfl4
answer: pubkeyhash example: 6779594...b98b83c94

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
  signHex <hex> <payment.skey>      Sign a hex message
  signMessage "text" <payment.skey>  
  verifyHex <hex> <sigHex> <vkey>      Verify a Hex signed message

📦 Bech32 Tools:
  addrBech32-to-pkh <addr>                  Extract pubKeyHash from bech32 address
  addrBech32-to-binary <addr>               Get binary bytes of bech32 address
  addrBech32-to-hex <addr>                  Get hex of bech32 address
  addrBech32-to-address <addr>              Normalize a bech32 address

🌐 Network Flags:
  --mainnet                      Use mainnet (default is testnet)
  --staking                      Use staking address format (compile)
  --nft                          Mark script as NFT policy
  --show-cli                     Print suggested CLI command

  --help                         Show this help message

List of commands and arguments:

  node shadow.mjs gen-wallet [--mainnet]
  node shadow.mjs compile <contract.hl> [--mainnet] [--staking] [--nft] [--show-cli]
  node shadow.mjs addrBech32-to-pkh <bech32>
  node shadow.mjs addrBech32-to-binary <bech32>
  node shadow.mjs addrBech32-to-hex <bech32>
  node shadow.mjs addrBech32-to-address <bech32>
  node shadow.mjs gen-keys [seed] [--mainnet]
  node shadow.mjs signHex <hex-msg> <payment.skey>
  node shadow.mjs verifyHex <hex-msg> <signature> <payment.vkey>
  node shadow.mjs hex-encode "Hello world"
  node shadow.mjs hex-decode 48656c6c6f20776f726c64
  node shadow.mjs str-to-bin "text"
  node shadow.mjs bin-to-str "01110100 01100101 01111000 01110100"
  node shadow.mjs hex-to-bin 74657874
  node shadow.mjs bin-to-hex "01110100 01100101 01111000 01110100" 
  node helios-bech32-cli.js to-bech32 <pubKeyHash-hex> [--mainnet]
  node shadow.mjs str-to-hex <string>
  node shadow.mjs hex-to-str <hex>
  node shadow.mjs signMessage "hello world" payment.skey


`;

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
    const entropy = Array.from({
        length: 32
    }, () => Math.floor(Math.random() * 256));
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

// function compileContract(fileName="always_succeed.hl") {

//     const baseDir = path.resolve("scripts");

//     const filePath = path.join(baseDir, fileName);

//     if (!fs.existsSync(filePath)) {
//         throw new Error(`Contract not found: ${filePath}`);
//     }

//     const src = fs.readFileSync(filePath, "utf8");
//     const base = path.basename(filePath, ".hl");

//     const program = Program.new(src);
//     const uplc = program.compile(true);
//     const cborBytes = uplc.toCbor();
//     const cborHex = bytesToHex(cborBytes);

//     const hash = Crypto.blake2b(cborBytes, 28);
//     const validatorHash = new ValidatorHash(hash);
//     const scriptHash = bytesToHex(hash);

//     let addr;
//     if (IS_STAKING) {
//         addr = StakeAddress.fromValidatorHash(!IS_MAINNET, validatorHash).toBech32();
//     } else {
//         addr = Address.fromHash(validatorHash, !IS_MAINNET).toBech32();
//     }

//     fs.writeFileSync(`${base}.plutus`, JSON.stringify({
//         type: "PlutusScriptV2",
//         description: IS_NFT ? "CIP-68 NFT Policy Script" : "",
//         cborHex
//     }, null, 2));

//     fs.writeFileSync(`${base}.hash`, scriptHash);
//     fs.writeFileSync(`${base}.${NETWORK_LABEL}.addr`, addr);

//     console.log(`✅ Contract compiled: ${base}.plutus`);
//     console.log(`🔗 Hash: ${scriptHash}`);
//     console.log(`🏷️  ${IS_STAKING ? "Staking" : "Validator"} Address: ${addr}`);

//     if (IS_NFT) {
//         console.log("🪙 NFT Policy ID:", scriptHash);
//     }
// }
function compileContract(fileName = "always_succeed.hl") {
    const baseDir = path.resolve("scripts");
    const targetName = fileName.endsWith(".hl") ? path.basename(fileName) : `${path.basename(fileName)}.hl`;
    const filePath = path.join(baseDir, targetName);

    if (!fs.existsSync(filePath)) {
        throw new Error(`Contract not found: ${filePath}`);
    }

    const src = fs.readFileSync(filePath, "utf8");
    const base = path.basename(filePath, ".hl");
    const out = (ext) => path.join(path.dirname(filePath), `${base}${ext}`);

    const program = Program.new(src);
    const uplc = program.compile(true);
    const cborBytes = uplc.toCbor();
    const cborHex = bytesToHex(cborBytes);

    const hash = Crypto.blake2b(cborBytes, 28);
    const validatorHash = new ValidatorHash(hash);
    const scriptHash = bytesToHex(hash);

    const addr = IS_STAKING
        ? StakeAddress.fromValidatorHash(!IS_MAINNET, validatorHash).toBech32()
        : Address.fromHash(validatorHash, !IS_MAINNET).toBech32();

    fs.writeFileSync(
        out(".plutus"),
        JSON.stringify(
            {
                type: "PlutusScriptV2",
                description: IS_NFT ? "CIP-68 NFT Policy Script" : "",
                cborHex
            },
            null,
            2
        )
    );

    fs.writeFileSync(out(".hash"), scriptHash);
    fs.writeFileSync(out(`.${NETWORK_LABEL}.addr`), addr);

    console.log(`✅ Contract compiled: ${out(".plutus")}`);
    console.log(`🔗 Hash: ${scriptHash}`);
    console.log(`🏷️  ${IS_STAKING ? "Staking" : "Validator"} Address: ${addr}`);

    if (IS_NFT) {
        console.log("🪙 NFT Policy ID:", scriptHash);
    }
}


function hex(bytes) {
    return bytes.map(b => b.toString(16).padStart(2, '0')).join('');
}

function toBytes(hexStr) {
  const bytes = new Uint8Array(hexStr.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hexStr.substr(i * 2, 2), 16);
  }
  return bytes;
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
    fs.mkdirSync(path.dirname(filename), {
        recursive: true
    });
    fs.writeFileSync(filename, content);
}

function bech32ToBinary(addr) {
    const [_, bytes] = Crypto.decodeBech32(addr);
    return bytes;
}

function bech32ToPubKeyHash(addr) {
    return bech32ToBinary(addr).slice(1, 29);
}

function bech32ToHex(addr) {
    return hex(bech32ToBinary(addr));
}

function bech32ToAddress(addr) {
    return Address.fromBech32(addr);
}

function generatePrivateKey(seed = Date.now()) {
    const rng = Crypto.mulberry32(seed);
    return randomBytes(rng, 32);
}

function derivePublicKey(privateKey) {
    return Ed25519.derivePublicKey(privateKey);
}

function derivePaymentKeyHash(pubKey) {
    return Crypto.blake2b(pubKey, 28);
}

function makeHeliosAddress(pubKeyHashBytes, isTestnet = true) {
    const header = isTestnet ? 0b01100000 : 0b00000000;
    const payload = [header, ...pubKeyHashBytes];
    const addrBytes = new Uint8Array(payload);
    const bech32 = Crypto.encodeBech32(isTestnet ? 'addr_test' : 'addr', addrBytes);
    return Address.fromBech32(bech32);
}

function pubKeyHashToBech32Address(pubKeyHash, isTestnet = true) {
    const bytes = pubKeyHash.bytes;
    const header = isTestnet ? 0b01100000 : 0b00000000;
    const payload = [header, ...bytes];
    const addrBytes = new Uint8Array(payload);
    return Crypto.encodeBech32(isTestnet ? 'addr_test' : 'addr', addrBytes);
}

function exportSkeyVkey(priv, pub, addr, folder = "keys") {
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

function bytesToTextFunction(hexStr) {
    return Buffer.from(hexStr, "hex").toString("utf8");
}
function signMessage(messageInput, skeyPath) {
  const skey = JSON.parse(fs.readFileSync(skeyPath));
  const priv = toBytes(skey.cborHex.slice(4)); // NOW returns Uint8Array

  const msgBytes = /^[0-9a-f]+$/i.test(messageInput)
  ? Array.from(toBytes(messageInput))
  : Array.from(new TextEncoder().encode(messageInput));

  const sig = Ed25519.sign(priv, msgBytes);

  console.log("🚀 Signing...");
  console.log(`🖋 Signature: ${bytesToHex(sig)}`);
}

function signHexMessage(msgHex, skeyPath) {
    const msgBytes = toBytes(msgHex);
    const skey = JSON.parse(fs.readFileSync(skeyPath));
    const priv = toBytes(skey.cborHex.slice(4));

    const sig = Ed25519.sign(priv, msgBytes);

    console.log("🚀 Signing...");
    console.log(`🖋 Signature: ${bytesToHex(sig)}`);
}


function verifySignature(msg, sigHex, vkeyPath) {
    const sig = Uint8Array.from(toBytes(sigHex));
    const vkey = JSON.parse(fs.readFileSync(vkeyPath));
    const pub = Uint8Array.from(toBytes(vkey.cborHex.slice(4)));

    const isHex = /^[0-9a-fA-F]+$/.test(msg) && msg.length % 2 === 0;
    const msgBytes = isHex ? Uint8Array.from(toBytes(msg)) : new TextEncoder().encode(msg);

    if (sig.length !== 64) {
        console.error(`❌ Error: Signature length is ${sig.length}, expected 64 bytes`);
        process.exit(1);
    }

    const valid = Ed25519.verify(pub, msgBytes, sig);
    console.log(valid ? '✅ Signature valid' : '❌ Signature INVALID');
}

if (import.meta.url === `file://${process.argv[1]}`) {

    const [, , command, ...args] = process.argv;

    const isMainnet = args.includes('--mainnet');

    const addrArg = args.find(a => !a.startsWith('--'));

    console.log("\n🚀" + command + " :");

    if (command === 'addrBech32-to-pkh') {
        const pkh = bech32ToPubKeyHash(addrArg);
        console.log(hex(pkh));
    } else if (command === 'addrBech32-to-binary') {
        console.log(hex(bech32ToBinary(addrArg)));
    } else if (command === 'addrBech32-to-hex') {
        console.log(bech32ToHex(addrArg));
    } else if (command === 'addrBech32-to-address') {
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
    } else if (command === 'signHex') {
        const [msg, skey] = args;
        signHexMessage(msg, skey);
      } else if (command === 'signMessage') {
        const [text, skeyPath] = args;
        if (!text || !skeyPath) {
          console.error("❌ Usage: node shadow.mjs signMessage \"message\" payment.skey");
          process.exit(1);
        }
        signMessage(text, skeyPath);
      
      } else if (command === 'verifyMessage') {
        const [text, sigHex, vkeyPath] = args;
        if (!text || !sigHex || !vkeyPath) {
          console.error("❌ Usage: node shadow.mjs verifyMessage \"message\" signatureHex payment.vkey");
          process.exit(1);
        }
        verifyMessage(text, sigHex, vkeyPath);
            

    } else if (command === 'verifyHex' || command === 'verify') {
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
    } else if (!command || args.includes("--help")) {
        console.log(FULL_HELP);
        console.log(HELP_TEXT);
        process.exit(0);
    } else if (command === "gen-wallet") {
        genWallet();
    } else if (command === "compile") {
        const filePath = args[0];
        if (!filePath) {
            console.error("❌ Please specify a .hl contract file to compile.");
            process.exit(1);
        }
        compileContract(filePath);
    } else if (command === 'bytes-to-text') {
        const [hexStr] = args;
        console.log("🚀 bytes-to-text :");
        console.log(bytesToText(hexStr));

    } else if (command === "--help") {
        console.log(HELP_TEXT);
        process.exit(0);
    }
}