export const auction =
`
spending auction

struct Datum {
    seller:         PubKeyHash
    bid_asset_class:      AssetClass     
    min_bid:        Int
    for_sale:       Value          
    highest_bid:    Int            
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

enum jType{
    Int
    String
    Value
    PubKeyHash
}

func jlogInt(title:String,variable:Int)->(){
    print(">>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    print(">>> Logging : "+title.show());
    print(">>> "+variable.show());
    print("<<<<<<<<<<<<<<<<<<<<<<<<<<<<")
}
func jlogString(title:String,variable:String)->(){
    print(">>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    print(">>> Logging : "+title.show());
    print(">>> "+variable.show());
    print("<<<<<<<<<<<<<<<<<<<<<<<<<<<<")
}
func jlogValue(title:String,variable:Value)->(){
    print(">>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    print(">>> Logging : "+title.show());
    print(">>> "+variable.show());
    print("<<<<<<<<<<<<<<<<<<<<<<<<<<<<")
}
func jlogPKH(title:String,variable:PubKeyHash)->(){
    print(">>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    print(">>> Logging : "+title.show());
    print(">>> "+variable.show());
    print("<<<<<<<<<<<<<<<<<<<<<<<<<<<<")
}
func jlogValHash(title:String,variable:ValidatorHash)->(){
    print(">>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    print(">>> Logging : "+title.show());
    print(">>> "+variable.show());
    print("<<<<<<<<<<<<<<<<<<<<<<<<<<<<")
}
func jlogDatum(title:String,variable:Datum)->(){
    print(">>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    print(">>> Logging : "+title.show());
    print(">>> "+variable.show());
    print("<<<<<<<<<<<<<<<<<<<<<<<<<<<<")
}

func main(datum: Datum, redeemer: Redeemer, ctx: ScriptContext) -> Bool {
    tx: Tx = ctx.tx;

    validator_hash: ValidatorHash = ctx.get_current_validator_hash(); jlogValHash("validator_hash",validator_hash);
    
    redeemer.switch 
    {
        Close => 
        {
            dhbid : Int = datum.highest_bid;
            dmbid : Int = datum.min_bid;
            if (dhbid  < dmbid) {

                jlogInt("datum highest bid",dhbid);
                jlogInt("dmbid",dmbid);

                ds : PubKeyHash = datum.seller;
                dfs : Value = datum.for_sale;
                jlogPKH("datum seller",ds);
                jlogValue("datum for_sale",dfs);

                tx.value_sent_to(datum.seller).contains(datum.for_sale)
            } else {
                tx
                  .value_sent_to(datum.seller)
                  .contains(Value::new(datum.bid_asset_class, datum.highest_bid))    &&
                tx
                  .value_sent_to(datum.highest_bidder)
                  .contains(datum.for_sale)                                   
            }
        },
        b: Bid => 
        {
            if (b.bid > 0 ){
                tx.is_signed_by(b.bidder)
            }  else   {
               true
            }
        }
    }
}

`