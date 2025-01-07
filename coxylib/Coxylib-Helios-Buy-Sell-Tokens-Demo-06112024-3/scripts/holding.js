export const holding =
`spending holding
const version: String = "HDV v0.5"

// The holding contract for ticket tokens
enum Redeemer {
    Transfer 
    Return
    Burn
}
// Contract parameters
const STAKE_PKH: PubKeyHash = PubKeyHash::new(#)
const TN: ByteArray = #
const BEACON_MPH: ByteArray = #

// Global variables
const beaconMPH: MintingPolicyHash = MintingPolicyHash::new(BEACON_MPH)

// Check for any tokens in outputs
func checkTokensOut(outputs: []TxOutput) -> Bool {
    if(outputs.length == 0) {
        false
    } else if (outputs.get(0).value.get_assets().is_zero()) {
        checkTokensOut(outputs.tail)
    } else {
        true
    }
}
// Define the main validator function
func main(_, redeemer: Redeemer, ctx: ScriptContext) -> Bool {
    print(version.show());
    tx: Tx = ctx.tx;
    vHash : ValidatorHash = ctx.get_current_validator_hash();
    redeemer.switch {
        Transfer => {
            txOutputsContract : []TxOutput = tx.outputs_locked_by(vHash);
            // Tx must be singed by the stake key
            tx.is_signed_by(STAKE_PKH).trace("HDV1: ") &&
            // Output to swap must have a beacon token
            (tx.outputs.get(0).value.get_policy(beaconMPH)
                       .all((_, amount: Int) -> Bool { 
                            amount == 1
                        }).trace("HDV2: ")) &&
            // If there is token change sent back to the holding script
            (if (txOutputsContract.length == 1) {
                (!checkTokensOut((tx.outputs.tail).tail)).trace("HDV3: ")
            // Otherwise, just check the remaining outputs for tokens
            } else {
                (!checkTokensOut(tx.outputs.tail)).trace("HDV4: ")
            })
        },
        Return => {
            txOutputsContract : []TxOutput = tx.outputs_locked_by(vHash);
            // Tx must be singed by the stake key
            tx.is_signed_by(STAKE_PKH).trace("HDV5: ") &&
            // The transaction must be burning a beacon token
            (tx.minted.value.get_policy(beaconMPH)
                            .all((_, amount: Int) -> Bool {
                                amount == (-1)
                            }).trace("HDV6: ")) &&
            // Check that there is only one output that goes back to the 
            // holding script
            (txOutputsContract.length == 1).trace("HDV7: ") &&
            // Make sure that no other outputs contains tokens
            (!checkTokensOut(tx.outputs.tail)).trace("HDV8: ")
        },
        Burn => {
            // Tx must be singed by the stake key
            tx.is_signed_by(STAKE_PKH).trace("HDV9: ") &&
            // There must be only 1 change output and only contain Ada
            (!checkTokensOut(tx.outputs)).trace("HDV10: ") 
        }
    }    
}
`