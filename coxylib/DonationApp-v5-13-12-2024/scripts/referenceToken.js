export const referenceToken = 
`
minting referenceToken

enum Redeemer{
    Mint
}

const VERSION: ByteArray = #

const OWNER : ByteArray = #

const OWNER_PKH : PubKeyHash = PubKeyHash::new(OWNER)

func main(redeemer: Redeemer, ctx: ScriptContext) -> Bool {
    tx: Tx = ctx.tx;
    print("VERSION: " + VERSION.show());

    nft_assetclass: AssetClass = AssetClass::new(
        ctx.get_current_minting_policy_hash(),
        "Reference Token".encode_utf8()
    );
    
    redeemer.switch{
        Mint =>{
        
            value_minted: Value = tx.minted;

            value_minted == Value::new(nft_assetclass, 1) && tx.is_signed_by(OWNER_PKH)
        }
    }


}

`