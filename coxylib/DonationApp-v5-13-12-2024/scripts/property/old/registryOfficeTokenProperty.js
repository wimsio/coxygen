export const registryOfficeTokenProperty = 
`
minting registryOfficeTokenProperty
struct Datum {
    nft:ByteArray   
    priceLovelace:Int
}
enum Redeemer{
    Mint
    Burn
}

const RUN :Bool = true 

func jlogValue(title:String,variable:Value)->(){
    if(RUN == true){
        print(">>>>>>>>>>>>>>>>>>>>>>>>>>>>");
        print(">>> Logging : "+title.show());
        print(">>> "+variable.show());
        print("<<<<<<<<<<<<<<<<<<<<<<<<<<<<")
    }
}

const OWNER : ByteArray = #

const OWNER_PKH : PubKeyHash = PubKeyHash::new(OWNER)

const REGISTRY_OFFICE_TOKEN_NAME_CIP68_666: ByteArray = #

const TX_ID: ByteArray = #

const TX_IDX: Int = 0

const txId: TxId = TxId::new(TX_ID)

const outputId: TxOutputId = TxOutputId::new(txId, TX_IDX)

func main(redeemer: Redeemer, ctx: ScriptContext) -> Bool {

    tx: Tx = ctx.tx;

    mph: MintingPolicyHash = ctx.get_current_minting_policy_hash();

    redeemer.switch{
    
        Mint =>{
        
            value_minted: Value = tx.minted;
            
            jlogValue("value_minted",value_minted);
            
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