export const scriptForMintingNFT  = 
`
  minting scriptForMintingNFT

            enum Redeemer { 
                Mint {
                    txId: ByteArray
                    txIdx: Int
                    qty:Int
                }
            }
            
            const RUN : Bool = false
            
            func jlogByteArray(title:String,variable:ByteArray)->(){
                if(RUN == true){
                    print(">>>>>>>>>>>>>>>>>>>>>>>>>>>>"); 
                    print(">>> Logging : "+title.show());
                    print(">>> "+variable.show());
                    print("<<<<<<<<<<<<<<<<<<<<<<<<<<<<")
                }
            }
            func jlogValue(title:String,variable:Value)->(){
                if(RUN == true){
                    print(">>>>>>>>>>>>>>>>>>>>>>>>>>>>");
                    print(">>> Logging : "+title.show());
                    print(">>> "+variable.show());
                    print("<<<<<<<<<<<<<<<<<<<<<<<<<<<<")
                }
            }

            func jlogAssetClass(title:String,variable:AssetClass)->(){
                if(RUN == true){
                    print(">>>>>>>>>>>>>>>>>>>>>>>>>>>>");
                    print(">>> Logging : "+title.show());
                    print(">>> "+variable.show());
                    print("<<<<<<<<<<<<<<<<<<<<<<<<<<<<")
                }
            }
            func jlogInt(title:String,variable:Int)->(){
                if(RUN == true){
                    print(">>>>>>>>>>>>>>>>>>>>>>>>>>>>");
                    print(">>> Logging : "+title.show());
                    print(">>> "+variable.show());
                    print("<<<<<<<<<<<<<<<<<<<<<<<<<<<<")
                }
            }

            const TN: ByteArray = #

            const ownerPKH: PubKeyHash = PubKeyHash::new(#)

            func main(redeemer: Redeemer, ctx: ScriptContext) -> Bool {

                tx: Tx = ctx.tx;
                
                value_minted: Value = tx.minted;
                
                mph: MintingPolicyHash = ctx.get_current_minting_policy_hash();
                
                jlogByteArray("TN",TN);
                
                redeemer.switch {
                    red: Mint => {
                    
                    if(red.qty >= 1)
                    {
                    
                        jlogInt("red qty",red.qty);
                        
                        assetclass: AssetClass = AssetClass::new(mph, TN);
                        
                        jlogAssetClass("assetclass",assetclass);
                        
                        jlogValue("value_minted",value_minted);
                        
                        jlogValue("Value::new(assetclass, 1)",Value::new(assetclass, 1));
                        
                        (value_minted == Value::new(assetclass, 1)) 
                        
                        &&
                        
                        tx.is_signed_by(ownerPKH) 
                  
                    }
                    else
                    {
                        tx.minted.get_policy(mph).all( (_, amount: Int) -> Bool { amount == -1})
                       
                    }
                        
                    }
                } 
            }

`