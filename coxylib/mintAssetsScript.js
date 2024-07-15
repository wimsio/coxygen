export const mintAssetsScript = (txIdHex,utxoIdx,name)=>{

return `
//--------------------------BEGIN ONCHAIN HELIOS SCRIPT CODE---
//Modify script function parameters as per need

minting nft
enum Redeemer { 
	Init 
}

const TX_ID: ByteArray = #` + txIdHex + `
const txId: TxId = TxId::new(TX_ID)
const outputId: TxOutputId = TxOutputId::new(txId, ` + utxoIdx + `)
const TN: String = "`+name+`"

func main(_,ctx: ScriptContext) -> Bool {
	tx: Tx = ctx.tx;
	mph: MintingPolicyHash = ctx.get_current_minting_policy_hash();

	tt_assetclass: AssetClass = AssetClass::new(
		mph, 
		TN.encode_utf8()
	);

	value_minted: Value = tx.minted;
	(value_minted == Value::new(tt_assetclass, 1)).trace("NFT1: ") &&
	tx.inputs.any((input: TxInput) -> Bool {
						(input.output_id == outputId).trace("NFT2: ")
						}
	)
}

//--------------------------END ONCHAIN HELIOS SCRIPT CODE---
`;

}

