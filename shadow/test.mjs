// test.mjs (ESM)
import assert from 'assert';
import { execFileSync } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

// Polyfill __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to your CLI script
const cliPath = path.resolve(__dirname, 'shadow.mjs');

/**
 * Execute the CLI with given command and arguments, return stdout trimmed,
 * stripping blank lines and leading "🚀" banners.
 */
function runCLI(cmd, args = [], options = {}) {
  const raw = execFileSync('node', [cliPath, cmd, ...args], { encoding: 'utf8', ...options });
  return raw
    .split(/\r?\n/)
    .filter(line => line.trim() !== '' && !line.startsWith('🚀'))
    .join('\n')
    .trim();
}

function hexToBinFixed(hexStr) {
  return Buffer.from(hexStr, 'hex')
    .map(b => b.toString(2).padStart(8, '0'))
    .join(' ');
}

function binToHexFixed(binStr) {
  return binStr.trim()
    .split(/\s+/)
    .map(b => {
      if (!/^[01]{8}$/.test(b)) throw new Error(`Invalid binary byte: ${b}`);
      return parseInt(b, 2).toString(16).padStart(2, '0');
    })
    .join('');
}

function logOK(msg) {
  console.log(`✔ ${msg}`);
}

try {
  // 1) Conversion round-trips
  const text = 'hello world';
  // hex
  const hex = runCLI('hex-encode', [text]);
  assert.strictEqual(hex, Buffer.from(text, 'utf8').toString('hex'));
  assert.strictEqual(runCLI('hex-decode', [hex]), text);
  logOK('hex-encode/decode');

  // binary
  const bin = runCLI('str-to-bin', [text]);
  assert.strictEqual(runCLI('bin-to-str', [bin]), text);
  logOK('str-to-bin/bin-to-str');

  // hex⇄bin (with fixed test logic)
  const hexText = Buffer.from(text, 'utf8').toString('hex');
  const expectedBin = hexToBinFixed(hexText);
  const actualBin = runCLI('hex-to-bin', [hexText]);
  assert.strictEqual(actualBin, expectedBin);
  const reconverted = runCLI('bin-to-hex', [expectedBin]);
  assert.strictEqual(reconverted, hexText);
  logOK('hex-to-bin/bin-to-hex');

  // str⇄hex
  const hexed = runCLI('str-to-hex', [text]);
  assert.strictEqual(runCLI('hex-to-str', [hexed]), text);
  logOK('str-to-hex/hex-to-str');

  // 2) Bech32
  const address = 'addr_test1qpje45y079ec27zzm3hchvqs2ffmjufa9e0rwrxt3qxk65z3z292awym27zev4yr3qrdgzadtamztznka2y62l7kzlwstpsfxn';
  const upper = address.toUpperCase();
  const bHex = runCLI('addrBech32-to-binary', [address]);
  const hHex = runCLI('addrBech32-to-hex', [address]);
  assert.strictEqual(bHex, hHex);
  logOK('addrBech32-to-binary/hex consistency');

  const pkh = runCLI('addrBech32-to-pkh', [address]);
  assert.strictEqual(pkh.length, 56);
  logOK('addrBech32-to-pkh length');

  assert.strictEqual(runCLI('addrBech32-to-address', [upper]), address);
  logOK('addrBech32-to-address normalization');

  // 3) Signing & Verification
  runCLI('gen-keys', ['123']);
  const msgHex = Buffer.from(text, 'utf8').toString('hex');
  const sigHex = runCLI('signHex', [msgHex, 'keys/payment.skey']).match(/Signature: (\w+)/)[1];
  assert.ok(/^✅/.test(runCLI('verifyHex', [msgHex, sigHex, 'keys/payment.vkey'])));
  logOK('signHex/verifyHex');

  const sigMsg = runCLI('signMessage', [text, 'keys/payment.skey']).match(/🖋 Signature: (\w+)/)[1];
  assert.ok(/^✅/.test(runCLI('verifyHex', [text, sigMsg, 'keys/payment.vkey'])));
  logOK('signMessage/verifyHex');

  // 4) Wallet & Compile
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'cli-test-'));
  runCLI('gen-wallet', [], { cwd: tmp });
  [
    'wallet.json',
    'payment.testnet.addr',
    'stake.testnet.addr',
    'payment.skey',
    'payment.vkey',
    'staking.skey',
    'staking.vkey'
  ].forEach(f => assert.ok(fs.existsSync(path.join(tmp, f)), `Missing ${f}`));
  logOK('gen-wallet testnet files');

  runCLI('gen-wallet', ['--mainnet'], { cwd: tmp });
  assert.ok(fs.existsSync(path.join(tmp, 'payment.mainnet.addr')));
  assert.ok(fs.existsSync(path.join(tmp, 'stake.mainnet.addr')));
  logOK('gen-wallet mainnet files');

  const contract = 'validator main(_,_,_) = True';
  const hl = path.join(tmp, 'alwaysTrue.hl');
  fs.writeFileSync(hl, contract);
  const out = runCLI('compile', ['alwaysTrue.hl'], { cwd: tmp });
  ['alwaysTrue.plutus', 'alwaysTrue.hash', 'alwaysTrue.testnet.addr']
    .forEach(f => assert.ok(fs.existsSync(path.join(tmp, f)), `Missing ${f}`));
  assert.ok(/✅ Contract compiled/.test(out));
  logOK('compile default');

  const outStk = runCLI('compile', ['alwaysTrue.hl', '--staking'], { cwd: tmp });
  const savedAddr = fs.readFileSync(path.join(tmp, 'alwaysTrue.testnet.addr'), 'utf8');
  assert.ok(savedAddr.startsWith('stake_test'));
  assert.ok(/Staking Address/.test(outStk));
  logOK('compile --staking');

  const outNft = runCLI('compile', ['alwaysTrue.hl', '--nft'], { cwd: tmp });
  assert.ok(/NFT Policy ID/.test(outNft));
  logOK('compile --nft');

  console.log('\n🎉 All tests passed!');
  process.exit(0);
} catch (err) {
  console.error(`\n✖ Test failed: ${err.message}`);
  process.exit(1);
}
