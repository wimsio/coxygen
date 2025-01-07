export const beacon = `
minting beacon
const version: String = "BTP v0.5"

enum Redeemer { 
    Mint {
        txId: ByteArray
        txIdx: String
    }
    Burn 
}

// Contract parameters 
const OWNER_PKH: ByteArray = #

// Global variables
const ownerPKH: PubKeyHash = PubKeyHash::new(OWNER_PKH)

// Define the main minting policy
func main(redeemer: Redeemer, ctx: ScriptContext) -> Bool {
    print(version.show());
    tx: Tx = ctx.tx;
    value_minted: Value = tx.minted;
    mph: MintingPolicyHash = ctx.get_current_minting_policy_hash();
    redeemer.switch {
        red: Mint => {
            txIdxBA: ByteArray = red.txIdx.serialize();
            txIdxInt: Int = Int::parse(red.txIdx);
            tn: ByteArray = (red.txId + txIdxBA.slice(1,txIdxBA.length)).blake2b();
            txId: TxId = TxId::new(red.txId);
            outputId: TxOutputId = TxOutputId::new(txId, txIdxInt);
            assetclass: AssetClass = AssetClass::new(
                    mph, 
                    tn
                );
            // Check that the minted amount is equal to only 1 for this mint tx
            (value_minted == Value::new(assetclass, 1)).trace("BTP1: ") &&
            // Check that the transaction is signed by the owner
            tx.is_signed_by(ownerPKH).trace("BTP2: ") &&
            // Check that txId is part of the inputs
            tx.inputs.any((input: TxInput) -> Bool {
                        (input.output_id == outputId).trace("BTP3: ")
                        }
                ) 
        },
        Burn => {
            // Allow the thread token to be burned
            tx.minted.get_policy(mph).all( (_, amount: Int) -> Bool {
                amount == -1
            }).trace("BTP4: ")
        }
    } 
}
`