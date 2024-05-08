
import {
    Lucid
} from "https://unpkg.com/lucid-cardano/web/mod.js"
import {opt,o,jexpect,jit,jescribe,jtest,jtrics,gNo,gNull,tE,tS,jjj,jjj_, jj} from './jimba.js'

//switch on testing by setting On to 1 else set 0 for off
const On = 1;
const Off = 0;
opt._O = Off;
opt._T = On;
opt._F = On;
opt._M = On;
opt._FailsOnly = 0;
opt._Ob = Off;

export async function connectWallet() {
    tS("connectWallet")
    let lucid = null; jescribe("AIKEN TESTING",()=>{jit("lucid declared and null",()=>{jexpect(lucid).notNull()})})
    const w = window;  jjj("connectWallet","window is true",w,true);
    const wCardano = window.cardano;  jjj("connectWallet","wCardano is true",wCardano,true);
    const nami = window.cardano.nami;  jjj("connectWallet","wCardano",nami,'object()');
    const namiEnabled = window.cardano.nami; jjj("connectWallet","nami found",namiEnabled,true)
    const api = await window.cardano.nami.enable(); jjj("connectWallet","nami enabled in the browser extension",api,true)
    
    if (typeof window.cardano == 'undefined' || typeof window.cardano.nami == 'undefined') {
        return;
    }

    try {
        const usedAddresses = api.usedAddresses; jjj_("connectWallet","usedAddresses null",usedAddresses,"null()");
        lucid = await Lucid.new();
        lucid.selectWallet(api);
        const balanceHex = await lucid.wallet.getUtxos(); jj("connectWallet","balanceHex length less than 3",balanceHex.length,"leq(3)")
        if (balanceHex.length > 0) {
            const firstUtxo = balanceHex[1]; jj("connectWallet","firstUtxo is object",firstUtxo,"object()");
            const totalBalanceLovelace = balanceHex.reduce((sum, utxo) =>
                sum + BigInt(utxo.assets.lovelace), BigInt(0)); jj("connectWallet","totalBalanceLovelace geq to 0",totalBalanceLovelace,"geq(0)")
            const lovelacePerAda = BigInt(1_000_000);
            const balanceADA = totalBalanceLovelace / lovelacePerAda; jj("connectWallet","balanceADA = 1085n",balanceADA,"eq(1085n)")
            
        } else {
             o("balanceHex.length < 1")          
        }
    } catch (error) {
        console.error("Error connecting to wallet:", error);
    }
    tE("connectWallet")
    jtrics()
}

connectWallet()

/*below are example outputs from above testing 

Func starts : connectWallet
jimba.js:905 AIKEN TESTING
jimba.js:913 lucid declared and null
jimba.js:893 X FAIL : null
jimba.js:905 CONNECTWALLET
jimba.js:913 window is true
jimba.js:886 ✓ PASS : [object Window]
jimba.js:905 CONNECTWALLET
jimba.js:913 wCardano is true
jimba.js:886 ✓ PASS : [object Object]
jimba.js:905 CONNECTWALLET
jimba.js:913 wCardano
jimba.js:886 ✓ PASS : [object Object]
jimba.js:905 CONNECTWALLET
jimba.js:913 nami found
jimba.js:886 ✓ PASS : [object Object]
jimba.js:905 CONNECTWALLET
jimba.js:913 nami enabled in the browser extension
jimba.js:886 ✓ PASS : [object Object]
jimba.js:905 CONNECTWALLET
jimba.js:913 usedAddresses null
jimba.js:886 ✓ PASS : undefined
jimba.js:923 connectWallet :>: balanceHex length less than 3
jimba.js:893 X FAIL : 6
jimba.js:923 connectWallet :>: firstUtxo is object
jimba.js:886 ✓ PASS : [object Object]
jimba.js:923 connectWallet :>: totalBalanceLovelace geq to 0
jimba.js:886 ✓ PASS : 1085599327
jimba.js:923 connectWallet :>: balanceADA = 1085n
jimba.js:886 ✓ PASS : 1085
jimba.js:331 TIME : connectWallet: 510.570068359375 ms
jimba.js:335 TOTAL_ERRORS : 2
jimba.js:339 TOTAL_PASSES : 9
jimba.js:374 TOTAL_FUNCTIONS : 1
jimba.js:376 {connectWallet: 1}
jimba.js:364 TOTAL_PASSES : 9
jimba.js:354 TOTAL_ERRORS : 2
jimba.js:374 TOTAL_FUNCTIONS : 1
jimba.js:376 {connectWallet: 1}
jimba.js:388 TOTAL_TESTS_PASS : 9
jimba.js:392 TOTAL_TESTS_FAIL : 2
*/


