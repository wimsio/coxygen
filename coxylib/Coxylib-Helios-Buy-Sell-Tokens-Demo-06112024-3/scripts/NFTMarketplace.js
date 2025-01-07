export const NFTMarketplace = 
`
spending NFTMarketplace

struct Datum {
seller: PubKeyHash // Seller's wallet address
nft: AssetClass // NFT (identified by PolicyID + TokenName)
price: Value // Price of the NFT (in lovelace or other token)
}

enum Redeemer {
Buy
Cancel
}

func main(datum: Datum, redeemer: Redeemer, ctx: ScriptContext) -> Bool {
tx: Tx = ctx.tx;

redeemer.switch {
Buy => {
// Ensure the buyer has paid the exact price
isPricePaid: Bool = tx.value_sent_to(datum.seller) == datum.price;

// Ensure the NFT is transferred to the buyer
nftTransferred: Bool = tx.outputs.any((output: TxOutput) -> Bool {
// Get the amount of the specific NFT (AssetClass)
nftAmount: Int = output.value.get(datum.nft);
nftAmount > 0 && output.address.credential == Credential::new_pubkey(tx.signatories.get(0))
});

isPricePaid && nftTransferred
},
Cancel => {
// Only the seller can cancel the sale
tx.is_signed_by(datum.seller)
}
}
}
`