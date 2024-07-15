
export const mintAssets = async (walletData,name,description,imageUrl,txPrerequisites,j,hlib,txFunc,mintAssetsScript) => 
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