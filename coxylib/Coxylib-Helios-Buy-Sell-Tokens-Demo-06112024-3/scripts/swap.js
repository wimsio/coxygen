export const swap = 
`spending swap
const version: String = "SPV v0.5"

struct Datum {
    askedAssetVal: Value
    offeredAssetVal: Value
}

enum Redeemer {
    Close
    Swap {
        buyerPkh: PubKeyHash
        qty: Int
        userTicketTokenNames: []ByteArray
    }
    Update 
}

// Contract parameters 
const ASKED_MPH: ByteArray = #
const ASKED_TN: ByteArray = #
const OFFERED_MPH: ByteArray = #
const OFFERED_TN: ByteArray = #
const BEACON_MPH: ByteArray = #
const BEACON_TN: ByteArray = #
const HOLD_VAL_HASH: ValidatorHash = ValidatorHash::new(#)
const SHOWTIME: Time = Time::new(0)
const PAYMENT_PKH: PubKeyHash = PubKeyHash::new(#)
const STAKE_PKH: PubKeyHash = PubKeyHash::new(#)
const MIN_LOVELACE: Int = 0

// Global variables
const beaconMPH: MintingPolicyHash = MintingPolicyHash::new(BEACON_MPH)
const beaconAssetClass: AssetClass = AssetClass::new(beaconMPH, BEACON_TN)
const minLovelaceVal: Value = Value::lovelace(MIN_LOVELACE)

// If the value is not lovelace, then add minLovelace
func checkAdaVal(value: Value) -> Value {
    if(value.get_lovelace() == 0) {
        minLovelaceVal + value
    } else {
        value
    }
}
// Calc the total value of the array of token names provided
func totalAssetVal( tokenNames: []ByteArray, 
                    mph: MintingPolicyHash, 
                    qty: Int) -> Value {

    tokenAssetClass: AssetClass = AssetClass::new(
        mph, 
        tokenNames.get(0)
    );
    if (tokenNames.length == 1) {
        Value::new(tokenAssetClass, 1) 
    } else {
        totalAssetVal(tokenNames.tail, mph, qty - 1) 
        + (Value::new(tokenAssetClass, 1))
    }
}


// Define the main validator
func main(datumIn: Datum, redeemer: Redeemer, ctx: ScriptContext) -> Bool {
    print(version.show());
    tx: Tx = ctx.tx;
    vHash : ValidatorHash = ctx.get_current_validator_hash();

    // Calculate the asked token
    askedMph: MintingPolicyHash = MintingPolicyHash::new(ASKED_MPH);
    askedAssetClass: AssetClass = AssetClass::new(
        askedMph, 
        ASKED_TN
    );

    // Calculate the offered token
    offeredMph: MintingPolicyHash = MintingPolicyHash::new(OFFERED_MPH);
    offeredAssetClass: AssetClass = AssetClass::new(
        offeredMph, 
        OFFERED_TN
    );

    // Get the outputs sent back to this script address
    txOutputsContract : []TxOutput = tx.outputs_locked_by(vHash);

    redeemer.switch {
        Close => {
            // Create beacon token value for burning
            beaconVal : Value = Value::new(beaconAssetClass, (-1));

            // Check that there is nothing sent back to swap adddress
            (txOutputsContract.length == 0).trace("SPV1.1: ") &&

            // Check that the transaction is siged by the stake key who created it
            tx.is_signed_by(STAKE_PKH).trace("SPV1.2: ") &&

            // Check that the beacon token is burned
            (tx.minted == beaconVal).trace("SPV1.3: ") &&

            // Check that the value of the swap is sent back to holding validator
            (tx.value_locked_by(HOLD_VAL_HASH))
            .contains(checkAdaVal(datumIn.offeredAssetVal))
            .trace("SPV1.4: ")
            
        },
        red: Swap => {
            beaconVal : Value = Value::new(beaconAssetClass, (1));
            mintTokenValue: Value = totalAssetVal(  red.userTicketTokenNames,
                                                    offeredMph, 
                                                    red.qty);
            txOutputsBuyer : []TxOutput = tx.outputs_sent_to(red.buyerPkh);
            txOutputsSeller : []TxOutput = tx.outputs_sent_to(PAYMENT_PKH);

            if (txOutputsContract.length == 1 && 
                txOutputsBuyer.length >= 1 &&
                txOutputsSeller.length >= 1) {
            
                txOutputsContract.head.datum.switch {
                    datumOut: Inline => { 

                        datumOutData: Datum = Datum::from_data(datumOut.data);
                        offeredAssetDiffVal: Value = datumIn.offeredAssetVal 
                                                    - datumOutData.offeredAssetVal;
                        offeredAssetDiffQty: Int = offeredAssetDiffVal.get(offeredAssetClass);
                        swapVal: Value = checkAdaVal(datumOutData.offeredAssetVal) + beaconVal;
                        buyerVal: Value = checkAdaVal(mintTokenValue);
                        sellerVal: Value = checkAdaVal(datumIn.askedAssetVal * offeredAssetDiffQty);
                    
                        // Check that the askedAsset datum value does not change
                        (datumIn.askedAssetVal == datumOutData.askedAssetVal).trace("SPV2.1: ") &&

                        // Check that the askedAsset in the datum is what is asked as part of this swap
                        (if (datumIn.askedAssetVal.get_lovelace() > MIN_LOVELACE) {
                           (ASKED_MPH.length == 0).trace("SPV2.3: ")
                        } else {
                            (datumIn.askedAssetVal.get(askedAssetClass) > 0).trace("SPV2.4: ")
                        }) && 
                        
                        // Check that the offeredAsset in the datum is what is offered as part of this swap
                        (datumIn.offeredAssetVal.get(offeredAssetClass) > 0).trace("SPV2.5: ") &&
                       
                        // Check that the remaining value sent back to swap is correct
                        (tx.value_locked_by(vHash) == (swapVal)).trace("SPV2.6: ") &&

                        // Check that buy receives the correct amount
                        (buyerVal == txOutputsBuyer.head.value).trace("SPV2.7: ") &&

                        // Check that the seller receives the correct amount
                        (sellerVal == tx.value_sent_to(PAYMENT_PKH)).trace("SPV2.8: ") &&

                        // Check that the qty minted matches the amount offered assets sold
                        (offeredAssetDiffQty == red.qty).trace("SPV2.9: ")
                    },
                    else => false.trace("SPV2.10: ") // No inline datum found
                }
            } else {
                false.trace("SPV2.11: ") // No datum found in outputs
            }
        },
        Update => {
            beaconVal : Value = Value::new(beaconAssetClass, (1));
            if (txOutputsContract.length == 1) {
                txOutputsContract.head.datum.switch {
                    datumOut: Inline => { 
                        datumOutData: Datum = Datum::from_data(datumOut.data);
                        offeredAssetValOut: Value = datumOutData.offeredAssetVal;
                        askedAssetValOut: Value = datumOutData.askedAssetVal;
                        swapVal: Value = checkAdaVal(offeredAssetValOut) + beaconVal;
                        // Check that transaction was signed by the stake key
                        tx.is_signed_by(STAKE_PKH).trace("SPV3.1: ") &&
                        // Check that the offered asset type and quantity does not change 
                        // with a swap update, only the asking asset price
                        (tx.value_locked_by(vHash) == (swapVal)).trace("SPV3.2: ") && 
                        // Check that offered asset in datum does not change before 
                        // and after the update swap
                        (datumIn.offeredAssetVal == datumOutData.offeredAssetVal) &&
                        (if (askedAssetValOut.get_lovelace() > MIN_LOVELACE) {
                            // Check that asked asset is in lovelace
                            (ASKED_MPH.length == 0).trace("SPV3.3: ")
                            } 
                        else {
                            // Check that a non-Ada asked asset is greater than 0
                            ((askedAssetValOut.get(askedAssetClass) > 0).trace("SPV3.4: ")) 
                        })    
                    },
                    else => false.trace("SPV3.5: ") // No inline datum found
                }
            } else {
                false.trace("SPV3.6: ") // No datum found in outputs
            }
        }
    }    
}`