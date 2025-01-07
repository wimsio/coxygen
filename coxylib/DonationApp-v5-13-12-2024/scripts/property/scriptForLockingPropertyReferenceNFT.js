export const scriptForLockingPropertyReferenceNFT = 
`
spending scriptForLockingPropertyReferenceNFT


enum Redeemer {
    LockTokenProperty{
       mph:MintingPolicyHash
       txId: ByteArray
       utxoIdx:Int
       tokenName:ByteArray
    }
    BurnLocked
}

const RUN :Bool = true

func jlogMintingPolicyHash(title:String,variable:MintingPolicyHash)->(){
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

const OWNER: ByteArray = #

const ownerPKH: PubKeyHash = PubKeyHash::new(OWNER)

func main(_, redeemer: Redeemer, ctx: ScriptContext) -> Bool {

    tx: Tx = ctx.tx;

    redeemer.switch {

        l:LockTokenProperty => {
                
            jlogMintingPolicyHash("l.mph",l.mph);
            
            jlogByteArray("l.tokenName",l.tokenName);
            
            tx.is_signed_by(ownerPKH)  
        },
        BurnLocked => {
            tx.is_signed_by(ownerPKH)
       }  

    }    
}

`