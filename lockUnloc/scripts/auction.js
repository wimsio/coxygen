export const auction =
`
spending auction

struct Datum {
    seller:         PubKeyHash
    bid_asset:      AssetClass     // allow alternative assets (not just lovelace)
    min_bid:        Int
    deadline:       Time
    for_sale:       Value          // the asset that is being auctioned
    highest_bid:    Int            // initialized at 0, which signifies the auction doesn't yet have valid bids
    highest_bidder: PubKeyHash

    func update(self, highest_bid: Int, highest_bidder: PubKeyHash) -> Datum {
        self.copy(highest_bid: highest_bid, highest_bidder: highest_bidder)
    }
}

enum Redeemer {
    Close 
    Bid {
        bidder: PubKeyHash
        bid: Int
    }
}

func main(datum: Datum, redeemer: Redeemer, ctx: ScriptContext) -> Bool {
    tx: Tx = ctx.tx;

    now: Time = tx.time_range.start;

    validator_hash: ValidatorHash = ctx.get_current_validator_hash();

    redeemer.switch {
        Close => {
            if (datum.highest_bid < datum.min_bid) {
                // the forSale asset must return to the seller, what happens to any erroneous bid value is irrelevant
                tx
                  .value_sent_to(datum.seller)
                  .contains(datum.for_sale) &&
                // Check that the deadline has passed
                now > datum.deadline                                    
            } else {
                // Check that the seller receives the highest bid
                tx
                  .value_sent_to(datum.seller)
                  .contains(Value::new(datum.bid_asset, datum.highest_bid))    &&
                // Check that highest bidder is given the token being auctioned
                tx
                  .value_sent_to(datum.highest_bidder)
                  .contains(datum.for_sale)                                    &&
                // Check that the deadline has passed
                now > datum.deadline                                    
            }
        },
        b: Bid => {
            if (b.bid < datum.min_bid) {
                false
            } else if (b.bid <= datum.highest_bid) {
                false
            } else {
                // first bid is placed by the auction creator
                expected_datum: Datum = datum.update(b.bid, b.bidder);

                // Check that new Auction UTxO contains the token for sale and the new bid
                tx
                  .value_locked_by_datum(validator_hash, expected_datum,true)
                  .contains(datum.for_sale + Value::new(datum.bid_asset, b.bid)) &&
                // Check that the old highest bidder is repayed
                tx
                  .value_sent_to(datum.highest_bidder)
                  .contains(Value::new(datum.bid_asset, datum.highest_bid))      &&
                // Check that the deadline hasn't passed
                now < datum.deadline
            }
        }
    }
}

`