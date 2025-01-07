export const ticket = 
`minting ticket
const version: String = "TKP v0.5"

// The minting policy can either mint, convert or burn tickets
enum Redeemer { 
    Mint
    Convert {
        qty: Int
        userTicketTokenNames: []ByteArray
        refTicketTokenNames: []ByteArray
    }
    Burn
}

// Contract parameters
const TX_ID: ByteArray = #
const TX_IDX: Int = 0
const TN: ByteArray = #
const SHOWTIME: Time = Time::new(0)
const QTY: Int = 1
const PAYMENT_PKH: PubKeyHash = PubKeyHash::new(#)
const STAKE_PKH: PubKeyHash = PubKeyHash::new(#)
const HOLD_VAL_HASH: ValidatorHash = ValidatorHash::new(#)
const MIN_LOVELACE: Int = 2_000_000

// Global variables
const txId: TxId = TxId::new(TX_ID)
const outputId: TxOutputId = TxOutputId::new(txId, TX_IDX)
const minLovelaceVal: Value = Value::lovelace(MIN_LOVELACE)

func totalAssetVal( tokenNames: []ByteArray, 
                    refTokenNames: []ByteArray, 
                    mph: MintingPolicyHash, 
                    qty: Int) -> Value {

    tokenAssetClass: AssetClass = AssetClass::new(
        mph, 
        tokenNames.get(0)
    );
    refTokenAssetClass: AssetClass = AssetClass::new(
        mph, 
        refTokenNames.get(0)
    );
    if (tokenNames.length == 1) {
        Value::new(tokenAssetClass, 1) + Value::new(refTokenAssetClass, 1) 
    } else {
        totalAssetVal(tokenNames.tail, refTokenNames.tail, mph, qty - 1) 
                + (Value::new(tokenAssetClass, 1))
                + (Value::new(refTokenAssetClass, 1))
    }
}

// Define the main minting policty
func main(redeemer: Redeemer, ctx: ScriptContext) -> Bool {
    print(version.show());
    tx: Tx = ctx.tx;
    mph: MintingPolicyHash = ctx.get_current_minting_policy_hash();
    ticket_assetclass: AssetClass = AssetClass::new(
        mph, 
        TN
    );
    value_minted: Value = tx.minted;
    now: Time = tx.time_range.start;

    redeemer.switch {
        Mint => {
            // Check that the contract parameter UTXO is included in the inputs
            // and that the minted amount is equal to the quanty given
            (value_minted == Value::new(ticket_assetclass, QTY)).trace("TKP1: ") &&
            tx.inputs.any((input: TxInput) -> Bool {
                                (input.output_id == outputId).trace("TKP2: ")
                                }
                        ) &&
            // Check that the transaction is signed by stake key
            tx.is_signed_by(STAKE_PKH).trace("TKP3: ") &&
            // Check that the minted value is going to the holding validator
            (tx.value_locked_by(HOLD_VAL_HASH) ==  value_minted + minLovelaceVal).trace("TKP:4 ") &&
            // Don't allow minting of ticket after showtime
            (now < SHOWTIME).trace("TKP5: ")
        },
        red: Convert => { 
            // Construct the ticket token value to burn
            burnTokenValue: Value = Value::new(ticket_assetclass, (-1) * red.qty);
            mintTokenValue: Value = totalAssetVal(  red.userTicketTokenNames,
                                                    red.refTicketTokenNames, 
                                                    mph, 
                                                    red.qty);
            totalValue: Value = burnTokenValue + mintTokenValue;
    
            // Check that the amount of tokens to convert is greater than 0
            (red.qty > 0).trace("TKP6: ") &&
            // Check that the total value is what is actually minted/burned 
            (value_minted == totalValue).trace("TKP7")
   
        },
        Burn => {
            // Allow any quantity of the minting policy to be burned in a transaction
            (value_minted.get_policy(mph).all( (_, amount: Int) -> Bool {
                amount < 0
            }).trace("TKP8: ")) &&
            // Burning only allowed by event owner
            tx.is_signed_by(STAKE_PKH).trace("TKP9: ") 
        }
    } 
}`