export const ticketRefVal = 
`spending ticketRefVal
const version: String = "TFV v0.5"

/*
 CIP 68 metadata
*/

struct Datum {
    cip68: Data 
}

/*
 The reference token contract to keep track if a ticket 
 token has been used for an event.
 */
enum Redeemer {
    Used
    Burn
}

// Contract parameters
const OWNER_PKH: ByteArray = #
const TN: ByteArray = #

// Global variables
const ownerPKH: PubKeyHash = PubKeyHash::new(OWNER_PKH)


// Define the main validator 
func main(_, redeemer: Redeemer, ctx: ScriptContext) -> Bool {
    print(version.show());
    tx: Tx = ctx.tx;

    redeemer.switch {
        Used => {
            tx.is_signed_by(ownerPKH).trace("TRV1: ")  
        },
        Burn => {
            tx.is_signed_by(ownerPKH).trace("TRV2: ") 
        }  
    }    
}`