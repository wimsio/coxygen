import {
			bytesToHex,Cip30Wallet,WalletHelper,TxOutput,
			Assets,bytesToText,hexToBytes,AssetClass,
			Tx,Address, NetworkParams, Value,MintingPolicyHash,Program,ByteArrayData,ConstrData
		} from "./js/helios.js";
		
import {opt,j} from "./js/jimba.js";
		
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
        j.log({error});		
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
        j.log({error});	
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
    j.log({error});	
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
    .catch(function (error){ j.log({error});
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
			 j.log({error});
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
        j.log({error});
	}	
	
}

const shortAddressFunc = async (walletData,j)=>{
    const baseAddress = (await walletData.walletHelper.baseAddress); j.log({baseAddress});
    const bech32Address = baseAddress.toBech32(); j.log({bech32Address});
    const shortAddress = bech32Address.toString().slice(0,10) +"..."+ bech32Address.toString().substr(bech32Address.length - 5); j.log({shortAddress});
    return shortAddress;
}

const addressFunc = async (walletData,j)=>{
    const baseAddress = (await walletData.walletHelper.baseAddress); j.log({baseAddress});
    const bech32Address = baseAddress.toBech32(); j.log({bech32Address});
    return bech32Address;
}

const adaFunc = async (walletData,j)=>{
    const balanceLovelace = (await walletData.walletHelper.calcBalance()).lovelace.toString(); j.log({balanceLovelace});
    return balanceLovelace;
}

const assetFunc = async (walletData,AssetClass,j)=>{
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

