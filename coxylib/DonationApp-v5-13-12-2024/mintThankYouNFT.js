export const mintThankYouNFT = 
`
 minting ticket
              enum Redeemer { 
        	    Mint 
        	    Burn
        	}
        
        	const TX_ID: ByteArray = #abc123
        	const tx_id: TxId = TxId::new(TX_ID)
        	const TX_IDX: Int = 0
        	const output_id: TxOutputId = TxOutputId::new(tx_id, TX_IDX)
        	const TN: String = ""
        	const QTY: Int = 1
        
        	func main(redeemer: Redeemer, ctx: ScriptContext) -> Bool {
        	    tx: Tx = ctx.tx;
        	    mph: MintingPolicyHash = ctx.get_current_minting_policy_hash();
        	    tn_assetclass: AssetClass = AssetClass::new(
        		mph, 
        		TN.encode_utf8()
        	    );
        	    value_minted: Value = tx.minted;
        	    redeemer.switch {
        		Mint => {
        		    (value_minted == Value::new(tn_assetclass, QTY)).trace("NFT minted: ") 
        		    &&
        		    tx.inputs.any((input: TxInput) -> Bool {
        		                        (input.output_id == output_id).trace("NFT output_id: ")
        		                        }
        		                    ) 
        		},
        		Burn => {
        		    (value_minted.get(tn_assetclass) < 0).trace("NFT burnt: ")
        		}
        	    } 
        	}
`