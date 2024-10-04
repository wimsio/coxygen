/*
Version : 1.0.5
Coxylib is a set of atomic functions simplifying use of Helios smart contract library.
Author:         Bernard Sibanda (Coxygen Global Pty Ltd)
License :       MIT License
Installation :  Import this coxylib.js file to any project even static websites. Please note there are Helios and Jimba dependecies
Date Started:   2024
Company : Coxygen Global

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
	  Assets,bytesToText,hexToBytes,AssetClass,BlockfrostV0,PubKeyHash,
	  Tx,Address, NetworkParams, Value,MintingPolicyHash,Program,ByteArrayData,ConstrData,NetworkEmulator,UTxO,TxId,Datum,ListData,RootPrivateKey,textToBytes
		} from "./helios.js";
		
import {opt,j} from "./jimba.js";

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
	minChangeAmt : 3000000, 
	networkParamsUrl : "./params/preprod.json",
	minAda : 3000000,
	ntype:0
}

export const assetClassification = {
        VoteToken : "Vote",
        IdentityToken: "Identity",
        BusinessCard:"Business",
        FaithToken:"Faith",
        GovernanceToken:"Governance",
        CulturalToken:"Cultural",
        SportToken:"Sport",
        MusicToken:"Music",
        MemeToken:"Meme",
        CouponTokens:"Coupon",
        TicketToken:"Ticket",
        LoveToken:"Love",
        AttendanceToken:"Attendance",
        BirthDayToken:"Birth Day",
        CongratulationsToken:"Congratulations",
        CondolencesToken:"Condolences",
        CertificateToken:"Certificate",
        MillionnaireToken:"Millionnaire",
        PetToken:"Pet",
        FungibleToken:"FT",
        NonFungibleToken:"NFT",
        RichFungibleToken:"RFT"
    }
    
export const genKeys = (phrase="flame fuel all matrix law tomato space festival proof witness pink treat thought ankle appear wire elite arrest hand captain expect slim swift arch") => {

    const rootKey = RootPrivateKey.fromPhrase(phrase.toString().trim().split(" ")); j.log({rootKey})
    
    const privateKey = rootKey.deriveSpendingKey(); j.log({privateKey})
    
    const publicKey = privateKey.derivePubKey(); j.log({publicKey})

    const a = publicKey.pubKeyHash; j.log({a})
    
    const b = Address.fromPubKeyHash(a); j.log({b})
    
    const address = (new Address(b.bytes)).toBech32(); j.log({address})

    return {ownerPrivateKey:bytesToHex(privateKey.bytes),ownerPublicKeyHash:publicKey.pubKeyHash.hex, ownerAddress:address};

}

export const unLock =async(vesting, secretMessage="secret")=>{
      
        const utxos = await walletData.utxos; j.log({utxos})
        
        const walletAPI = await walletData.walletAPI; j.log({walletAPI})
  
        const vestingProgram = Program.new(vesting);
        
        vestingProgram.parameters = {["SECRET"]: secretMessage}; 
        
        const vestingProgramCompiled = vestingProgram.compile(true); j.log({vestingProgramCompiled})

        const addrFromValidatorHash = await Address.fromHashes(vestingProgramCompiled.validatorHash); j.log({addrFromValidatorHash})

        const vestingRedeemer = (new vestingProgram.types.Redeemer.Claim(secretMessage))._toUplcData();
        
        const allAddresses = await walletData.walletHelper.allAddresses; j.log({allAddresses})
        
        const receiveAddress = allAddresses[0];

        const tx = new Tx();
        
        tx.attachScript(vestingProgramCompiled);
        
        tx.addInputs(utxos[0]); j.log({tx});

        const txInput = await txInputFromBlockfrost(addrFromValidatorHash); j.log({txInput});

        tx.addInput(txInput, vestingRedeemer); j.log({tx})

        tx.addSigner(receiveAddress.pubKeyHash);
        
        const txh = await txEnd(tx); j.log({txh});
        
  }

export  const lock =async(vesting,amount=10_000_000,secretMessage="secret")=>{

            const utxos = await walletData.utxos; j.log({utxos})
            
            const walletAPI = await walletData.walletAPI; j.log({walletAPI})
            
            const changeAddr = await walletData.walletHelper.changeAddress; j.log({changeAddr})

            const tx = new Tx();
            
            tx.addInputs(utxos[0]); j.log({tx})
          
            const vestingProgram = Program.new(vesting);
            
            vestingProgram.parameters = {["SECRET"]: secretMessage}; 
            
            const vestingProgramCompiled = vestingProgram.compile(true); j.log({vestingProgramCompiled})
            
            const vHash = vestingProgramCompiled.validatorHash.hex; j.log({vHash})
            
            const scriptAddress = Address.fromHashes(vestingProgramCompiled.validatorHash); j.log({scriptAddress})
            
            const vestingDatum = new (vestingProgram.types.Datum)(changeAddr.pubKeyHash); j.log({vestingDatum})
            
            const adaToSend = new Value(BigInt(amount)); j.log({adaToSend})
            
            const lovelaceToSend = adaToSend.lovelace; 
            
            const value_ = new Value(lovelaceToSend); j.log({value_});
            
            const inLineDatum = Datum.inline(vestingDatum); j.log({inLineDatum});
            
            const txOutput = new TxOutput(scriptAddress, value_,inLineDatum); j.log({txOutput});
            
            tx.addOutput(txOutput); j.log({tx});

            const txh = await txEnd(tx); j.log({txh});
 
  }

export const wallet =  await init(j); 

export const walletData = await walletEssentials(wallet,Cip30Wallet,WalletHelper,Value,txPrerequisites.minAda,j); 

export const txInputFromBlockfrost = async (scriptAddressPkh)=>{
    
    const hBlockfrostApi =new BlockfrostV0("preprod","preprodh0Mr07iXe1BwHLeKBKn58TYqDej2JCZm"); j.log({hBlockfrostApi})
    
    const utxosResults = await hBlockfrostApi.getUtxos(scriptAddressPkh); j.log({utxosResults});
    
    const txInput = utxosResults.length > 0 ? utxosResults[0] : ""; j.log({txInput});
    
    if(txInput == "")
    {
        const msg = "Script was not found";
        j.log({msg});
        return;
    }
    else
    {
        return txInput;
    }
}

export  const getKeyUtxo = async (address) => {

    const url = "./api-getKeyUtxo.php?address=" + address;

    let resp = await fetch(url, {
      method: "GET"
    });
   

    if (resp?.status > 299) {
      const err_ = 'vesting key token not found';
    }
    const payload = await resp;  j.log({payload});

    return payload;
}

export async function getAddr(address){

        var res = await fetch('./koios-api.php?address='+address, 
        {
            method: "GET",
            headers: {
                "Content-type": "application/json;charset=UTF-8"
            }
        })
        .then(function (response) {
        
            const fetch_status = response.status; j.log({fetch_status})
            
            if (response.status == 200) {
                return  response;
            }
        }) 
        .then(function (json) {

             return  json;
            
        })
        .catch(function (error){ j.log({error});
            return error;
        }); 
        
        return res;
    
}

export const apiListTransactionsFromPolicyHexTokenName=async(policyHexTokenName)=>{

     const url = "./apiListTransactionsFromPolicyHexTokenName.php?policyHexTokenName=" + policyHexTokenName;

    let resp = await fetch(url, {
      method: "GET"
    });
   

    if (resp?.status > 299) {
      const err_ = 'vesting key token not found';
    }
    
    const payload = await resp.json(); 
    
    const data = JSON.parse(payload); 
    
    return data;
}

export const apiListAddressFromSpecificPolicy=async(policyHexTokenName)=>{
    
    const url = "./apiListAddressFromSpecificPolicy.php?policyHexTokenName=" + policyHexTokenName;

    let resp = await fetch(url, {
      method: "GET"
    });
   

    if (resp?.status > 299) {
      const err_ = 'vesting key token not found';
    }
    
    const payload = await resp.json(); 
    
    const data = JSON.parse(payload); 
    
    return data;
}

export async function apiTokenFromAsset(mphHexAssetName){

    const url = "./apiTokenFromAsset.php?mphHexAssetName=" + mphHexAssetName;

    let resp = await fetch(url, {
      method: "GET"
    });
   

    if (resp?.status > 299) {
      const err_ = 'vesting key token not found';
    }
    
    const payload = await resp.json(); 
    
    const data = JSON.parse(payload); 
    
    return data;
    
}

export async function saveKeyValue(key,value){
    
        const xhttp = new XMLHttpRequest();
        
        xhttp.onload = function() {
         const response = this.responseText; j.log({response})
        }
        xhttp.open("GET", "./file.php?key="+key+"&value="+value, true);
        
        xhttp.send();

}

export async function getValue(key){

      const xhttp = new XMLHttpRequest();
        
        xhttp.onload = function() {
         const response = this.responseText; j.log({response})
        }
        xhttp.open("GET", "./file.php?key="+key, true);
        
        xhttp.send();
    
}

const mintAssets = async (walletData,name,description,imageUrl,txPrerequisites,j,hlib,txEnd,mintAssetsScript) => 
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

 	    const txh = txEnd(walletData,hlib,tx,j,txPrerequisites.networkParamsUrl);
		j.s("mintCNFT");
      } catch (error) {
		const errorMsg = await error.info;
		 j.log({errorMsg});
	}
}

export const mint_ = async (tokenName,tokenDescription,tokenImageUrl)=>{ 
    
const wallet =  await init(j); j.test("coxylib testPack", "init",wallet).eq("lace")

const walletData = await walletEssentials(wallet,Cip30Wallet,WalletHelper,Value,txPrerequisites.minAda,j); j.log({walletData})

 mintAssets(
        walletData,
        tokenName,
        tokenDescription,
        tokenImageUrl,
        txPrerequisites,
        j,
        hlib,
        txEnd,
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

export const txEnd = async(tx)=>{

    const networkParams = new hlib.NetworkParams(await fetch(txPrerequisites.networkParamsUrl).then(response => response.json())); j.log({networkParams})
    const spareUtxo =  walletData.utxos[1]; j.log({spareUtxo});
    const txBeforeFinal = tx.dump(); j.log({txBeforeFinal})
    const fnAddress =  await walletData.walletHelper.changeAddress; j.log({fnAddress})
    await tx.finalize(networkParams, fnAddress,spareUtxo);
    const signature = await walletData.walletAPI.signTx(tx); j.log({signature});	
    tx.addSignatures(signature);		
    const txHash = (await walletData.walletAPI.submitTx(tx)).toHex; j.log({txHash});

	return txHash;
}

export const sendAssets = async(assetMPH,assetName,assetQty,toAddress)=>{ 
		try {
                const wallet = await init(j); j.log({wallet});
                const walletData = await walletEssentials(wallet,Cip30Wallet,WalletHelper,Value,txPrerequisites.minAda,j); j.log({walletData});
    			const walletHelper = await walletData.walletHelper; j.log({walletHelper})
    			const utxos =  await walletData.utxos; j.log({utxos})
    			const tx = new hlib.Tx();
    			tx.addInputs(utxos[0]);
    			const assetsTokenOrNFTs = new hlib.Assets();
    			assetsTokenOrNFTs.addComponent( hlib.MintingPolicyHash.fromHex(assetMPH),Array.from(new TextEncoder().encode(assetName)),assetQty);
    			tx.addOutput(new hlib.TxOutput(hlib.Address.fromBech32(toAddress), new hlib.Value(BigInt(0),assetsTokenOrNFTs)));
                const txh = txEnd(walletData,hlib,tx,j,txPrerequisites.networkParamsUrl);
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

		 const txh = txEnd(walletData,hlib,tx,j,txPrerequisites.networkParamsUrl);
		
	} catch (error) {
       console.log({error});
	}	
	
}

export const shortAddressFunc = async ()=>{
    const baseAddress = (await walletData.walletHelper.baseAddress); j.log({baseAddress});
    const bech32Address = baseAddress.toBech32(); j.log({bech32Address});
    const shortAddress = bech32Address.toString().slice(0,10) +"..."+ bech32Address.toString().substr(bech32Address.length - 5); j.log({shortAddress});
    return shortAddress;
}

export const addressFunc = async ()=>{
    const baseAddress = (await walletData.walletHelper.baseAddress); j.log({baseAddress});
    const bech32Address = baseAddress.toBech32(); j.log({bech32Address});
    return bech32Address;
}

export const baseAddressPKH = async ()=>{
    const baseAddress = (await walletData.walletHelper.baseAddress); j.log({baseAddress});
    const pubkeyh = baseAddress.pubKeyHash.hex; j.log({pubkeyh})
    return pubkeyh;
}

export const getLovelace = async ()=>{
    const balanceLovelace = (await walletData.walletHelper.calcBalance()).lovelace.toString(); j.log({balanceLovelace});
    return balanceLovelace;
}

export const getAda = async ()=>{
    const balanceLovelace = (await walletData.walletHelper.calcBalance()).lovelace; 
    const ada = await balanceLovelace/BigInt(1000000); 
    return ada.toString();
}

export const displayValue = async ()=>{
    const utxos = await walletData.utxos;j.log({utxos}); j.log({utxos})
    const value = Object.values(Object.values(utxos[0]))[0].value; j.log({value})
    return value;
}

export const assetFunc = async ()=>{
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

export const txDeadLine =async (tx,deadLineMinutes)=>{
        const slot = networkParams.liveSlot;  j.log({slot});
        const time = networkParams.slotToTime(slot);  j.log({time});
        const before = new Date();	 j.log({before});
        const after = new Date();
        after.setMinutes(after.getMinutes() + deadLineMinutes); j.log({after})
        tx.validFrom(before);  j.log({tx});
        tx.validTo(after);		 j.log({tx});
		return tx;
}

export const submitTx =async(walletData,tx)=>{
	const txHash = (await walletData.walletAPI.submitTx(tx)).toHex();j.log({txHash});
	return txHash;
}

export const addTxOutPuts = async(tx,addresses,datums,j) => {		
	for(let i = 0; i < addresses.length; i++ )
	{
	   await tx.addOutput(new TxOutput(addresses[i],datums[i]));
	};		
	j.log({tx});		  
	return tx;
}

export const txIn=async(tx,utxo,token,redeemer,mph,script,deadline,partyAddress,signersPKHList,signaturesList,networkParams)=>{
    await tx.addRefInput(utxo); j.log({tx})
    await tx.addInput(utxo, redeemer);  j.log({tx})
    await tx.addInputs(utxos); j.log({tx})
    await tx.attachScript(script); j.log({tx})
    await tx.mintTokens(mph,token,redeemer); j.log({tx})
    if(deadline)
    {
        const slot = networkParams.liveSlot;  j.log({slot});
        const time = networkParams.slotToTime(slot);  j.log({time});
        const before = new Date();	 j.log({before});
        const after = new Date();
        after.setMinutes(after.getMinutes() + deadLineMinutes); j.log({after})
        tx.validFrom(before);  j.log({tx});
        tx.validTo(after);		 j.log({tx});
    }
    for(let i = 0; i < signersPKHList.length; i++ )
    {
     await tx.addSigner(signersPKHList[i]);  
    }
    await tx.finalize(networkParams, partyAddress, utxo);	 j.log({tx});
    for(let i = 0; i < signaturesList.length; i++ )
    {
     await tx.addSignatures(signaturesList[i]);  
    }
    
    return tx
}

export const strToHex=(str)=>{
    const objectR = {result : ''};
    for (var i=0; i<str.length; i++) {
      objectR.result += str.charCodeAt(i).toString(16);
    }
    return objectR.result;
  }

export const apiGetAssetFromPolicy=async(policy)=>{
    const url = "./apiGetAssetFromPolicy.php?policy=" + policy;

    let resp = await fetch(url, {
      method: "GET"
    });
   

    if (resp?.status > 299) {
      const err_ = 'vesting key token not found';
    }
    
    const payload = await resp.json(); 
    
    const data = JSON.parse(payload); 
    
    return data; 
}

export const getAssetsFromValue = async (value) => {
    const mphArray = value.assets.mintingPolicies;
    if (mphArray.length == 0) {
        token = {
            policy: "",
            tokenName: "",
            tokenQuantity: value.lovelace
        }
        return token;
        
    } 
    else 
    { 
        const assetsObjects = value.assets.dump();
        const assets = Object.keys(assetsObjects).map((key) => [key, assetsObjects[key]]);
        const tokenLists = [];
        assets.map((x)=>{
                    const thn = Object.keys(x[1])[0];                    
                    const mph = x[0];
                    const tokenHexName = thn;
                    const tokenName = hexToTex(Object.keys(x[1]));
                    const tokenQuantity = Object.values(Object.values(x[1]))[0];
                    const assClass = new AssetClass(mph+'.'+tokenHexName);
                    const assetFingerPrint = assClass.toFingerprint();
                    const assetsObjects = {tokenName:tokenName,tokenQuantity:tokenQuantity,mph:mph,tokenHexName:tokenHexName,assetFingerPrint:assetFingerPrint};
                    tokenLists.push(assetsObjects);                    
    			});

        return tokenLists;
    }
}

export const tokenFound = async (tokenMph) => {
    
    if(!tokenMph){return false}
    
    const utxos = await walletData.utxos;//j.log({utxos}); 
    
    const bToken = {found :[] };

    utxos.map((utxo)=>{
        
        const vs0 = Object.values(utxo); j.log({vs0})

        const value = Object.values(vs0)[0].value; j.log({value})
            
        const mphArray = value.assets.mintingPolicies; j.log({mphArray})
        
        if (mphArray.length == 0) {
            bToken.found.push(false);
        } 
        else 
        { 
            const assetsObjects = value.assets.dump(); j.log({assetsObjects}); j.log({assetsObjects});
            
            const assets = Object.keys(assetsObjects).map((key) => [key, assetsObjects[key]]); j.log({assets});

            assets.some(function(x) {
                j.log({x})
              bToken.found.push(x[0].toString().trim() == tokenMph.toString().trim());
            });
        }
    });

    const arrVhasT = bToken.found.includes(true); j.log({arrVhasT})
    
    if(arrVhasT){ return true}else{return false};

}

const getTokenUtxoFromProgramInstance = async (programInstance,tokenMPH) => {
    const compiledProgram = programInstance.compile(optimize);
    const utxos = await network.getUtxos(Address.fromHashes(compiledProgram.validatorHash));
    for (const utxo of utxos) {
        if (utxo.value.assets.mintingPolicies.includes(tokenMPH)) { 
            return utxo;
        }
    }
    return null;
}

export  const getNetworkParams=async(ntype=0)=>{
    
      const url = {network:""};
      
      if(txPrerequisites.ntype==0)
      {
           url.network = "./params/preprod.json";
      }
      else if(txPrerequisites.ntype==1)
      {
           url.network = "./params/preview.json";
      }
      else
      {
           url.network = "./params/mainnet.json";
      }
      
      try {
          const nk = url.network; j.log({nk})
          
          const response = await fetch(url.network);
          if (!response.ok) {
              throw new Error(`Response status: ${response.status}`);
          }

          const json = await response.json();
          return json;
      } catch (error) {
          console.error(error.message);
      }
  }

export  const generateMetadata=(info)=>{

	const metadata = {
          "map": [
              [info.policyId.toString().trim(),
                  {
                      "map": [
                          [info.assetName.toString().trim(),
                              {
                                  "map": [
                                      ["name", info.assetName.toString().trim()],
                                      ["description", info.assetDescription.toString().trim()],
                                      ["mediaType", "image/png"],
                                      ["image", info.imageIPFS.toString().trim()],
                                      ["mediaType", "video/mp4"],
                                      ["video", info.videoIPFS.toString().trim()],
                                      ["qty", info.quantity.toString()],
                                      ["assetTitle", info.assetTitle.toString().trim()],
                                      ["assetPurpose",info.assetPurpose.toString().trim()],
                                      ["organization", info.organization.toString().trim()],
                                      ["organizationWebsiteUrl", info.organizationWebsiteUrl.toString().trim()],
                                      ["tickerIconIPFS", info.tickerIconIPFS.toString().trim()],
                                      ["utxoId", info.utxoId.toString().trim()],
                                      ["utxoIdx", info.utxoIdx.toString().trim()],
                                      ["videoIPFS", info.videoIPFS.toString().trim()],
                                      ["dateExpires", info.dateExpires.toString().trim()],
                                      ["otherInfo",info.otherInfo.toString().trim()],
                                      ["policyId",info.policyId.toString().trim()],
                                      ["assetType",info.assetType.toString().trim()],
                                      ["assetAuthor",info.assetAuthor.toString().trim()],
                                      ["tags",info.tags.toString().trim()],
                                      ["assetClassification",info.assetClassification.toString().trim()],
                                      ["files", {
                                          "map": [
                                              ["mediaType", "image/png"],
                                              ["name",  info.assetName.toString().trim()],
                                              ["src", info.imageIPFS.toString().trim()]
                                          ]
                                      }]
                                  ]
                              }
                          ]
                      ]
                  }
              ]
          ]
      }

    j.log({metadata})
    return metadata;
}

export   const mint = async (data) => {
  
      j.log({data});      
          
    const minAda = txPrerequisites.minAda; // minimum lovelace needed to send an NFT
    const maxTxFee = txPrerequisites.maxTxFee; // maximum estimated transaction fee
    const minChangeAmt = txPrerequisites.minChangeAmt; // minimum lovelace needed to be sent back as change
    const minAdaVal = new Value(BigInt(minAda));
    const minUTXOVal = new Value(BigInt(minAda + maxTxFee + minChangeAmt));
    const utxos = await walletData.utxos;

      const walletAPI = await walletData.walletAPI;
      
      const network = getNetworkParams;

      try {
          
          const changeAddr = await walletData.walletHelper.changeAddress; j.log({changeAddr})
          
          const baseAddress = await walletData.walletHelper.baseAddress; j.log({baseAddress})

          const tx = new Tx();

          tx.addInputs(utxos[0]);

          const utxoId = utxos[0][0].outputId.txId.hex;
          
          const utxoIdx = utxos[0][0].outputId.utxoIdx;

          const ticketMinting = Program.new(data.ticket);
          
          ticketMinting.parameters = {["TX_ID"]: utxoId };
          ticketMinting.parameters = {["TX_IDX"]: utxoIdx};
          ticketMinting.parameters = {["TN"]: data.assetName};
          ticketMinting.parameters = {["QTY"]: BigInt(data.quantity)};

          const ticketCompiledMinting = ticketMinting.compile(true);
          
          const policy = ticketCompiledMinting.mintingPolicyHash.hex;

          tx.attachScript(ticketCompiledMinting);

          const mintRedeemer = (new ticketMinting.types.Redeemer.Mint())
              ._toUplcData();

          const tokens = [
              [textToBytes(data.assetName), BigInt(data.quantity)]
          ];

          const assets = new Assets([[policy,tokens]])

          tx.mintTokens(
              policy,
              tokens,
              mintRedeemer
          )
          
          const tokenAddress = {address:""}
          
          if(data.address == "")
          {
              tokenAddress.address = baseAddress.toBech32(); 
          }
          else
          {
             tokenAddress.address = data.address; 
          }
          
          j.log({tokenAddress})

          tx.addOutput(new TxOutput(
              Address.fromBech32(tokenAddress.address),
              new Value(minAdaVal.lovelace, assets)
          ));
          
          const info = {
            policyId:policy,
            assetName:data.assetName,
            utxoId:utxoId,
            utxoIdx:utxoIdx,
            assetTitle:data.assetTitle,
            tickerIconIPFS:data.tickerIconIPFS,
            organization:data.organization,
            organizationWebsiteUrl:data.organizationWebsiteUrl,
            assetDescription:data.assetDescription,
            assetPurpose:data.assetPurpose,
            quantity:data.quantity,
            imageIPFS:data.imageIPFS,
            videoIPFS:data.videoIPFS,
            dateExpires:data.dateExpires,
            otherInfo: data.otherInfo,
            assetType:data.assetType,
            assetAuthor:data.assetAuthor,
            tags:data.tags,
            assetClassification:data.assetClassification
          }

          const classF = data.assetClassification; j.log({classF})
          
          if(classF == "FT" && info.quantity > 1)
          {
             // 
          }
          else
          {
              tx.addMetadata(721,generateMetadata(info)); 
          }

          const networkParamsJson = await getNetworkParams(network); j.log({networkParamsJson})
          
          const networkParams = new NetworkParams(networkParamsJson);

          await tx.finalize(networkParams, changeAddr, utxos[1]);

          const wAPI = await walletData.walletAPI;

          const signatures = await wAPI.signTx(tx);

          tx.addSignatures(signatures);

          const txHash = (await wAPI.submitTx(tx)).hex; 

          console.log(txHash);

      } catch (err) {
          throw console.error("submit tx failed", err);
      }
  }


 
