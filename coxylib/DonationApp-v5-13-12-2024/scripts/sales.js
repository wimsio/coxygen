export const sales = 
`
spending sales

struct Datum {
    seller: PubKeyHash 
    nft:AssetClass
    nftPrice:Value
    nftId:ByteArray
    func update(self, seller: PubKeyHash, nftPrice : Value, nftId:ByteArray) -> Datum {
        self.copy(seller:seller,nftPrice:nftPrice,nftId:nftId)
    }
}
enum Redeemer {
    Cancel{
        seller:PubKeyHash
        nftId:ByteArray
    }
    Update{
        seller:PubKeyHash
        nftId:ByteArray
        nftPrice:Value
    }
    Buy{
        buyer: PubKeyHash
        amount: Value
        nftId: ByteArray
    }
}    

func jlogAssetClass(title:String,variable:AssetClass)->(){
    print(">>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    print(">>> Logging : "+title.show());
    print(">>> "+variable.show());
    print("<<<<<<<<<<<<<<<<<<<<<<<<<<<<")
}

func jlogInt(title:String,variable:Int)->(){
    print(">>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    print(">>> Logging : "+title.show());
    print(">>> "+variable.show());
    print("<<<<<<<<<<<<<<<<<<<<<<<<<<<<")
}
func jlogByteArray(title:String,variable:ByteArray)->(){
    print(">>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    print(">>> Logging : "+title.show());
    print(">>> "+variable.show());
    print("<<<<<<<<<<<<<<<<<<<<<<<<<<<<")
}
func jlogValue(title:String,variable:Value)->(){
    print(">>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    print(">>> Logging : "+title.show());
    print(">>> "+variable.show());
    print("<<<<<<<<<<<<<<<<<<<<<<<<<<<<")
}
func jlogPKH(title:String,variable:PubKeyHash)->(){
    print(">>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    print(">>> Logging : "+title.show());
    print(">>> "+variable.show());
    print("<<<<<<<<<<<<<<<<<<<<<<<<<<<<")
}
func jlogValHash(title:String,variable:ValidatorHash)->(){
    print(">>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    print(">>> Logging : "+title.show());
    print(">>> "+variable.show());
    print("<<<<<<<<<<<<<<<<<<<<<<<<<<<<")
}
func jlogDatum(title:String,variable:Datum)->(){
    print(">>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    print(">>> Logging : "+title.show());
    print(">>> "+variable.show());
    print("<<<<<<<<<<<<<<<<<<<<<<<<<<<<")
}

func main(datum: Datum, redeemer: Redeemer, ctx: ScriptContext) -> Bool {
    tx: Tx = ctx.tx;

    validator_hash: ValidatorHash = ctx.get_current_validator_hash(); jlogValHash("validator_hash",validator_hash);
    
    redeemer.switch 
    {
        c:Cancel =>{
            jlogPKH("c seller pkh ",c.seller);
            jlogByteArray("c nftId",c.nftId);
            jlogPKH("datum seller pkh ",datum.seller);
            jlogByteArray("datum nftId ",datum.nftId);
            if(c.seller == datum.seller && c.nftId == datum.nftId){           
                tx.is_signed_by(c.seller)
             } else {
                false
             }
        },
        u:Update=>{
            expected_datum: Datum = datum.update(u.seller, u.nftPrice, u.nftId);
            jlogDatum("expected datum",expected_datum);
            jlogValue("datum price value",datum.nftPrice);
            
            tx.value_locked_by_datum(validator_hash, expected_datum,true)
              .contains(datum.nftPrice) && tx.is_signed_by(u.seller)

        },
        b: Buy =>{
           jlogByteArray("buyer nft",b.nftId);
           jlogByteArray("datum nftId",datum.nftId);
           jlogInt("buyer amount",b.amount.get_lovelace());
           jlogInt("datum nftPrice ",datum.nftPrice.get_lovelace());
           jlogPKH("buyer pkh ",b.buyer);
           if( 
              b.nftId == datum.nftId 
              && 
              (b.amount.get_lovelace() == datum.nftPrice.get_lovelace()) 
            
             ){
               true
              } else {
                false
              }        
            }        
    }
}
`