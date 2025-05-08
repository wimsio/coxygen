import { execSync } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';

// Path to the CLI script
const cliPath = path.resolve(__dirname, '../shadow.mjs');

/**
 * Execute the CLI with given command and arguments, returning stdout trimmed.
 * @param {string} command - The CLI command (e.g., 'hex-encode').
 * @param {string[]} args - Array of arguments for the command.
 * @param {object} options - execSync options (e.g., cwd).
 * @returns {string} - Trimmed stdout output.
 */
function runCLI(command, args = [], options = {}) {
  const fullCommand = ['node', cliPath, command, ...args].join(' ');
  return execSync(fullCommand, { encoding: 'utf8', ...options }).trim();
}

describe('Shadow CLI Conversion Commands', () => {
  const text = 'hello world';

  test('hex-encode and hex-decode roundtrip', () => {
    const encoded = runCLI('hex-encode', [text]);
    expect(encoded).toBe(Buffer.from(text, 'utf8').toString('hex'));

    const decoded = runCLI('hex-decode', [encoded]);
    expect(decoded).toBe(text);
  });

  test('str-to-bin and bin-to-str roundtrip', () => {
    const bin = runCLI('str-to-bin', [text]);
    const expectedBin = text
      .split('')
      .map(c => c.charCodeAt(0).toString(2).padStart(8, '0'))
      .join(' ');
    expect(bin).toBe(expectedBin);

    const backToText = runCLI('bin-to-str', [bin]);
    expect(backToText).toBe(text);
  });

  test('hex-to-bin and bin-to-hex roundtrip', () => {
    const hexText = Buffer.from(text, 'utf8').toString('hex');
    const bin = runCLI('hex-to-bin', [hexText]);
    const expectedBin = Buffer.from(hexText, 'hex')
      .map(b => b.toString(2).padStart(8, '0'))
      .join(' ');
    expect(bin).toBe(expectedBin);

    const backToHex = runCLI('bin-to-hex', [bin]);
    expect(backToHex).toBe(hexText);
  });

  test('str-to-hex and hex-to-str roundtrip', () => {
    const hexed = runCLI('str-to-hex', [text]);
    expect(hexed).toBe(Buffer.from(text, 'utf8').toString('hex'));

    const str = runCLI('hex-to-str', [hexed]);
    expect(str).toBe(text);
  });
});

describe('Shadow CLI Bech32 Commands with Fixed Address', () => {
  const address = 'addr_test1qpje45y079ec27zzm3hchvqs2ffmjufa9e0rwrxt3qxk65z3z292awym27zev4yr3qrdgzadtamztznka2y62l7kzlwstpsfxn';
  const upperAddress = address.toUpperCase();
  let binaryHex;
  let pubKeyHashHex;

  test('addrBech32-to-binary and addrBech32-to-hex produce same hex', () => {
    const binHex = runCLI('addrBech32-to-binary', [address]);
    const hexHex = runCLI('addrBech32-to-hex', [address]);
    expect(binHex).toBe(hexHex);
    binaryHex = binHex;
  });

  test('addrBech32-to-pkh outputs slice of binary hex', () => {
    pubKeyHashHex = runCLI('addrBech32-to-pkh', [address]);
    const expectedPkh = binaryHex.substr(2, 56);
    expect(pubKeyHashHex).toBe(expectedPkh);
  });

  test('addrBech32-to-address normalizes uppercase Bech32', () => {
    const normalized = runCLI('addrBech32-to-address', [upperAddress]);
    expect(normalized).toBe(address);
  });
});

describe('Shadow CLI Signing and Verification', () => {
  const plainText = 'hello world';
  let signatureHex;
  let signatureMsg;

  beforeAll(() => {
    // Generate keys with a fixed seed for repeatability
    runCLI('gen-keys', ['123']);
  });

  test('signHex produces a signature for hex message', () => {
    const msgHex = Buffer.from(plainText, 'utf8').toString('hex');
    const output = runCLI('signHex', [msgHex, 'keys/payment.skey']);
    const match = output.match(/Signature: (\w+)/);
    expect(match).not.toBeNull();
    signatureHex = match[1];
  });

  test('verifyHex validates the hex signature', () => {
    const msgHex = Buffer.from(plainText, 'utf8').toString('hex');
    const result = runCLI('verifyHex', [msgHex, signatureHex, 'keys/payment.vkey']);
    expect(result).toContain('✅ Signature valid');
  });

  test('verifyHex rejects an altered hex signature', () => {
    const badSig = signatureHex.slice(0, -1) + (signatureHex.slice(-1) === '0' ? '1' : '0');
    const msgHex = Buffer.from(plainText, 'utf8').toString('hex');
    const result = runCLI('verifyHex', [msgHex, badSig, 'keys/payment.vkey']);
    expect(result).toContain('❌ Signature INVALID');
  });

  test('signMessage produces a signature for plaintext', () => {
    const output = runCLI('signMessage', [plainText, 'keys/payment.skey']);
    const match = output.match(/🖋 Signature: (\w+)/);
    expect(match).not.toBeNull();
    signatureMsg = match[1];
  });

  test('verifyHex validates the plaintext signature', () => {
    const result = runCLI('verifyHex', [plainText, signatureMsg, 'keys/payment.vkey']);
    expect(result).toContain('✅ Signature valid');
  });

  test('verifyHex rejects an altered plaintext signature', () => {
    const badSig = signatureMsg.slice(0, -1) + (signatureMsg.slice(-1) === '0' ? '1' : '0');
    const result = runCLI('verifyHex', [plainText, badSig, 'keys/payment.vkey']);
    expect(result).toContain('❌ Signature INVALID');
  });
});

describe('Shadow CLI Wallet & Compile Commands', () => {
  let tmpDir;

  beforeAll(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cli-test-'));
  });

  test('gen-wallet creates expected wallet files', () => {
    runCLI('gen-wallet', [], { cwd: tmpDir });
    const expectedFiles = [
      'wallet.json',
      'payment.testnet.addr',
      'stake.testnet.addr',
      'payment.skey',
      'payment.vkey',
      'staking.skey',
      'staking.vkey'
    ];
    expectedFiles.forEach(file => {
      expect(fs.existsSync(path.join(tmpDir, file))).toBe(true);
    });
    const wallet = JSON.parse(fs.readFileSync(path.join(tmpDir, 'wallet.json'), 'utf8'));
    expect(typeof wallet.mnemonic).toBe('string');
    expect(wallet).toHaveProperty('payment.pubKeyHash');
    expect(wallet).toHaveProperty('payment.address');
  });

  test('gen-wallet --mainnet labels output as mainnet', () => {
    runCLI('gen-wallet', ['--mainnet'], { cwd: tmpDir });
    expect(fs.existsSync(path.join(tmpDir, 'payment.mainnet.addr'))).toBe(true);
    expect(fs.existsSync(path.join(tmpDir, 'stake.mainnet.addr'))).toBe(true);
  });

  test('compile generates .plutus, .hash, and .addr files', () => {
    const contractContent = 'validator main(_,_,_) = True';
    const hlPath = path.join(tmpDir, 'alwaysTrue.hl');
    fs.writeFileSync(hlPath, contractContent);

    const output = runCLI('compile', ['alwaysTrue.hl'], { cwd: tmpDir });
    expect(fs.existsSync(path.join(tmpDir, 'alwaysTrue.plutus'))).toBe(true);
    expect(fs.existsSync(path.join(tmpDir, 'alwaysTrue.hash'))).toBe(true);
    expect(fs.existsSync(path.join(tmpDir, 'alwaysTrue.testnet.addr'))).toBe(true);
    expect(output).toContain('✅ Contract compiled: alwaysTrue.plutus');
  });

  test('compile with --staking uses stake address prefix', () => {
    const output = runCLI('compile', ['alwaysTrue.hl', '--staking'], { cwd: tmpDir });
    const addr = fs.readFileSync(path.join(tmpDir, 'alwaysTrue.testnet.addr'), 'utf8');
    expect(addr.startsWith('stake_test')).toBe(true);
    expect(output).toContain('Staking Address');
  });

  test('compile with --nft logs NFT Policy ID', () => {
    const output = runCLI('compile', ['alwaysTrue.hl', '--nft'], { cwd: tmpDir });
    expect(output).toContain('NFT Policy ID:');
  });
});
