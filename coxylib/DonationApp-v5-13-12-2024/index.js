import{
    bytesToHex,Cip30Wallet,WalletHelper,TxOutput,
    Assets,bytesToText,hexToBytes,AssetClass,
    Tx,Address, NetworkParams, Value,MintingPolicyHash,
    Program,ByteArrayData,ConstrData,NetworkEmulator,PubKey,
    textToBytes,Datum,ListData,IntData
} from "./js/helios.js";

import{
    txPrerequisites,init,walletEssentials,txFunc,hlib,hexToTex,shortAddressFunc, 
    addressFunc, adaFunc, assetFunc,getAssets,sendADA,sendAssets,
    showWalletData,mint,txDeadLine,baseAddressPKH,submitTx, getAssetsFromValue
} from "./js/coxylib.js";

import{opt,j} from "./js/jimba.js";

opt._R = 1;//run all tests, checks and logs
opt._O = 1; //run only logs
opt._M = 1; //show stake frames of logs
opt._T = 1; //run tests
opt._Ob = 0; //show tests stack frames
opt._FailsOnly = 0; //run only failed tests
opt._F = 0;  //show functions that are marked with j.s() and j.e() for function profiling
opt._tNo = 1; //this is the number of times testPack will run

const domGetId = (id) =>{
    return document.getElementById(id);
}

domGetId("clearForm").addEventListener('click',()=>{
    domGetId("sendAdaForm").reset();
});

const wallet = await init(j);
const walletData = await walletEssentials(wallet,Cip30Wallet,WalletHelper,Value,txPrerequisites.minAda,j);
j.log({walletData});

const displayLovelace = await adaFunc(walletData,j);
j.log({displayLovelace});

const displayAda = (displayLovelace /1000000).toLocaleString();
j.log({displayAda});

domGetId("adaBalance").innerHTML = "₳ " +displayAda;

domGetId("sendAdaForm").addEventListener("submit", async(event)=>{
    event.preventDefault();

    const recipientAddress = domGetId("recipient").value;
    const adaAmount = domGetId("amount").value;

    await sendADA(recipientAddress, adaAmount);
});

