export const scriptForLockingPropertyRegistryOfficeNFT = 
`
spending scriptForLockingPropertyRegistryOfficeNFT

struct Datum {
    constructor:Int 
    nft:ByteArray
}

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
const OWNER: ByteArray = #

const ownerPKH: PubKeyHash = PubKeyHash::new(OWNER)

func main(_, redeemer: Redeemer, ctx: ScriptContext) -> Bool {

    tx: Tx = ctx.tx;

    redeemer.switch {

        l:LockTokenProperty => {
                
            jlogMintingPolicyHash("l.mph",l.mph);
            
            tx.is_signed_by(ownerPKH)  
        },
        BurnLocked => {
            tx.is_signed_by(ownerPKH)
       }  

    }    
}

`