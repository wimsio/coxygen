/*
Version : 1.0.1
Coxylib is a set of atomic functions simplifying use of Helios smart contract library.
Author:         Bernard Sibanda (Coxygen Global Pty Ltd)
License :       MIT License
Installation :  Import this coxylib.js file to any project even static websites. Please note there are Helios and Jimba dependecies
Date Started:   2024

Advantages:
- it gives testable atomic funtions for Cardano blockchain integration
- simplifies and speeds up decentralized cardano development
- easy deployment even on cpanel websites
- comes packed with testing library jimba.js and also standalone Helios.js
- uses a much improved console.logs which can be switched on and off
- 100% client side dapp development
- no need for npm, nodejs, and other painful bloating packages
- implements code best design functions e.g. code re-use, functional programming, etc 
*/

import {
			bytesToHex,Cip30Wallet,WalletHelper,TxOutput,
			Assets,bytesToText,hexToBytes,AssetClass,
			Tx,Address, NetworkParams, Value,MintingPolicyHash,Program,ByteArrayData,ConstrData
		} from "./js/helios.js";
		
import {opt,j} from "./js/jimba.js";

import  {mintAssetsScript} from './mintAssetsScript.js';
		
export const hlib = {
    Value:Value,
    Tx:Tx,
    Assets:Assets,
    NetworkParams : NetworkParams,
    ByteArrayData : ByteArrayData,
    BigInt:BigInt,
    ConstrData:ConstrData,
    TxOutput:TxOutput,
    Address:Address,
    hexToBytes:hexToBytes,
    Program:Program,
    MintingPolicyHash:MintingPolicyHash
}

export const txPrerequisites = {
	maxTxFee : 3000000, 
	minChangeAmt : 2000000, 
	networkParamsUrl : "https://d1t0d7c2nekuk0.cloudfront.net/preprod.json",
	minAda : 4000000	
}

const mintAssets = async (walletData,name,description,imageUrl,txPrerequisites,j,hlib,txFunc,mintAssetsScript) => 
  {
      try
      {
      
  	    j.s("mintCNFT");
		j.log({walletData});
		j.log({txPrerequisites});
		j.log({mintAssetsScript});
		
		const maxTxFee = txPrerequisites.maxTxFee; 
		const minChangeAmt = txPrerequisites.minChangeAmt; 
		const minAda = txPrerequisites.minAda;	
		const minUTXOVal = new hlib.Value(BigInt(minAda + maxTxFee + minChangeAmt));	
		const txIdHex = walletData.utxos[0][0].txId; j.log({txIdHex});
		const utxoIdx = walletData.utxos[0][0].utxoIdx; j.log({utxoIdx})
		

		const mintScript = mintAssetsScript(txIdHex,utxoIdx,name).toString(); j.log({mintScript})

		const nftCompiledProgram = hlib.Program.new(mintScript).compile(true); j.log({nftCompiledProgram})
		
		const tx = new hlib.Tx();
		tx.addInputs(walletData.utxos[0]);
		const nftMPH = nftCompiledProgram.mintingPolicyHash;
		tx.attachScript(nftCompiledProgram);
		const nftTokenName = hlib.ByteArrayData.fromString(name).toHex();
		const nft = [[hlib.hexToBytes(nftTokenName), BigInt(1)]];
		const mintRedeemer = new hlib.ConstrData(0, []);
		tx.mintTokens(nftCompiledProgram.mintingPolicyHash,nft,mintRedeemer);
		const toAddress = (await walletData.walletHelper.baseAddress).toBech32(); j.log({toAddress})
		tx.addOutput(new hlib.TxOutput(hlib.Address.fromBech32(toAddress), new hlib.Value(minUTXOVal.lovelace, new hlib.Assets([[nftCompiledProgram.mintingPolicyHash, nft]]))));
		tx.addMetadata(721, {"map": [[nftCompiledProgram.mintingPolicyHash.hex, {"map": [[name,
										{
											"map": [["name", name],
													["description", description],
													["image", imageUrl]
												]
										}
									]]}
									]]
							}
					);

 	    const txh = txFunc(walletData,hlib,tx,j,txPrerequisites.networkParamsUrl);
		j.s("mintCNFT");
      } catch (error) {
		const errorMsg = await error.info;
		 j.log({errorMsg});
	}
}

export const mint = async (tokenName,tokenDescription,tokenImageUrl)=>{ 
const wallet =  await init(j);
j.test("coxylib testPack", "init",wallet).eq("lace")

const walletData = await walletEssentials(wallet,Cip30Wallet,WalletHelper,Value,txPrerequisites.minAda,j); j.log({walletData})
j.test("coxylib testPack","walletEssentials walletEnabled",walletData.walletEnabled).notBool() 

 mintAssets(
        walletData,
        tokenName,
        tokenDescription,
        tokenImageUrl,
        txPrerequisites,
        j,
        hlib,
        txFunc,
        mintAssetsScript
    )
}

export function hexToTex(hexx) {
	const hex = hexx.toString();
	let str = '';
	for (let i = 0; i < hex.length; i += 2)
	{
		str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
	}
	return str;
}

export async function init(j) {  j.s("init");

try 
{
	const started = "...started"; j.log({started});

	const cwindow = window.cardano; j.log({cwindow})
			
	if(typeof cwindow != 'undefined')
	{

		if(window.cardano.nami)
		{
			return  "nami";
		}
		else if(window.cardano.eternl)
		{
			return  "eternl";
		}
		else if(window.cardano.lace)
		{
			return  "lace";
		}
		else if(window.cardano.flint)
		{
			return  "flint";
		}
		else if(window.cardano.nufi)
		{
			return  "nufi";
		}
		else if(window.cardano.yoroi)
		{
			return  "yoroi";
		}
		else
		{
			return null;
		}

	}
	else
	{				
		alert("Sorry you need to connect to browsers wallets: Nami/Eternl/Lace in preprod network");
		
		return null;
	}

	j.e("init");
} 
catch (error) 
{
        console.log({error});		
		return null;
		
}
}

export async function walletEssentials(selectedWallet,Cip30Wallet,WalletHelper,Value,utxoAmount,j) 
{
    try
	{
     	j.test("showWalletData","selectedWallet",selectedWallet).string();
     	j.test("showWalletData",'jimba j',j).object();
     	j.test("showWalletData","utxoAmount",utxoAmount).geq(0);
    
    	const wallet = await eval('window.cardano.'+selectedWallet); j.log({wallet});j.test("WalletEssentials","wallet",wallet).object();
    
    	const walletEnabled = await wallet.isEnabled(); j.log({walletEnabled});j.check(selectedWallet+"wallet Enabled",walletEnabled,true);	
    	
    	if(!walletEnabled)
    	{
    	    const iwe = await wallet.enable();j.log({iwe}); window.location.reload();
    	}
    	
    	if(walletEnabled)
    	{			
    		const walletHandler = (await wallet.enable()); j.test("walletEssentials","walletHandler",walletHandler).object()
    		const walletAPI = await new Cip30Wallet(walletHandler);j.log({walletAPI}) ;
    		const walletHelper = new WalletHelper(walletAPI); j.log({walletHelper});
    		const utxos = await walletHelper.pickUtxos(new Value(BigInt(utxoAmount)));j.log({utxos});
    		const resObject = {wallet:wallet,walletEnabled:walletEnabled,walletHelper:walletHelper,walletHandler:walletHandler,walletAPI:walletAPI,utxos:utxos}; 
    
    		return resObject;
    	}
    	else
    	{
    		return null;
    	}
	} 
	catch (error) 
	{
        console.log({error});	
		return null;	
	}

}

export const showWalletData = async (walletData,utxoAmount,AssetClass,j) =>{ j.s("showWalletData")
try
{
	j.test("showWalletData",utxoAmount,utxoAmount).geq(0);
	const digitalAssests =[];
	const utxos = await walletData.utxos;j.log({utxos});
	const baseAddress = (await walletData.walletHelper.baseAddress); j.log({baseAddress})
	const bech32Address = baseAddress.toBech32(); j.log({bech32Address})
	const balanceLovelace = (await walletData.walletHelper.calcBalance()).lovelace.toString(); j.log({balanceLovelace})
	const collateralAda = String((await walletData.walletHelper.pickCollateral()).value.lovelace/BigInt(1000000)); j.log({collateralAda}) ;		
	const shortAddress = bech32Address.toString().slice(0,10) +"..."+ bech32Address.toString().substr(bech32Address.length - 5); j.log({shortAddress})
	
	digitalAssests.push({
		baseAddress:baseAddress,
		bech32Address:bech32Address,
		shortAddress:shortAddress,
		balanceLovelace:balanceLovelace,
		collateralAda:collateralAda
	})
	const tem = Object.values(utxos[0]); j.log({tem})
	const assets = Object.values(Object.values(utxos[0]))[0].value.assets.dump(); j.log({assets})
	const assetsArray =  Object.keys(assets).map((key,value) => [key, assets[key]]); j.log({assetsArray})  
	const assetsAsStringArray = JSON.parse(JSON.stringify(assetsArray));j.log({assetsAsStringArray})
	
	const res = assetsAsStringArray.map((x)=>{
		const mph = x[0];
		const tokenHexName = Object.keys(x[1])[0];
		const tokenName = hexToTex(Object.keys(x[1])[0]);
		const tokenQuantity = Object.values(x[1])[0];
		const assClass = new AssetClass(mph+'.'+tokenHexName);
		const assetFingerPrint = assClass.toFingerprint();
		const assetsObjects = {tokenName:tokenName,assetQty:tokenQuantity,mph:mph,assetHexName:tokenHexName,assetFingerPrint:assetFingerPrint}
		digitalAssests.push(assetsObjects);			
	});
	j.log({digitalAssests});
	j.e("showWalletData");
	return await digitalAssests;
} 
catch (error) 
{
   console.log({error});
	return null;	
}

}

export async function getAssets(asset,j)
{

    var res = await fetch('https://coxygen.co/pacman-cardano/api.php?asset='+asset, 
    {
        method: "GET",
        headers: {
            "Content-type": "application/json;charset=UTF-8"
        }
    })
    .then(function (response) {
    
        const fetch_status = response.status; j.log({fetch_status});
        
        if (response.status == 200) {
            return  response.json();
        }
    }) 
    .then(function (json) {
        
         j.log({json});
            
         return  json;
        
    })
    .catch(function (error){ console.log({error});
        return error;
    }); 
    
    return res;

}

export const txFunc = async(walletData,hlib,tx,j,networkParamsUrl)=>{

    const networkParams = new hlib.NetworkParams(await fetch(networkParamsUrl).then(response => response.json())); j.log({networkParams})
    const spareUtxo =  walletData.utxos[1]; j.log({spareUtxo});
    const txBeforeFinal = tx.dump(); j.log({txBeforeFinal})
    const fnAddress =  await walletData.walletHelper.changeAddress; j.log({fnAddress})
    await tx.finalize(networkParams, fnAddress,spareUtxo);
    const signature = await walletData.walletAPI.signTx(tx); j.log({signature});	
    tx.addSignatures(signature);		
    const txHash = (await walletData.walletAPI.submitTx(tx)).toHex();j.log({txHash});

	return txHash;
}

export const sendAssets = async(assetMPH,assetName,assetQty,toAddress)=>{ 

		try {
            const wallet = await init(j); j.log({wallet});
            const walletData = await walletEssentials(wallet,Cip30Wallet,WalletHelper,Value,txPrerequisites.minAda,j); j.log({walletData});
			const amountToTransferLovelace = Number(0) *1000000; 
			const maxTxFee = txPrerequisites.maxTxFee; 
			const minChangeAmt = txPrerequisites.minChangeAmt; 
			const minUTXOVal = new hlib.Value(BigInt(amountToTransferLovelace + maxTxFee + minChangeAmt));
			const walletHelper = await walletData.walletHelper;
			const utxos =  await walletData.utxos;
			const tx = new hlib.Tx();
			tx.addInputs(utxos[0]);
			const assetsTokenOrNFTs = new hlib.Assets();
			assetsTokenOrNFTs.addComponent( hlib.MintingPolicyHash.fromHex(assetMPH),Array.from(new TextEncoder().encode(assetName)),assetQty);
			tx.addOutput(new hlib.TxOutput(hlib.Address.fromBech32(toAddress), new hlib.Value(BigInt(0),assetsTokenOrNFTs)));
            const txh = txFunc(walletData,hlib,tx,j,txPrerequisites.networkParamsUrl);
		} catch (error) {
			 console.log({error});
		}
	}

export const sendADA = async (toAddress,amountToTransfer) => {   
	try {
	    const wallet = await init(j); j.log({wallet});
        const walletData = await walletEssentials(wallet,Cip30Wallet,WalletHelper,Value,txPrerequisites.minAda,j); j.log({walletData});
		const amountToTransferLovelace = Number(amountToTransfer) *1000000; 
		const maxTxFee = txPrerequisites.maxTxFee; 
		const minChangeAmt = txPrerequisites.minChangeAmt; 
		const minUTXOVal = new hlib.Value(BigInt(amountToTransferLovelace + maxTxFee + minChangeAmt));
		const walletHelper = await walletData.walletHelper;
		const utxos =  await walletData.utxos;
		const tx = new hlib.Tx();
		tx.addInputs(utxos[0]);
		tx.addOutput(new hlib.TxOutput(hlib.Address.fromBech32(toAddress), new hlib.Value(BigInt(amountToTransferLovelace))));

		 const txh = txFunc(walletData,hlib,tx,j,txPrerequisites.networkParamsUrl);
		
	} catch (error) {
       console.log({error});
	}	
	
}

export const shortAddressFunc = async (walletData,j)=>{
    const baseAddress = (await walletData.walletHelper.baseAddress); j.log({baseAddress});
    const bech32Address = baseAddress.toBech32(); j.log({bech32Address});
    const shortAddress = bech32Address.toString().slice(0,10) +"..."+ bech32Address.toString().substr(bech32Address.length - 5); j.log({shortAddress});
    return shortAddress;
}

export const addressFunc = async (walletData,j)=>{
    const baseAddress = (await walletData.walletHelper.baseAddress); j.log({baseAddress});
    const bech32Address = baseAddress.toBech32(); j.log({bech32Address});
    return bech32Address;
}

export const adaFunc = async (walletData,j)=>{
    const balanceLovelace = (await walletData.walletHelper.calcBalance()).lovelace.toString(); j.log({balanceLovelace});
    return balanceLovelace;
}

export const assetFunc = async (walletData,AssetClass,j)=>{
    const utxos = await walletData.utxos;j.log({utxos});
    const assets= Object.values(Object.values(utxos[0]))[0].value.assets.dump(); j.log({assets});
    const assetsArray =  Object.keys(assets).map((key,value) => [key, assets[key]]); j.log({assetsArray});  
    const assetsAsStringArray = JSON.parse(JSON.stringify(assetsArray));j.log({assetsAsStringArray});
    const assetArray = [];
    const res = assetsAsStringArray.map((x)=>{
    				const mph = x[0];
    				const tokenHexName = Object.keys(x[1])[0];
    				const tokenName = hexToTex(Object.keys(x[1])[0]);
    				const tokenQuantity = Object.values(x[1])[0];
    				const assClass = new AssetClass(mph+'.'+tokenHexName);
    				const assetFingerPrint = assClass.toFingerprint();
    				const assetsObjects = {tokenName:tokenName,assetQty:tokenQuantity,mph:mph,assetHexName:tokenHexName,assetFingerPrint:assetFingerPrint};
    				assetArray.push(assetsObjects)			
    			});
    
    return assetArray;
}

//new functions

export const deadLine =async (tx,networkParams,deadLineMinutes,j)=>{
        const slot = networkParams.liveSlot;  j.log({slot});
        const time = networkParams.slotToTime(slot);  j.log({time});
        const now = new Date(Number(time));		 j.log({now});
        const before = new Date(now.getTime());  
        before.setMinutes(now.getMinutes() - 5);  j.log({before});
        const after = new Date(now.getTime()); 
        after.setMinutes(now.getMinutes() + deadLineMinutes);  j.log({after});
        tx.validFrom(before);  j.log({tx});
        tx.validTo(after);		 j.log({tx});
		return tx;
}

export const addSigner = async (networkParams,partyAddress,partyAutxos,tx,j,signersPKHs,owner="")=>{
  j.log({signersPKHs});	
  for(let i = 0; i < signersPKHs.length; i++ )
  {
	 tx.addSigner(signersPKHs[i]);  
  }	
	await tx.finalize(networkParams, partyAddress, partyAutxos);	 j.log({tx});	
	const partySignature = await partyAddress.signTx(tx);  j.log({partySignature});	
	tx.addSignatures(partySignature);	 j.log({tx});	
	if(owner != "")
	{
	  const ownerSignature = await owner.signTx(tx); j.log({ownerSignature});	
	  tx.addSignatures(ownerSignature);  j.log({tx});	
	}
	else
	{
		const ownerSignature = await owner.signTx(tx);  j.log({ownerSignature});	
		tx.addSignatures(ownerSignature);	 j.log({tx});	
	}		
	return tx;	
}

export const submitTx =async(tx,network,j)=>{
	const txId = await network.submitTx(tx);j.log({txId})
	return txId;
}

export const attachScript =async(tx,script,j)=>{
     await tx.attachScript(script); j.log({tx})	 
	 return tx;
}

export const addTxOutPuts = async(tx,addresses,datums,j) => {		
	for(let i = 0; i < addresses.length; i++ )
	{
	   await tx.addOutput(new TxOutput(addresses[i],datums[i]));
	};		
	j.log({tx});		  
	return tx;
}

export const txInputs =async(tx,utxos,j)=>{
 await tx.addInputs(utxos); j.log({tx})
 return tx;
}

export const txInput =(tx,utxo,redeemer,j)=>{
  tx.addInput(utxo, redeemer);  j.log({tx})
  return tx;
}

export const mintTokens =async(tx,mph,token,redeemer,j)=>{
       await tx.mintTokens(mph,token,redeemer); j.log({tx})		
	return tx;
}

export const txRefInput =async(tx,utxo,j)=>{
 await tx.addRefInput(utxo); j.log({tx})
 return tx;
}


 
