export const buyselltokens =
`
spending buyselltokens

struct Datum {
    seller: PubKeyHash 
    nft:AssetClass
    nftQuantity:Int
    nftId:ByteArray
    nftUnitPriceLovelace:Int
    nftTotalPriceLovelace:Int
}

enum Redeemer {
    Cancel{
        seller:PubKeyHash
        nftId:ByteArray
    }
    Update{
        seller:PubKeyHash
        nftId:ByteArray
    }
    Buy{
        buyer: PubKeyHash
        nftId: ByteArray
        nftQuantity:Int
    }

} 

const RUN :Bool = false

func jlogBool(title:String,variable:Bool)->(){
    if(RUN == true){
        print(">>>>>>>>>>>>>>>>>>>>>>>>>>>>"); 
        print(">>> Logging : "+title.show());
        print(">>> "+variable.show());
        print("<<<<<<<<<<<<<<<<<<<<<<<<<<<<")
    }
} 

func jlogByteArray(title:String,variable:ByteArray)->(){
    if(RUN == true){
        print(">>>>>>>>>>>>>>>>>>>>>>>>>>>>"); 
        print(">>> Logging : "+title.show());
        print(">>> "+variable.show());
        print("<<<<<<<<<<<<<<<<<<<<<<<<<<<<")
    }
} 
func jlogAssetClass(title:String,variable:AssetClass)->(){
    if(RUN == true){
        print(">>>>>>>>>>>>>>>>>>>>>>>>>>>>");
        print(">>> Logging : "+title.show());
        print(">>> "+variable.show());
        print("<<<<<<<<<<<<<<<<<<<<<<<<<<<<")
    }
}
func jlogInt(title:String,variable:Int)->(){
    if(RUN == true){
        print(">>>>>>>>>>>>>>>>>>>>>>>>>>>>");
        print(">>> Logging : "+title.show());
        print(">>> "+variable.show());
        print("<<<<<<<<<<<<<<<<<<<<<<<<<<<<")
    }
}
func jlogString(title:String,variable:String)->(){
    if(RUN == true){
        print(">>>>>>>>>>>>>>>>>>>>>>>>>>>>");
        print(">>> Logging : "+title.show());
        print(">>> "+variable.show());
        print("<<<<<<<<<<<<<<<<<<<<<<<<<<<<")
    }
}
func jlogValue(title:String,variable:Value)->(){
    if(RUN == true){
        print(">>>>>>>>>>>>>>>>>>>>>>>>>>>>");
        print(">>> Logging : "+title.show());
        print(">>> "+variable.show());
        print("<<<<<<<<<<<<<<<<<<<<<<<<<<<<")
    }
}
func jlogPKH(title:String,variable:PubKeyHash)->(){
    if(RUN == true){
        print(">>>>>>>>>>>>>>>>>>>>>>>>>>>>");
        print(">>> Logging : "+title.show());
        print(">>> "+variable.show());
        print("<<<<<<<<<<<<<<<<<<<<<<<<<<<<")
    }
}
func jlogPKHList(title:String,variable:[]PubKeyHash)->(){
    if(RUN == true){
        print(">>>>>>>>>>>>>>>>>>>>>>>>>>>>");
        print(">>> Logging : "+title.show());
        print(">>> "+variable.show());
        print("<<<<<<<<<<<<<<<<<<<<<<<<<<<<")
    }
}
func jlogValHash(title:String,variable:ValidatorHash)->(){
    if(RUN == true){
        print(">>>>>>>>>>>>>>>>>>>>>>>>>>>>");
        print(">>> Logging : "+title.show());
        print(">>> "+variable.show());
        print("<<<<<<<<<<<<<<<<<<<<<<<<<<<<")
    }
}
func jlogDatum(title:String,variable:Datum)->(){
    if(RUN == true){
        print(">>>>>>>>>>>>>>>>>>>>>>>>>>>>");
        print(">>> Logging : "+title.show());
        print(">>> "+variable.show());
        print("<<<<<<<<<<<<<<<<<<<<<<<<<<<<")
    }
}
func jlogTxOutput(title:String, variable:[]TxOutput)->(){
    if(RUN == true){
        print(">>>>>>>>>>>>>>>>>>>>>>>>>>>>");
        print(">>> Logging : "+title.show());
        print(">>> "+variable.head.serialize().show());
        print("<<<<<<<<<<<<<<<<<<<<<<<<<<<<") 
    }
}

func jlogTxInput(title:String,variable:[]TxInput)->(){
     if(RUN == true){
        print(">>>>>>>>>>>>>>>>>>>>>>>>>>>>");
        print(">>> Logging : "+title.show());
        print(">>> length : "+variable.length.show());
        print(">>> First Elem data: "+variable.head.serialize().show());
        print("<<<<<<<<<<<<<<<<<<<<<<<<<<<<") 
    }   
}

func main(datum: Datum, redeemer: Redeemer, ctx: ScriptContext) -> Bool {

    tx: Tx = ctx.tx;

    validator_hash: ValidatorHash = ctx.get_current_validator_hash(); jlogValHash("validator_hash",validator_hash);
    
    txInputsContract : []TxInput = tx.inputs; jlogTxInput("txInputsContract",txInputsContract);
  
    redeemer.switch 
    {
        
        c:Cancel=>{ 

            jlogByteArray("c nftId",c.nftId);
            
            jlogPKH("c seller",c.seller);
            
            jlogPKH("datum seller", datum.seller);
            
            c.seller == datum.seller
            
            &&
            
            tx.is_signed_by(c.seller)
            
            &&
            
            datum.nftId == c.nftId
        },
        u:Update=>{
        
          jlogPKH(" seller pkh ",u.seller);
          
          jlogByteArray("u nftId",u.nftId);

           u.seller == datum.seller
            
            &&
            
            tx.is_signed_by(u.seller)
            
            &&
            
            datum.nftId == u.nftId
              
        },
        b:Buy=>{

                boughtAssets : Value = Value::new(datum.nft, (b.nftQuantity));

                jlogValue("boughtAssets",boughtAssets);
                
                jlogInt("tx.value_sent_to(datum.seller).get_lovelace()",tx.value_sent_to(datum.seller).get_lovelace());

                jlogBool("tx.value_sent_to(b.buyer).contains(boughtAssets)",tx.value_sent_to(b.buyer).contains(boughtAssets));
                
                jlogByteArray("b.nftId",b.nftId);
                
                jlogByteArray("datum.nftId",datum.nftId);
                
                jlogBool("tx.is_signed_by(b.buyer)",tx.is_signed_by(b.buyer));
                
                (tx.value_sent_to(datum.seller).get_lovelace() >= (datum.nftUnitPriceLovelace * b.nftQuantity)) &&

                (tx.value_sent_to(datum.seller).get_lovelace() >= (datum.nftUnitPriceLovelace * b.nftQuantity)) &&

                (tx.value_sent_to(b.buyer).contains(boughtAssets)) &&

                (b.nftId == datum.nftId) && 
                
                tx.is_signed_by(b.buyer)

        }
    }

}

`