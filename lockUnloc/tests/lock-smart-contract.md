//This is a test code on the lock smart contract
//Output is displayed below

 ```
 import {opt,j} from "./js/jimba.js";
    opt._R = 0; //run all tests, checks and logs
    opt._O = 1; //run only logs
    opt._M = 0; //show stake frames of logs
    opt._T = 1; //run tests
    opt._Ob = 0; //show tests stack frames
    opt._FailsOnly = 0; //run only failed tests
    opt._F = 0; //show functions that are marked with j.s() and j.e() for function profiling
    opt._ui = 1;
    opt._tNo = 1; //this is the number of times testPack will run

import {vesting} from "./scripts/vesting.js";


 //1. testing lock smart contract
 export  const lock =async(vesting,amount=10_000_000,secretMessage="secret")=>{
        
        const utxos = await walletData.utxos; 
        j.test("lock", "Testing utxos:", utxos).array();
        
        const walletAPI = await walletData.walletAPI; 
        j.test("lock", "Testing walletAPI:", walletAPI).object();
        
        const changeAddr = await walletData.walletHelper.changeAddress; 
        j.test("lock", "Testing changeAddr:", changeAddr).string();
        
        const tx = new Tx();
        tx.addInputs(utxos[0]); 
        j.test("lock", "Testing tx after adding inputs:", tx).object();
        
        const vestingProgram = Program.new(vesting);
        vestingProgram.parameters = { ["SECRET"]: secretMessage };
        
        const vestingProgramCompiled = vestingProgram.compile(true); 
        j.test("lock", "Testing vestingProgramCompiled:", vestingProgramCompiled).null();
        
        const vHash = vestingProgramCompiled.validatorHash.hex; 
        j.test("lock", "Testing vHash:", vHash).string();
        
        const scriptAddress = Address.fromHashes(vestingProgramCompiled.validatorHash); 
        j.test("lock", "Testing scriptAddress:", scriptAddress).string();
        
        const vestingDatum = new (vestingProgram.types.Datum)(changeAddr.pubKeyHash); 
        j.test("lock", "Testing vestingDatum:", vestingDatum).string();
        
        const adaToSend = new Value(BigInt(amount)); 
        j.test("lock", "Testing adaToSend:", adaToSend).object();
        
        const lovelaceToSend = adaToSend.lovelace;
        
        const value_ = new Value(lovelaceToSend); 
        j.test("lock", "Testing value_:", value_).object();
        
        const inLineDatum = Datum.inline(vestingDatum); 
        j.test("lock", "Testing inLineDatum:", inLineDatum).object();
        
        const txOutput = new TxOutput(scriptAddress, value_, inLineDatum); 
        j.test("lock", "Testing txOutput:", txOutput).object();
        
        tx.addOutput(txOutput); 
        j.test("lock", "Testing tx after adding output:", tx).object();
        
        const txh = await txEnd(tx, changeAddr); 
        j.test("lock", "Testing txh:", txh).object();

 
  }
```
![image](https://github.com/user-attachments/assets/5e630858-ff26-4cac-bdd1-8747d1e86891)


