import type { NextPage } from 'next'
import styles from '../styles/Home.module.css'
import {
  Assets,
  Address,
  Datum,
  MintingPolicyHash,
  NetworkParams,
  NetworkEmulator,
  Program,
  Value,
  TxOutput,
  Tx,
  WalletEmulator} from "@hyperionbt/helios";
  import { useEffect } from 'react';
  import {o,opt,tS,tE,jtest,jtrics,gNo,gNull,gAlphaNumericSymbolsString,gLowerCaseAlphabetString,gBoolean,gOnlyDigitsString,gUpperCaseAlphabetString} from 'jimba';
  opt._O = 1;
  opt._T = 1;
  opt._tNo = 100;
  opt._M = 1;
  opt._Tc = 1;


declare global {
  interface Window {
    cardano: any;
  }
}

const Index: NextPage = (props: any) => {
 //
  for (let i = 0; i < opt._tNo; i++) {
    const null_v = gNull(); o(null_v)  
    const gAlphaNumericSymbolsString_ = gAlphaNumericSymbolsString(); o({gAlphaNumericSymbolsString_})
      
  }

  const name = "james dudu"; o({name})

  const name_ = gAlphaNumericSymbolsString(); o({name_})

    const nftName = 'Coxygen NFT Testing 07-05-2023';
    const nftMph = MintingPolicyHash.fromHex(
      '191c7dd3f646203df7622c796bfe3b73a33b20f08e9f86ebc6fcd403'
    )
  
    const lockNftScript = `
    spending lock_nft
  
    struct Datum {
        admin: PubKeyHash
        ticketPrice: Value
        participants: []PubKeyHash
  
        func is_admin(self, tx: Tx) -> Bool { tx.is_signed_by(self.admin) }
    }
  
    enum Redeemer {
      Admin
      JoinRaffle {
        pkh: PubKeyHash
      }
    }
    
    func main(datum: Datum, redeemer: Redeemer, context: ScriptContext) -> Bool {
        tx: Tx = context.tx;
        print("hello world");
        redeemer.switch {
          Admin => {
              datum.is_admin(tx).trace("TRACE_IS_ADMIN: ")
          },
          joinRaffle: JoinRaffle => {
            
            // Test 3 things
            // 1. ticketPrice is paid into the contract (that all that was in the script, + the ticket price , is sent to the datum)
            // 2. uxto where previous datum leaves to be spent
            // 3. new datum is like current + participants contains the pkh of current signer.
            if (!tx.is_signed_by(joinRaffle.pkh)) {
              false.trace("TRACE_SIGNED_BY_PARTICIPANT: ")
            } else {
              
              valueLocked: Value = tx.value_locked_by_datum(context.get_current_validator_hash(), datum, true);
  
              expectedTargetValue: Value = valueLocked + datum.ticketPrice;
    
              new_datum: Datum = Datum { datum.admin, datum.ticketPrice, datum.participants.prepend(joinRaffle.pkh) };
    
              actualTargetValue: Value = tx.value_locked_by_datum(context.get_current_validator_hash(), new_datum, true);
    
              (actualTargetValue >= expectedTargetValue).trace("TRACE_ALL_GOOD? ")
  
            }
          }
      }
    }` as string;

    useEffect(()=>{
        test()
    },[])
    const test = async () => {

        const useNetworkEmulator = false;    
        const network = new NetworkEmulator();    
        const networkParams = new NetworkParams(
          await fetch('https://d1t0d7c2nekuk0.cloudfront.net/preview.json').then(
            (response) => response.json()
          )
        );
    
        const assets = new Assets();    
        assets.addComponent(
          nftMph,
          Array.from(new TextEncoder().encode(nftName)),
          BigInt(1)
        );
    

        const alice = network.createWallet(BigInt(100_000_000), assets); o({assets})
        const pkh = await {alice}.alice.pubKeyHash.hex; 
        jtest("alice pkh is not empty",pkh.length > 0,true)
        network.tick(BigInt(10));
        
    
        const bruce = network.createWallet(BigInt(100_000_000)); 
        const pkhb = await {bruce}.bruce.pubKeyHash.hex; jtest("alice pkh is cb9358529df4729c3246a2a033cb9821abbfd16de4888005904abc41",pkh,"cb9358529df4729c3246a2a033cb9821abbfd16de4888005904abc41")
        network.tick(BigInt(10));
    
        const aliceAddress = alice.address.toBech32(); o({aliceAddress}); jtest("Address is testnet",aliceAddress.includes("addr_test"),false)
        const bruceAddress = bruce.address.toBech32(); o({bruceAddress});jtest("Alice has same address with Bruce",aliceAddress,bruceAddress)

        const raffleProgram = Program.new(lockNftScript); 
        const raffleUplcProgram = raffleProgram.compile(false);o("...now compiling script")
    
        const raffleAddress = Address.fromValidatorHash(raffleUplcProgram.validatorHash);
        const raffleAddressBec32 = raffleAddress.toBech32();o({raffleAddressBec32}); jtest("raffleAddressBec32 is not empty",raffleAddressBec32.length > 0,true)    
        await lockRaffleNft(alice, bruce, raffleAddress, assets, network, networkParams, raffleProgram);    
        network.tick(BigInt(10));

      }
    
      const lockRaffleNft = async (
        alice: WalletEmulator,
        bruce: WalletEmulator,
        raffleAddress: Address,
        assets: Assets,
        network: NetworkEmulator,
        networkParams: NetworkParams,
        program: Program
      ) => {
       tS("lockRaffleNft")

        const tx = new Tx();
        const nftValue = new Value(BigInt(gNo(-1,1000)), assets);
        const raffleDatum = new (program.types.Datum)(
          alice.address.pubKeyHash,
          new Value(BigInt(5000000)),
          []
        ); o({raffleDatum})
    
        await tx
          .addInputs(await network.getUtxos(alice.address))
          .addOutput(new TxOutput(raffleAddress, nftValue, Datum.inline(raffleDatum._toUplcData())))
          .finalize(networkParams, alice.address); 

        const txDump =  tx.dump(); o({txDump})
    
        o("Verifying signature...");
        const signatures = await alice.signTx(tx); o({signatures})
        tx.addSignatures(signatures);
    
        o("Submitting transaction...");
        const rtx = await alice.submitTx(tx);  o(rtx)
        const txHash = rtx.hex;  o({txHash})

        tE("lockRaffleNft")
        jtrics()
      }
    
      return (
        <div className={styles.main}>
        <div className={styles.card}>
          <h2>Coxygen Test Jimba</h2>
          <button type='button' onClick={() => test()} className={styles.title}>Run Tests</button>
        </div>
        </div>
      )
    }
    
    export default Index
