export const vesting = 
`
spending vesting
const VERSION: String = "1.0.0"

struct Datum {
    seller: PubKeyHash
    nft:AssetClass
    nftPrice : Int
}

enum Redeemer {
    Cancel
    Buy {
        id: String
        buyer:PubKeyHash
    }
}

const ID: String = "41"

func main(datum: Datum, redeemer: Redeemer, ctx: ScriptContext) -> Bool {
    tx: Tx = ctx.tx;
    redeemer.switch {
        Cancel => {
            tx.is_signed_by(datum.seller) 
        },
        red: Buy => {
            red.id == ID  &&
            tx.is_signed_by(red.buyer) &&
            tx
             .value_sent_to(red.buyer)
             .contains(Value::new(datum.nft,1)) &&
            tx
             .value_sent_to(datum.seller)
             .contains(Value::lovelace(datum.nftPrice)) 
            
        }
    }    
}
`