export const vesting = 
`
spending vesting
const VERSION: String = "1.0.0"

struct Datum {
    owner: PubKeyHash
}

enum Redeemer {
    Cancel
    Claim {
        msg: String
    }
}

const SECRET: String = "secret"

func main(datum: Datum, redeemer: Redeemer, ctx: ScriptContext) -> Bool {
    tx: Tx = ctx.tx;
    print(VERSION);
    //scriptPKH: ValidatorHash = ctx.get_current_validator_hash();

    redeemer.switch {
        Cancel => {
            tx.is_signed_by(datum.owner) 
        },
        red: Claim => {
            red.msg == SECRET 
        }
    }    
}
`