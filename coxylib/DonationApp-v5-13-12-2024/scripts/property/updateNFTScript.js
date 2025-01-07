export const updateNFTScript =
`
spending updateNFTScript
/*
Author: Bernard Sibanda
Date: 17-11-2024
Purpose: The purpose of this onchain demo smart contract is to fractionalize and sell property shares as Cardano Tokens
Email: cto@wims.io
Purpose: updateNFTScript
*/

//This datum allows updating unit price in lovelace and quantity of tokens acting as shares for property price
struct Datum {
    seller: PubKeyHash 
    nft:AssetClass
    nftQuantity:Int
    nftId:ByteArray
    nftUnitPriceLovelace:Int
    nftTotalPriceLovelace:Int
    
     func update(self, nftUnitPriceLovelace: Int,nftTotalPriceLovelace:Int,nftQuantity:Int) -> Datum {
        self.copy(nftUnitPriceLovelace: nftUnitPriceLovelace,nftTotalPriceLovelace:nftTotalPriceLovelace,nftQuantity:nftQuantity)
    }
    
}

//The smart contract allows sellings,  buying, cancelling and updating share prices onchain
//Each sale is identified by a unique nftid
enum Redeemer {
    Cancel{
        seller:PubKeyHash
        nftId:ByteArray
    }
    Update{
        seller:PubKeyHash
        nftId:ByteArray
        nftUnitPriceLovelace : Int
        nftQuantity:Int

    }
    Buy{
        buyer: PubKeyHash
        nftId: ByteArray
        nftQuantity:Int
    }

} 

const RUN :Bool = false //This is a switch to allow logging and displaying logic and errors on the front UI

//At the moment the Helios playground lack flexibility leading to duplicate but very useful logging functions
//They can be turned on for debugging and testing and off for optimization
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
            
            jlogPKH(" datum seller ",datum.seller);
            
            jlogByteArray("u nftId",u.nftId);
            
            jlogByteArray("datum nftId",datum.nftId);
            
            jlogInt("datum.nftUnitPriceLovelace",datum.nftUnitPriceLovelace);
            
            jlogInt("u.nftUnitPriceLovelace",u.nftUnitPriceLovelace);
            
            txOutputsContract : []TxOutput = tx.outputs_locked_by(validator_hash);
            
            jlogTxOutput("txOutputsContract",txOutputsContract);
            
            jlogValue("tx.value_locked_by(validator_hash)",tx.value_locked_by(validator_hash));
            
            datumAssetsValue : Value = Value::new(datum.nft, (datum.nftQuantity));
            
            jlogValue("datumAssetsValue",datumAssetsValue);
            
            jlogBool("(tx.value_locked_by_datum(validator_hash).contains(datumAssetsValue))",(tx.value_locked_by(validator_hash).contains(datumAssetsValue)));
            
            newDatum: Datum = datum.update(u.nftUnitPriceLovelace,(u.nftUnitPriceLovelace * u.nftQuantity),u.nftQuantity);
            
            jlogDatum("newDatum",newDatum);
            
            jlogBool("(tx.value_locked_by_datum(validator_hash).contains(newDatum))", tx.value_locked_by_datum(validator_hash,newDatum,true).contains(datumAssetsValue));
            
            jlogBool("datum.nftUnitPriceLovelace != u.nftUnitPriceLovelace",datum.nftUnitPriceLovelace != u.nftUnitPriceLovelace);

           
           (tx.value_locked_by_datum(validator_hash,newDatum,true).contains(datumAssetsValue))
           
           &&
           
           datum.nftUnitPriceLovelace != u.nftUnitPriceLovelace

            &&
            
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
            
            jlogInt("datum.nftUnitPriceLovelace ",datum.nftUnitPriceLovelace );

            (tx.value_sent_to(b.buyer).contains(boughtAssets)) &&
            
            (b.nftId == datum.nftId) && 
            
            tx.is_signed_by(b.buyer)

        }
    }

}

`