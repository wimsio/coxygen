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
	  Assets,bytesToText,hexToBytes,AssetClass,BlockfrostV0,PubKeyHash,IntData,MapData,
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

        const vestingRedeemer = (new vestingProgram.types.Redeemer.Cancel)._toUplcData();
        
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

export const utxoFromBech32 =async(addressBech32,projectId)=>{
    
     const url = `https://cardano-preprod.blockfrost.io/api/v0/addresses/${addressBech32}/utxos?order=asc`; j.log({url})

        try {
            const response = await fetch(url, {
                headers: {
                    "project_id": projectId
                }
            }); j.log({response})

            if (response.status == 404) {
                return []; 
            }

            /**
             * @type {any}
             */
            let all = await response.json();

            if (all?.status_code >= 300) {
                all = [];
            }

            try {
                return await Promise.all(all.map(obj => {
                    const fResponse = this.restoreTxInput(obj); j.log({fResponse})
                    return fResponse
                }));
            } catch (e) {
                console.error("unable to parse blockfrost utxo format:", all);
                throw e;
            }
        } catch (e) {
            if (e.message.includes("The requested component has not been found")) {
                return []
            } else {
                throw e
            }
        }
}

export const getUtxoMphTokenNameHexFromBech32Addr =async(scriptAddressBech32,mph,tokenNameHex)=>{
    
    const hBlockfrostApi =new BlockfrostV0("preprod","preprodh0Mr07iXe1BwHLeKBKn58TYqDej2JCZm"); j.log({hBlockfrostApi})
    
    const utxosResults = await utxoFromBech32(scriptAddressBech32); j.log({utxosResults});
    
    const utxos = utxosResults.length > 0 ? utxosResults: ""; j.log({utxos});
    
    if (utxos.length < 1) { throw console.error("No UTXOs found at " + scriptAddressPkh);}  
    
    const ut = [];

    const rs = utxos.map((utxo)=>{
        
        j.log({utxo})
        
        const assetsAsStringArray = utxo.origOutput.value.assets;j.log({assetsAsStringArray})
	
    	if(assetsAsStringArray.assets.length > 0)
    	{  
    	    const res = assetsAsStringArray.assets.map((x)=>{
    	   
        		const mph_ = x[0].hex; j.log({mph_}); j.log({mph})
        		
        		const tokenHexName_ = x[1][0][0].hex; j.log({tokenHexName_}); j.log({tokenNameHex})
        		
        		 if(mph_ == mph && tokenHexName_ == tokenNameHex)
        		 {
        		    ut.push(utxo); j.log({ut})
        		 }
        	});
    	}
    	else
    	{
    	    const msg = "Token was not found"; j.log({msg})

    	}
     });
     
     return ut.length > 0 ? ut[0]:null;

}

export const getUtxoMphTokenNameHex =async(scriptAddressPkh,mph,tokenNameHex)=>{
    
    const hBlockfrostApi =new BlockfrostV0("preprod","preprodh0Mr07iXe1BwHLeKBKn58TYqDej2JCZm"); j.log({hBlockfrostApi})
    
    const utxosResults = await hBlockfrostApi.getUtxos(scriptAddressPkh); j.log({utxosResults});
    
    const utxos = utxosResults.length > 0 ? utxosResults: ""; j.log({utxos});
    
    if (utxos.length < 1) { throw console.error("No UTXOs found at " + scriptAddressPkh);}  
    
    const ut = [];

    const rs = utxos.map((utxo)=>{
        
        j.log({utxo})
        
        const assetsAsStringArray = utxo.origOutput.value.assets;j.log({assetsAsStringArray})
	
    	if(assetsAsStringArray.assets.length > 0)
    	{  
    	    const res = assetsAsStringArray.assets.map((x)=>{
    	   
        		const mph_ = x[0].hex; j.log({mph_}); j.log({mph})
        		
        		const tokenHexName_ = x[1][0][0].hex; j.log({tokenHexName_}); j.log({tokenNameHex})
        		
        		 if(mph_ == mph && tokenHexName_ == tokenNameHex)
        		 {
        		    ut.push(utxo); j.log({ut})
        		 }
        	});
    	}
    	else
    	{
    	    const msg = "Token was not found"; j.log({msg})

    	}
     });
     
     const totalUtxos = utxos.length; j.log({totalUtxos})
     
     return utxos[totalUtxos-1];//ut.length > 0 ? ut[0]:null;

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

export const save=(key,value)=>{
    if(key && value)
    {
        localStorage.setItem(key,value);
    }
    else if(key && !value)
    {
        return localStorage.getItem(key);
    }
    else
    {
        j.log({key})
    }
}

export async function setGetKeyValue(key,value="0"){
    
        const xhttp = new XMLHttpRequest();
        
        xhttp.onload = function() {
        if(this.responseText == "already saved")
        {
          const setGetKeyValueResponse = this.responseText; j.log({setGetKeyValueResponse})  
        }
        else
        {
          const setGetKeyValueResponse_ = JSON.parse(this.responseText); j.log({setGetKeyValueResponse_})  
        }
         
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
    const txR = await walletData.walletAPI.submitTx(tx); j.log({txR})
    const txHash = txR.hex; j.log({txHash});
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
                const txh = txEnd(tx);
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
		 const txh = txEnd(tx);
		 return txh;
		 
	} catch (error) {
       return error;
       
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


// const data = {
//     assetName :"WIMT",
//     assetTitle: "WIMT Token",
//     tickerIconIPFS:"https://coxygen.co/images/misheck/misheck.png",
//     organization:"WIMS-Cardano SADC",
//     organizationWebsiteUrl:"https://wims.io",
//     assetDescription:"Owning this CNFT gives you sense of love for your pets",
//     assetPurpose:"Loved pets on Cardano blockchain to live forever",
//     quantity:"4",
//     imageIPFS:"https://coxygen.co/images/misheck/misheck.png",
//     videoIPFS:"https://coxygen.co/images/misheck/misheck.mp4",
//     dateExpires:"0",
//     otherInfo: "Why have a multese dog? The Maltese is kept for companionship, for ornament, or for competitive exhibition. It is ranked 59th of 79 breeds assessed for intelligence by Stanley Coren",
//     address:"",//addr_test1qpsn3aykjm5z5s643z4tyq889kl0e9uyknmmts570djm3zhdlfa4tnw2ywu872g25mdv5kcqe4wc3lqtjnr3ah3xhu2qw58trw".toString().trim(),
//     assetType:"Pets Social Token", //Fungible Token,Cardano Non Fungigle Token,Governance Token,Rich Fungible Token,Meme Token, Real World Asset Token, Social Token, Political Token, Environmental Token, Cultural Token, Love Token, Qualification Token, Achievement Token,Memorial Token, Tourist Token
//     assetAuthor:"Bernard Sibanda",
//     tags:"pet,social,love,misheck,Bernard Sibanda,intelligent,Cardano blockchain",
//     assetClassification:assetClassification.RichFungibleToken,
//     ticket:ticket
// }

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

          const ticketMinting = Program.new(data.mintThankYouNFT);
          
          ticketMinting.parameters = {["TX_ID"]: utxoId };
          ticketMinting.parameters = {["TX_IDX"]: utxoIdx};
          ticketMinting.parameters = {["TN"]: data.assetName};
          ticketMinting.parameters = {["QTY"]: BigInt(data.quantity)};

          const ticketCompiledMinting = ticketMinting.compile(false);
          
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

         const txh = txEnd(tx);
         
         j.log({txh})

      } catch (err) {
          throw console.error("submit tx failed", err);
      }
  }
  
export const hexToText=(str1)=> {
    
    let hex = str1.toString();
   
    let str = '';
   
    for (let n = 0; n < hex.length; n += 2) {
       
        str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
    }
    
    return str;
}

export const sellAssets =async(buyselltokens,data)=>{
    
        const asst = await assetFunc(); j.log({asst})

        const tokenNameHex = asst[0].assetHexName; j.log({tokenNameHex})

        const mph = asst[0].mph; j.log({mph});
        
        data.mph = mph;
        
        data.nftId = mph+"."+tokenNameHex+data.saleNo; 
        
        data.tokenNameHex = tokenNameHex;
        
        data.nft = mph+"."+tokenNameHex; 
        
        data.nftTotalPriceLovelace = data.nftUnitPriceLovelace * data.nftQuantity;
        
        const sellerAssets = new hlib.Assets();
        
        sellerAssets.addComponent(data.mph,data.tokenNameHex,data.nftQuantity);
        
        const sellerValue = new Value(BigInt(0),sellerAssets); j.log({sellerValue})
        
        const nftPrice = new Value(BigInt(data.nftUnitPriceLovelace)); j.log({nftPrice})
        
        data.nftPrice = nftPrice

        const utxos = await walletData.utxos; j.log({utxos})
        
        const walletAPI = await walletData.walletAPI; j.log({walletAPI})
        
        const baseAddress = await walletData.walletHelper.baseAddress; j.log({baseAddress})

        const baseAddressPKH = baseAddress.pubKeyHash; j.log({baseAddressPKH})
        
        const baseAddressStaking = baseAddress.stakingHash; 
        
        data.baseAddressStakingHash = baseAddress.stakingHash;
        
        data.seller = baseAddress.toBech32();

        const buyselltokensProgram = Program.new(buyselltokens);

        const buyselltokensProgramCompiled = buyselltokensProgram.compile(false); j.log({buyselltokensProgramCompiled})

        const scriptAddress = Address.fromHashes(buyselltokensProgramCompiled.validatorHash); j.log({scriptAddress})
        
        const scriptAddressBech32 = scriptAddress.toBech32(); j.log({scriptAddressBech32})

        data.scriptAddress = scriptAddress; 

        data.scriptAddressBech32 = scriptAddressBech32; j.log({data})
        
        const buyselltokensDatum = new (buyselltokensProgram.types.Datum)(baseAddressPKH,data.nft,data.nftQuantity,textToBytes(data.nftId),data.nftUnitPriceLovelace,data.nftTotalPriceLovelace); j.log({buyselltokensDatum})
        
        const inLineDatum = Datum.inline(buyselltokensDatum); j.log({inLineDatum});
        
        const inLineDatumDump = inLineDatum.dump(); j.log({inLineDatumDump})
        
        const txOutput = new TxOutput(scriptAddress, sellerValue,inLineDatum); j.log({txOutput});
        
        const tx = new Tx();
        
        tx.addInputs(utxos[0]); j.log({tx});
        
        tx.addOutput(txOutput); j.log({tx});

        const txh = await txEnd(tx); j.log({txh});
        
        data.txHash = txh;
        
        save("data",JSON.stringify(data));
        
       // const res = await setGetKeyValue("data",JSON.stringify(data));
        
        return txh;
        
}

export const buyAssets =async(buyselltokens,qty)=>{

        const data = JSON.parse(save("data")); j.log({data})

        const mph = data.mph; j.log({mph});

        data.nft = new AssetClass(data.mph+"."+data.tokenNameHex); 
        
        const nftPrice = new Value(BigInt(data.nftUnitPriceLovelace)); j.log({nftPrice})
        
        data.nftPrice = nftPrice

        const minAda = txPrerequisites.minAda;

        const utxos = await walletData.utxos; j.log({utxos})

        const maxTxFee = txPrerequisites.maxTxFee; 
        
        const minChangeAmt = txPrerequisites.minChangeAmt; 
        
        const sellerValue = new hlib.Value(BigInt(data.nftUnitPriceLovelace) + BigInt(maxTxFee) + BigInt(minChangeAmt));

        const walletAPI = await walletData.walletAPI; j.log({walletAPI})
        
        const baseAddress = await walletData.walletHelper.baseAddress; j.log({baseAddress})
        
        const baseAddressPKHBuyer = baseAddress.pubKeyHash; j.log({baseAddressPKHBuyer})
        
        const changeAddr = await walletData.walletHelper.changeAddress; j.log({changeAddr})

        const buyselltokensProgram = Program.new(buyselltokens);

        const sellerPKH = Address.fromBech32(data.seller).pubKeyHash; j.log({sellerPKH})

        const buyselltokensProgramCompiled = buyselltokensProgram.compile(false); j.log({buyselltokensProgramCompiled})

        const scriptAddress = Address.fromHashes(buyselltokensProgramCompiled.validatorHash); j.log({scriptAddress})
        
        const scriptAddressBech32 = scriptAddress.toBech32(); j.log({scriptAddressBech32})

        const txInput = await txInputFromBlockfrost(scriptAddress); j.log({txInput});
        
        const utxoMphTokenNameHex = await getUtxoMphTokenNameHex(scriptAddress,data.mph,data.tokenNameHex); j.log({utxoMphTokenNameHex})
        
        const utxoMphTokenNameHexDatum = utxoMphTokenNameHex.origOutput.datum.data.list; j.log({utxoMphTokenNameHexDatum})
        
        const datumSellerPKH  = utxoMphTokenNameHexDatum[0].hex; j.log({datumSellerPKH})
        
        const buyQty = {qty:0, newTokenTotalPrice:data.datumNFTotalPriceLovelace};
        
        if(!(utxoMphTokenNameHexDatum[2].int >= BigInt(qty)))
        {
            buyQty.qty = utxoMphTokenNameHexDatum[2].int; 
        }
        else
        {
            buyQty.qty = qty;
        }
        
        buyQty.datumNFTotalPriceLovelace = BigInt(buyQty.qty) * BigInt(data.nftUnitPriceLovelace);
        
        const datumNFTQuantity = (utxoMphTokenNameHexDatum[2].int - BigInt(buyQty.qty)).toString(); j.log({datumNFTQuantity})
        
        const newNFTTotalTotensLeft = datumNFTQuantity.toString();j.log({newNFTTotalTotensLeft})

        const datumNFT = new AssetClass(utxoMphTokenNameHexDatum[1].fields[0].hex +"."+utxoMphTokenNameHexDatum[1].fields[1].hex); j.log({datumNFT})
        
        const price_ = utxoMphTokenNameHexDatum[4].int * BigInt(qty);

        const buyselltokensDatum = new (buyselltokensProgram.types.Datum)(datumSellerPKH,datumNFT,newNFTTotalTotensLeft,textToBytes(data.nftId),price_,buyQty.datumNFTotalPriceLovelace ); j.log({buyselltokensDatum})
        
        const inLineDatum = Datum.inline(buyselltokensDatum); j.log({inLineDatum});
        
        const redeemer = (new buyselltokensProgram.types.Redeemer.Buy(baseAddressPKHBuyer,textToBytes(data.nftId),buyQty.qty))._toUplcData();

        const buyerValue = new Value(BigInt(price_)); j.log({buyerValue})
        
        const createSellerAddress = Address.fromHashes(new PubKeyHash(datumSellerPKH)); j.log({createSellerAddress})
        
        const txOutput_seller = new TxOutput(createSellerAddress, buyerValue,inLineDatum); j.log({txOutput_seller}); //send buyer ada to seller
        
        
        const boughtAsset = new hlib.Assets();
        
        boughtAsset.addComponent(data.mph,data.tokenNameHex,buyQty.qty);
        
        const boughtAssetValue = new Value(BigInt(0),boughtAsset); j.log({boughtAssetValue});
        
        const txOutput_buyer = new TxOutput(baseAddress, boughtAssetValue,inLineDatum); j.log({txOutput_buyer}); //send tokens to buyer
        
        
        const assetsLeft = new hlib.Assets();
        
        assetsLeft.addComponent(data.mph,data.tokenNameHex,newNFTTotalTotensLeft);
        
        const assetsLeftValue = new Value(BigInt(0),assetsLeft); j.log({assetsLeftValue});
        
        const txOutputToScript = new TxOutput(scriptAddress,assetsLeftValue,inLineDatum); j.log({txOutputToScript}); //change tokens sent back to script
 
 
        const tx = new Tx();
        
         tx.addInputs(utxos[0]); 
        
        tx.addInput(utxoMphTokenNameHex,redeemer);
        
        tx.attachScript(buyselltokensProgramCompiled);
        
        tx.addOutput(txOutput_seller); 
        
        tx.addOutput(txOutput_buyer);
        
        tx.addOutput(txOutputToScript); 
        
        tx.addSigner(baseAddressPKHBuyer);j.log({tx});

        const txh = await txEnd(tx); j.log({txh});
        
        data.txHash = txh;

        return txh;
        
}

export const cancelAssetsSale =async(buyselltokens)=>{

        const data = JSON.parse(save("data")); j.log({data})

        const mph = data.mph; j.log({mph});

        data.nft = new AssetClass(data.mph+"."+data.tokenNameHex); 
        
        const nftPrice = new Value(BigInt(data.nftUnitPriceLovelace)); j.log({nftPrice})
        
        data.nftPrice = nftPrice

        const minAda = txPrerequisites.minAda;

        const utxos = await walletData.utxos; j.log({utxos})

        const maxTxFee = txPrerequisites.maxTxFee; 
        
        const minChangeAmt = txPrerequisites.minChangeAmt; 

        const walletAPI = await walletData.walletAPI; j.log({walletAPI})
        
        const baseAddress = await walletData.walletHelper.baseAddress; j.log({baseAddress})
        
        const baseAddressPKHBuyer = baseAddress.pubKeyHash; j.log({baseAddressPKHBuyer})
        
        const changeAddr = await walletData.walletHelper.changeAddress; j.log({changeAddr})

        const buyselltokensProgram = Program.new(buyselltokens);

        const sellerPKH = Address.fromBech32(data.seller).pubKeyHash; j.log({sellerPKH})

        const buyselltokensProgramCompiled = buyselltokensProgram.compile(false); j.log({buyselltokensProgramCompiled})

        const scriptAddress = Address.fromHashes(buyselltokensProgramCompiled.validatorHash); j.log({scriptAddress})
        
        const scriptAddressBech32 = scriptAddress.toBech32(); j.log({scriptAddressBech32})

        const txInput = await txInputFromBlockfrost(scriptAddress); j.log({txInput});
        
        const utxoMphTokenNameHex = await getUtxoMphTokenNameHex(scriptAddress,data.mph,data.tokenNameHex); j.log({utxoMphTokenNameHex})
        
        const utxoMphTokenNameHexDatum = utxoMphTokenNameHex.origOutput.datum.data.list; j.log({utxoMphTokenNameHexDatum})

        const tokensQtyLeft = utxoMphTokenNameHexDatum[2].int; 

        const datumNFT = new AssetClass(utxoMphTokenNameHexDatum[1].fields[0].hex +"."+utxoMphTokenNameHexDatum[1].fields[1].hex); j.log({datumNFT})

        const sellerAssets = new hlib.Assets()
        
        sellerAssets.addComponent(utxoMphTokenNameHexDatum[1].fields[0].hex ,utxoMphTokenNameHexDatum[1].fields[1].hex,tokensQtyLeft ); 
        
        const utxoValuePrice = utxoMphTokenNameHexDatum[2].int; 
        
        const sellerValue = new Value(utxoValuePrice,sellerAssets);

        const txOutputToSeller = new TxOutput(baseAddress,sellerValue); j.log({txOutputToSeller}); //change tokens sent back to script
 
        const redeemer = (new buyselltokensProgram.types.Redeemer.Cancel(baseAddress.pubKeyHash,textToBytes(data.nftId)))._toUplcData();
        
        const tx = new Tx();
        
         tx.addInputs(utxos[0]); 
        
        tx.addInput(utxoMphTokenNameHex,redeemer);
        
        tx.attachScript(buyselltokensProgramCompiled);
        
        tx.addOutput(txOutputToSeller); 
        
        tx.addSigner(baseAddress.pubKeyHash);

        const txh = await txEnd(tx); j.log({txh});
        
        data.txHash = txh;

        return txh;
        
}

export const updateAssetsSale =async(buyselltokens,price,qty)=>{

        const data = JSON.parse(save("data")); j.log({data})

        const mph = data.mph; j.log({mph});

        data.nft = new AssetClass(data.mph+"."+data.tokenNameHex); 
        
        const nftPrice = new Value(BigInt(price)); j.log({nftPrice})
        
        data.nftPrice = nftPrice
        
        data.nftQuantity = qty

        const minAda = txPrerequisites.minAda;

        const utxos = await walletData.utxos; j.log({utxos})

        const maxTxFee = txPrerequisites.maxTxFee; 
        
        const minChangeAmt = txPrerequisites.minChangeAmt; 

        const walletAPI = await walletData.walletAPI; j.log({walletAPI})
        
        const baseAddress = await walletData.walletHelper.baseAddress; j.log({baseAddress})
        
        const baseAddressPKHOwner = baseAddress.pubKeyHash; j.log({baseAddressPKHOwner})
        
        const changeAddr = await walletData.walletHelper.changeAddress; j.log({changeAddr})

        const buyselltokensProgram = Program.new(buyselltokens);

        const sellerPKH = Address.fromBech32(data.seller).pubKeyHash; j.log({sellerPKH})
       
        const buyselltokensProgramCompiled = buyselltokensProgram.compile(false); j.log({buyselltokensProgramCompiled})

        const scriptAddress = Address.fromHashes(buyselltokensProgramCompiled.validatorHash); j.log({scriptAddress})
        
        const scriptAddressBech32 = scriptAddress.toBech32(); j.log({scriptAddressBech32})

        const utxoMphTokenNameHex = await getUtxoMphTokenNameHex(scriptAddress,data.mph,data.tokenNameHex); j.log({utxoMphTokenNameHex})
        
        const utxoMphTokenNameHexDatum = utxoMphTokenNameHex.origOutput.datum.data.list; j.log({utxoMphTokenNameHexDatum})
        
        const datumSellerPKH  = utxoMphTokenNameHexDatum[0].hex; j.log({datumSellerPKH})
        
        const buyQty = {qty:0, newTokenTotalPrice:data.datumNFTotalPriceLovelace};

        buyQty.datumNFTotalPriceLovelace = utxoMphTokenNameHexDatum[2].int * BigInt(price); 
        
        data.nftUnitPriceLovelace = price;

        const datumNFT = new AssetClass(utxoMphTokenNameHexDatum[1].fields[0].hex +"."+utxoMphTokenNameHexDatum[1].fields[1].hex); j.log({datumNFT})
        
        data.nftQuantity = utxoMphTokenNameHexDatum[2].int;

        const buyselltokensDatum = new (buyselltokensProgram.types.Datum)(datumSellerPKH,datumNFT,utxoMphTokenNameHexDatum[2].int,textToBytes(data.nftId),price,(BigInt(price) * utxoMphTokenNameHexDatum[2].int)); j.log({buyselltokensDatum})
        
        const inLineDatum = Datum.inline(buyselltokensDatum); j.log({inLineDatum});
        
        const redeemer = (new buyselltokensProgram.types.Redeemer.Update(baseAddressPKHOwner,textToBytes(data.nftId),data.nftUnitPriceLovelace,data.nftQuantity))._toUplcData();
        
        const sValue = utxoMphTokenNameHex.value; j.log({sValue})

        //const rAsset = new hlib.Assets()
        
        //rAsset.addComponent(data.mph,data.tokenNameHex,utxoMphTokenNameHexDatum[2].int)
        
        //const nValue = new Value(sValue,rAsset); j.log({nValue})

        const txOutputToScript = new TxOutput(scriptAddress,sValue,inLineDatum); j.log({txOutputToScript}); //change tokens sent back to script
 
        const tx = new Tx();
        
        tx.addInputs(utxos[0]); 
        
        tx.addInput(utxoMphTokenNameHex,redeemer);
        
        tx.attachScript(buyselltokensProgramCompiled);

        tx.addOutput(txOutputToScript); 
        
        tx.addSigner(baseAddressPKHOwner);j.log({tx});

        const txh = await txEnd(tx); j.log({txh});
        
        data.txHash = txh;
        
        //save("data",JSON.stringify(data));

        return txh;
        
}

const getTicketMetadataCIP25 = async (asset,blockfrostapi) => {

        const API = new BlockFrostAPI({
            projectId: blockfrostapi
          });

        const ticketMetadata = await API.assetsById(asset);

        const utxoId = ticketMetadata.onchain_metadata.utxoId;
        const utxoIdx = ticketMetadata.onchain_metadata.utxoIdx;
        const name = ticketMetadata.onchain_metadata.name;
        const location = ticketMetadata.onchain_metadata.location;
        const image = ticketMetadata.onchain_metadata.image;
        const paymentPKH = ticketMetadata.onchain_metadata.paymentPKH;
        const stakePKH = ticketMetadata.onchain_metadata.stakePKH;
        const qty = ticketMetadata.onchain_metadata.qty;
        const holdValHash = ticketMetadata.onchain_metadata.holdValHash;
        const minLovelace = ticketMetadata.onchain_metadata.minLovelace;
        const showtime = ticketMetadata.onchain_metadata.showtime;

        var imageSrc
        if (Array.isArray(image)) {
          imageSrc = image.join('')
        } else {
          imageSrc = image
        }

        const ticketInfo = new Ticket(
            utxoId,
            utxoIdx,
            Buffer.from(name).toString('hex'),
            location,
            showtime,
            imageSrc,
            qty,
            paymentPKH,
            stakePKH,
            holdValHash,
            minLovelace,
        );
       return ticketInfo;
    }
    
const getTicketMetadataCIP68 = async (asset,apiKey) => {

    const API = new BlockFrostAPI({
        projectId: apiKey
      });

    const ticketMetadata = await API.assetsById(asset);
   
    const name = ticketMetadata.onchain_metadata.name;
    const image = ticketMetadata.onchain_metadata.image;
    
    const extraData = ticketMetadata.onchain_metadata_extra;
    const mapData = MapData.fromCbor(hexToBytes(extraData));
    
    const mapDataJSON = JSON.parse(mapData.toSchemaJson())
    const location = Buffer.from(mapDataJSON.map[0].v.bytes, 'hex').toString()
    const showtime = mapDataJSON.map[1].v.int
    const pkh = mapDataJSON.map[2].v.bytes

    const printTicket = new PrintTicketInfo(
        asset,
        asset.slice(0,56),
        name,
        location,
        showtime,
        image,
        pkh == "" ? undefined : pkh
    );
    return printTicket;
}

// more functions 

export const bech32ToPkh =(addressBech32)=>{
    const addrp = addressBech32.substr(0,9); j.log({addrp})
    const addressIsBech32 = addrp == "addr_test"; j.log({addressIsBech32})
    if(addressIsBech32)
    {
        const address = Address.fromBech32(addressBech32); j.log({address})
        const addressPkh = address.pubKeyHash; j.log({addressPkh})
        return addressPkh;  
    }
    else
    {
        const msg ="Bech32 address is not correct"; j.log({msg})
        
        return msg;
    }

}

export const bech32ToValidatorHash =(addressBech32)=>{
    const addrp = addressBech32.substr(0,9); j.log({addrp})
    const addressIsBech32 = addrp == "addr_test"; j.log({addressIsBech32})
    if(addressIsBech32)
    {
        const address = Address.fromBech32(addressBech32); j.log({address})
        const addressPkh = address.validatorHash; j.log({addressPkh})
        return addressPkh;  
    }
    else
    {
        const msg ="Bech32 address is not correct"; j.log({msg})
        
        return msg;
    }

}

export const updateNFT =async(scriptForLockingNFT,scriptForMintingNFT,data)=>{
    
        const minAda = txPrerequisites.minAda; 
        
        const maxTxFee = txPrerequisites.maxTxFee;
        
        const minChangeAmt = txPrerequisites.minChangeAmt; 
        
        const minAdaVal = new Value(BigInt(minAda));
        
        const minUTXOVal = new Value(BigInt(minAda + maxTxFee + minChangeAmt));
        
        const baseAddress = await walletData.walletHelper.baseAddress; j.log({baseAddress})

        const changeAddr = await walletData.walletHelper.changeAddress; j.log({changeAddr})

        const ownerPKH = baseAddress.pubKeyHash;
        
        const utxos = await walletData.utxos; j.log({utxos})

        const walletAPI = await walletData.walletAPI; j.log({walletAPI})
    
        const baseAddressPKH = baseAddress.pubKeyHash; j.log({baseAddressPKH})

        const baseAddressPKHHex = baseAddressPKH.hex; j.log({baseAddressPKHHex})
        
        const baseAddressBech32 = baseAddress.toBech32(); j.log({baseAddressBech32})

        const baseAddressStakingHash = baseAddress.stakingHash; j.log({baseAddressStakingHash})
        
        const ownerBytes = baseAddressPKH.bytes; j.log({ownerBytes})
        
        const addressFromHashAndStakingKeyHash = Address.fromHashes(baseAddressPKH,baseAddressStakingHash).toBech32();j.log({addressFromHashAndStakingKeyHash})
        
       
        const lockTokenScript = scriptForLockingNFT;
        
        const lockTokenScriptProgram = Program.new(lockTokenScript);
    
        lockTokenScriptProgram.parameters = {["OWNER"] : ownerBytes};

        const lockTokenScriptProgramCompiled = lockTokenScriptProgram.compile(false);
        
        const lockTokenScriptAddress = Address.fromHashes(lockTokenScriptProgramCompiled.validatorHash); j.log({lockTokenScriptAddress})
        
        const lockTokenScriptProgramCompiledValidatorHash = lockTokenScriptProgramCompiled.validatorHash.hex;j.log({lockTokenScriptProgramCompiledValidatorHash})

        const lockTokenScriptAddressBech32 = lockTokenScriptAddress.toBech32();j.log({lockTokenScriptAddressBech32})
        
        
        const scriptReferenceToken = Program.new(scriptForMintingNFT);

        scriptReferenceToken.parameters = {["ownerPKH"] : baseAddress.pubKeyHash};
        
        scriptReferenceToken.parameters = {["TN"] : data.tokenNameHex};
        
        const scriptReferenceTokenCompiled = scriptReferenceToken.compile(false);
        
        const scriptReferenceTokenCompiledPolicyHashHexMPH = scriptReferenceTokenCompiled.mintingPolicyHash.hex;j.log({scriptReferenceTokenCompiledPolicyHashHexMPH})

        
        const utxoMphTokenNameHex = await getUtxoMphTokenNameHex(lockTokenScriptAddress,data.mphHex,data.tokenNameHex); j.log({utxoMphTokenNameHex})
 
        const utxoMph = scriptReferenceTokenCompiledPolicyHashHexMPH; j.log({utxoMph})
        
        const utxoId_ = utxoMphTokenNameHex.outputId.txId.hex; j.log({utxoId_})
        
        const utxoIdx_ = utxoMphTokenNameHex.utxoIdx; j.log({utxoIdx_})
        
        const utxoTokenName = data.tokenNameHex; j.log({utxoTokenName})

        const tx = new Tx();
        
        tx.addInputs(utxos[0]);

        const utxoId = utxoMphTokenNameHex.txId.hex; j.log({utxoId})
        
        const utxoIdx = utxoMphTokenNameHex.utxoIdx; j.log({utxoIdx})
        
        const mintRedeemer = (new lockTokenScriptProgram.types.Redeemer.BurnLocked())._toUplcData(); j.log({mintRedeemer})

        const tokens = [[utxoTokenName, BigInt(data.quantity)]];  j.log({tokens})
        
        const assets = new Assets([[utxoMph,tokens]]); j.log({assets});

        //tx.attachScript(scriptReferenceTokenCompiled);
        
        tx.attachScript(lockTokenScriptProgramCompiled);
        
        tx.addInput(utxoMphTokenNameHex,mintRedeemer);

        tx.addOutput(new TxOutput(lockTokenScriptAddress,new Value(hlib.minAda)));

        tx.addSigner(ownerPKH); 
        
        data.utxoId = utxoId;
        
        data.utxoIdx = utxoIdx;
        
        data.policyId = data.mph; j.log({data})
        
        tx.validTo(data.deadline);
    
        tx.addMetadata(721,generateMetadata(data)); 
        
        const txh = await txEnd(tx); j.log({txh});

        return txh;
        
}


export   const mintBurnToken = async (scriptForMintingNFT,scriptForLockingNFT,info) => {

        const minAda = txPrerequisites.minAda; 
        
        const maxTxFee = txPrerequisites.maxTxFee;
        
        const minChangeAmt = txPrerequisites.minChangeAmt; 
        
        const minAdaVal = new Value(BigInt(minAda));
        
        const minUTXOVal = new Value(BigInt(minAda + maxTxFee + minChangeAmt));
        
        const baseAddress = await walletData.walletHelper.baseAddress; j.log({baseAddress})

        const changeAddr = await walletData.walletHelper.changeAddress; j.log({changeAddr})

        const ownerPKH = baseAddress.pubKeyHash;
        
        const utxos = await walletData.utxos; j.log({utxos})

        const walletAPI = await walletData.walletAPI; j.log({walletAPI})
    
        const baseAddressPKH = baseAddress.pubKeyHash; j.log({baseAddressPKH})

        const baseAddressPKHHex = baseAddressPKH.hex; j.log({baseAddressPKHHex})
        
        const baseAddressBech32 = baseAddress.toBech32(); j.log({baseAddressBech32})

        const baseAddressStakingHash = baseAddress.stakingHash; j.log({baseAddressStakingHash})
        
        const ownerBytes = baseAddressPKH.bytes; j.log({ownerBytes})
        
        const addressFromHashAndStakingKeyHash = Address.fromHashes(baseAddressPKH,baseAddressStakingHash).toBech32();j.log({addressFromHashAndStakingKeyHash})
        
        const tx = new Tx();
        
        tx.addInputs(utxos[0]);
        
        const utxoId = utxos[0][0].outputId.txId.hex; j.log({utxoId})
        
        const utxoIdx = utxos[0][0].outputId.utxoIdx; j.log({utxoIdx})

        const refTokenScript = scriptForMintingNFT;
        
        const scriptReferenceToken = Program.new(refTokenScript);

        const tokenName_ = info.assetName; j.log({tokenName_})

        scriptReferenceToken.parameters = {["ownerPKH"] : baseAddress.pubKeyHash};
        
        scriptReferenceToken.parameters = {["TN"] : tokenName_};
        
        const scriptReferenceTokenCompiled = scriptReferenceToken.compile(false);

        const scriptReferenceTokenCompiledPolicyHashHexMPH = scriptReferenceTokenCompiled.mintingPolicyHash.hex;j.log({scriptReferenceTokenCompiledPolicyHashHexMPH})

        tx.attachScript(scriptReferenceTokenCompiled);
        
        const lockTokenScript = scriptForLockingNFT;
        
        const lockTokenScriptProgram = Program.new(lockTokenScript);
    
        lockTokenScriptProgram.parameters = {["OWNER"] : ownerBytes};

        const lockTokenScriptProgramCompiled = lockTokenScriptProgram.compile(false);
        
        const lockTokenScriptAddress = Address.fromHashes(lockTokenScriptProgramCompiled.validatorHash); j.log({lockTokenScriptAddress})
        
        const lockTokenScriptProgramCompiledValidatorHash = lockTokenScriptProgramCompiled.validatorHash.hex;j.log({lockTokenScriptProgramCompiledValidatorHash})

        const lockTokenScriptAddressBech32 = lockTokenScriptAddress.toBech32();j.log({lockTokenScriptAddressBech32})

        const tokens = [[tokenName_, BigInt(info.quantity)]]; 
        
        const assets = new Assets([[scriptReferenceTokenCompiledPolicyHashHexMPH,tokens]]); j.log({assets});

        info.utxoId = utxoId;
        
        info.utxoIdx = utxoIdx;

        const mintRedeemer = (new lockTokenScriptProgram.types.Redeemer.LockTokenProperty(scriptReferenceTokenCompiledPolicyHashHexMPH,utxoId,BigInt(utxoIdx),tokenName_))._toUplcData();

        tx.mintTokens(scriptReferenceTokenCompiledPolicyHashHexMPH,tokens,mintRedeemer);
     
        tx.addOutput(new TxOutput(lockTokenScriptAddress,new Value(hlib.minAda, assets),info.cip68InlineDatum));

        tx.addSigner(ownerPKH);  

        tx.validTo(info.deadline);
        
        info.policyId = scriptReferenceTokenCompiledPolicyHashHexMPH; j.log({info})
    
        tx.addMetadata(721,generateMetadata(info)); 
        
        const txh = await txEnd(tx); j.log({txh});

        return txh;

  }

// export   const spendTokenUtxo = async (scriptForMintingNFT,scriptForLockingNFT,info) => {

//         const minAda = txPrerequisites.minAda; 
        
//         const maxTxFee = txPrerequisites.maxTxFee;
        
//         const minChangeAmt = txPrerequisites.minChangeAmt; 
        
//         const minAdaVal = new Value(BigInt(minAda));
        
//         const minUTXOVal = new Value(BigInt(minAda + maxTxFee + minChangeAmt));
        
//         const baseAddress = await walletData.walletHelper.baseAddress; j.log({baseAddress})

//         const changeAddr = await walletData.walletHelper.changeAddress; j.log({changeAddr})

//         const ownerPKH = baseAddress.pubKeyHash;
        
//         const utxos = await walletData.utxos; j.log({utxos})

//         const walletAPI = await walletData.walletAPI; j.log({walletAPI})
    
//         const baseAddressPKH = baseAddress.pubKeyHash; j.log({baseAddressPKH})

//         const baseAddressPKHHex = baseAddressPKH.hex; j.log({baseAddressPKHHex})
        
//         const baseAddressBech32 = baseAddress.toBech32(); j.log({baseAddressBech32})

//         const baseAddressStakingHash = baseAddress.stakingHash; j.log({baseAddressStakingHash})
        
//         const ownerBytes = baseAddressPKH.bytes; j.log({ownerBytes})
        
//         const addressFromHashAndStakingKeyHash = Address.fromHashes(baseAddressPKH,baseAddressStakingHash).toBech32();j.log({addressFromHashAndStakingKeyHash})
        
//         const tx = new Tx();
        
       
        
//         const utxoId = utxos[0][0].outputId.txId.hex; j.log({utxoId})
        
//         const utxoIdx = utxos[0][0].outputId.utxoIdx; j.log({utxoIdx})

//         const refTokenScript = scriptForMintingNFT;
        
//         const scriptReferenceToken = Program.new(refTokenScript);

//         const tokenName_ = info.assetName; j.log({tokenName_})

//         scriptReferenceToken.parameters = {["ownerPKH"] : baseAddress.pubKeyHash};
        
//         scriptReferenceToken.parameters = {["TN"] : tokenName_};
        
//         const scriptReferenceTokenCompiled = scriptReferenceToken.compile(false);

//         const scriptReferenceTokenCompiledPolicyHashHexMPH = scriptReferenceTokenCompiled.mintingPolicyHash.hex;j.log({scriptReferenceTokenCompiledPolicyHashHexMPH})

//         tx.attachScript(scriptReferenceTokenCompiled);
        
//         tx.addInputs(utxos[0]);
        
//         const lockTokenScript = scriptForLockingNFT;
        
//         const lockTokenScriptProgram = Program.new(lockTokenScript);
    
//         lockTokenScriptProgram.parameters = {["OWNER"] : ownerBytes};

//         const lockTokenScriptProgramCompiled = lockTokenScriptProgram.compile(false);
        
//         const lockTokenScriptAddress = Address.fromHashes(lockTokenScriptProgramCompiled.validatorHash); j.log({lockTokenScriptAddress})
        
//         const lockTokenScriptProgramCompiledValidatorHash = lockTokenScriptProgramCompiled.validatorHash.hex;j.log({lockTokenScriptProgramCompiledValidatorHash})

//         const lockTokenScriptAddressBech32 = lockTokenScriptAddress.toBech32();j.log({lockTokenScriptAddressBech32})
        
//         const lockTokenScriptProgramDatum = new (lockTokenScriptProgram.types.Datum)(scriptReferenceTokenCompiledPolicyHashHexMPH,utxoId,BigInt(utxoIdx),ownerBytes); j.log({lockTokenScriptProgramDatum})
        
//         const inLineDatum = Datum.inline(lockTokenScriptProgramDatum); j.log({inLineDatum});

//         const tokens = [[tokenName_, BigInt(info.quantity)]]; 
        
//         const assets = new Assets([[scriptReferenceTokenCompiledPolicyHashHexMPH,tokens]]); j.log({assets});

//         info.utxoId = utxoId;
        
//         info.utxoIdx = utxoIdx;

//         const mintRedeemer = (new scriptReferenceToken.types.Redeemer.Mint(utxoId,BigInt(utxoIdx),BigInt(info.quantity)))._toUplcData();

//         tx.mintTokens(scriptReferenceTokenCompiledPolicyHashHexMPH,tokens,mintRedeemer);

//         tx.addOutput(new TxOutput(lockTokenScriptAddress,new Value(hlib.minAda, assets),inLineDatum));

//         tx.addSigner(ownerPKH);  
        
//         info.policyId = scriptReferenceTokenCompiledPolicyHashHexMPH; j.log({info})
    
//         tx.addMetadata(721,generateMetadata(info)); 
        
//         const txh = await txEnd(tx); j.log({txh});

//         return txh;

//   }

//const arList = [[owner_pkh,ownerPkh],[tn,tokenName]]
  
export const scriptAddParams=(script,arList)=>{
   if(arList.length > 0)
   {			
		for(let i = 0; i < arList.length; i++){
		  const [key,value] = arList[i];
		  script.parameters={[key.toString().toUpperCase()]:value}
		}
	}
	return script;	  
}

export const refTokenCip68AssetFromMphTnName =(mph,tnName,qty=1)=>{
        
    const qtyOb = {qty:1}
    
    if(qty != 1)
    {
        qtyOb.qty = -1;
    }
    
    const label100hex = "000643b0";  j.log({label100hex})
    
    const reftokenName = label100hex + bytesToHex(textToBytes((tnName))); j.log({reftokenName})
    
    const refTokenAssetClass = [hexToBytes(reftokenName),BigInt(qtyOb.qty)]; j.log({refTokenAssetClass})
    
    const cip68Asset_ = new Assets([[mph , [refTokenAssetClass]]]); j.log({cip68Asset_})
    
    return cip68Asset_;
}

export const refTokenCip68AssetFromMPHAssetClass=(mph,assetClassCIP68)=>{
    
	const cip68Asset_ = new Assets([[mph , [assetClassCIP68]]]); j.log({cip68Asset_})	
	
	return cip68Asset_;
 }
 
export const refTokenAssetClassCIP68 =(createCIP68ReferenceTokenName,qty=1)=>{
    
    const qtyOb = {qty:1}
    
    if(qty != 1)
    {
        qtyOb.qty = -1;
    }

    const refTokenAssetClass = [hexToBytes(createCIP68ReferenceTokenName),BigInt(qtyOb.qty)]; j.log({refTokenAssetClass})
    
    return refTokenAssetClass;
}

export const createCIP68Token=(tnNameString,intLabel)=>{
    
    if(intLabel == 666)
    {
        return createCIP68CustomToken666(tnNameString);
    }
    else if(intLabel == 555)
    {
       return createCIP68CustomToken555(tnNameString); 
    }
    else if(intLabel == 444)
    {
       return createCIP68RFT444(tnNameString); 
    }
    else if(intLabel == 333)
    {
        return createCIP68FT333(tnNameString);
    }
    else if(intLabel == 222)
    {
       return createCIP68NFT222(tnNameString); 
    }
    else if(intLabel == 100)
    {
        return createCIP68RefToken100(tnNameString);
    }
    else
    {
        const msg = "CIP68 unknown label";
        
        j.log({msg})
        
        return msg
    }
}


export const createCIP68CustomToken666=(tokenName)=>{
    
    const label666hex = "0029ae50";  j.log({label666hex})
    
    const tokenName666 = label666hex + bytesToHex(textToBytes((tokenName))); j.log({tokenName666})
    
    return tokenName666;
}

export const createCIP68CustomToken555=(tokenName)=>{
    
    const label555hex = "0022bfb0".toString().trim();  j.log({label555hex})
    
    const tokenName555 = label555hex + bytesToHex(textToBytes((tokenName.toString().trim()))); j.log({tokenName555})
    
    return tokenName555;
}

export const createCIP68RefToken100=(tokenName)=>{
    
    const label100hex = "000643b0";  j.log({label100hex})
    
    const tokenName100 = label100hex + bytesToHex(textToBytes((tokenName))); j.log({tokenName100})
    
    return tokenName100;
}

export const createCIP68NFT222=(tokenName)=>{
    
    const label1222hex = "000de140";  j.log({label1222hex})
    
    const cip68NFT222 = label1222hex + bytesToHex(textToBytes((tokenName))); j.log({cip68NFT222})
    
    return cip68NFT222;
}

export const createCIP68RFT444=(tokenName)=>{
    
    const label444hex = "001bc280";  j.log({label444hex})
    
    const cip68RFT444 = label444hex + bytesToHex(textToBytes((tokenName))); j.log({cip68RFT444})
    
    return cip68RFT444;
}

export const createCIP68FT333=(tokenName)=>{
    
    const label333hex = "0014df10";  j.log({label333hex})
    
    const cip68NFT333 = label333hex + bytesToHex(textToBytes((tokenName))); j.log({cip68NFT333})
    
    return cip68NFT333;
}
 
//txOutput(tx,scriptAddressHash,amount,datum,tokenName,qty)
export const txOutput =(tx,scriptAddressHash,amount,datum,tokenName,qty)=>{
        
        const adaToSend = new Value(BigInt(amount)); j.log({adaToSend})            
        const lovelaceToSend = adaToSend.lovelace; j.log({lovelaceToSend})
        const qtyBInt = BigInt(qty); j.log({qtyBInt})
        const asset_ = new Asset([textToBytes(tokenName),qtyBInt]); j.log({asset_})
        const value_ = new Value(lovelaceToSend,asset_); j.log({value_});            
        const inLineDatum = Datum.inline(datum); j.log({inLineDatum});            
        const txOutput = new TxOutput(scriptAddressHash, value_,inLineDatum); j.log({txOutput});  
        
        tx.addOutput(txOutput);
		
		return tx;
}

export const stringToByteArray =(itemString)=>{
	const bA = new ByteArrayData(textToBytes(itemString));
	return bA
  }
  
export   const hexToByteArray =(itemHex)=>{
	const hA = new ByteArrayData(hexToBytes(itemHex));
	return hA
  }
 
export const compileScript =(scriptName)=>{	 
	 const scriptCompiled = (Program.new(scriptName)).compile(true);		 
	 return scriptCompiled;
 }
 
export const createAssetClass=(mphHex,tokenNameHex)=>{
   return new AssetClass(mphHex+"."+tokenNameHex); 
}

export const createAsset=(mphHex,tokenNameHex,qty)=>{
    
    const asset_ = new hlib.Assets()
    
    asset_.addComponent(mphHex,tokenNameHex,qty); 
    
    return asset_;
}
 
//example mapData lists

// const arList = ["name","location","image","ownerpkh","owneraddr"]
// const arListv = ["james","50 elizabeth ave","imageurl","96cef510056acff324536fc3e5e6be32a49","addr_test1wzngf7vh6sdkuk72um8tk70f23v7n7w7w8adgjdpzdt7dmcc3awcd"]
 
//example extraData lists

// const arListx = ["erf","price"]
// const arListvx = ["41254erf","452.36"]

//testing the keyValueList function

// const ans = keyValueList(arList,arListv); j.log({ans})

// const mapData = new MapData(ans); j.log({mapData})

// const version = new IntData(BigInt("2"));

// const extraData = new MapData(keyValueList(arListx,arListvx)); j.log({extraData})

// const cip068Datum = new ConstrData(0, [mapData, version, extraData]);

// const cip68InlineDatum = Datum.inline(cip068Datum); j.log({cip68InlineDatum})

// const cip68InlineDatumString = cip68InlineDatum.dump(); j.log({cip68InlineDatumString})

export  const keyValueList =(arList,arListv)=>{

    const hexKV = [];

    if(arList.length > 0)
    {			
    	for(let i = 0; i < arList.length; i++){
            hexKV.push([new ByteArrayData(textToBytes(arList[i]+"Key")),new ByteArrayData(textToBytes(arListv[i]))])
    	}
    }
    return hexKV;
}
  
export const  txValidTimeRange = (tx,noHrsFromNow)=>{
    
    const currentTime = new Date().getTime();
    
    const earlierTime = new Date(currentTime - 5 * 60 * 1000);
    
    const laterTime = new Date(currentTime + noHrsFromNow * 60 * 60 * 1000);

     if(earlierTime < laterTime)
	 {
	   tx.validFrom(earlierTime);
	   tx.validTo(laterTime);		 
	 }
	 else
	 {
	   tx.validFrom(laterTime);
	   tx.validTo(earlierTime);		
	 }
      return tx;
  }

//const pkhList = [pkh1,pkh2,pkh3]
export const txSigners =(tx,pkhList)=>{
    if(pkhList.length > 0)
    {			
    	for(let i = 0; i < pkhList.length; i++){
    		tx.addSigner(pkhList[i]);
    	}
    }
    return tx;
}

export const id=(length)=> {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}
  
//const dataList = [tokenTN,tokenQty,mphHex,lovelace];	
export	const txCreateOutput=(tx,changeAddress,dataList)=>{	
	const asset = new Assets();
	asset.addComponent(mphBin(dataList[i].mphHex),textToBytes(dataList[i].tokenTN),BigInt(dataList[i].tokenQty));	
	const assetMap = new Value();
	for(let i = 0; i < dataList.length; i++)
	{				
		const tokenNameBytes = textToBytes(dataList[i].tokenTN);	
		const sellerTokenMap = [[tokenNameBytes,BigInt(dataList[i].tokenQty)]];		
		const tokenAsset = new Assets([[mphBin(dataList[i].mphHex), sellerTokenMap]]);		
		const tokenValue = new Value(BigInt(dataList[i].lovelace), tokenAsset); 
		assetMap.add(tokenValue);		
		tx.addOutput(new TxOutput(
			 changeAddress,
			 assetMap
		));
	}
	return tx;	
}
	
export const txCreateOutput_2 =(tx,arList1,arList2,VersionNo,refAssets,scriptAddress,minLovelace)=>{

  const mapData = new MapData( keyValueList(arList1));			  
  const version = new IntData(BigInt(VersionNo));		  
  const extraData = new MapData(keyValueList(arList2));		   
  const cip068Datum = new ConstrData(0, [mapData, version, extraData]);		  
  const cip68InlineDatum = Datum.inline(cip068Datum);
  tx.addOutput(new TxOutput(scriptAddress,new Value(minLovelace, refAssets),cip68InlineDatum));
  
  return tx

}

const mphBin = (mphHex)=>{	
 return  MintingPolicyHash.fromHex(mphHex);
}



 