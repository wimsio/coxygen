export const referenceTokenPropertySale = 
`
minting referenceTokenPropertySale

enum Redeemer{
    Mint
    Burn
}

const OWNER : ByteArray = #

const OWNER_PKH : PubKeyHash = PubKeyHash::new(OWNER)

const REFERENCE_TOKEN_NAME_CIP68_100: ByteArray = #

const TX_ID: ByteArray = #

const TX_IDX: Int = 0

const txId: TxId = TxId::new(TX_ID)

const outputId: TxOutputId = TxOutputId::new(txId, TX_IDX)

func main(redeemer: Redeemer, ctx: ScriptContext) -> Bool {

    tx: Tx = ctx.tx;
    
    mph: MintingPolicyHash = ctx.get_current_minting_policy_hash();

    nft_assetclass: AssetClass = AssetClass::new(mph,REFERENCE_TOKEN_NAME_CIP68_100);
    
    redeemer.switch{
    
        Mint =>{
        
            value_minted: Value = tx.minted;

            value_minted == Value::new(nft_assetclass, 1) 
            
            && 
            
            tx.is_signed_by(OWNER_PKH)
            
            &&
            
            tx.inputs.any((input: TxInput) -> Bool {(input.output_id == outputId)}) 
        },
         Burn =>{
         
          tx.minted.get_policy(mph).all( (_, amount: Int) -> Bool { amount >= -1})

          && 
            
          tx.is_signed_by(OWNER_PKH)
        }
    }


}

`