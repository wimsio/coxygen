//This is a test code on the unlock smart contract

//Output is displayed below Jimba speeds up front end testing and simplifies smart contract development 

//source : Anyone can get the library here https://www.npmjs.com/package/jimba

//link to live hosted demo : https://coxygen.co/coxygen.co/demo/tests/index.html

 ```
export const unLock =async(vesting, secretMessage="secret")=>{
    
        j.s("unLock")
      
        const utxos = await walletData.utxos; 
        j.test("unLock", "Testing utxos:", utxos).array();
        
        const walletAPI = await walletData.walletAPI; 
        j.test("unLock", "Testing walletAPI:", walletAPI).object();
        
        const changeAddr = await walletData.walletHelper.changeAddress; 
        j.test("unLock", "Testing changeAddr:", changeAddr).string();
        
        const vestingProgram = Program.new(vesting);
        vestingProgram.parameters = { ["SECRET"]: secretMessage };
        
        const vestingProgramCompiled = vestingProgram.compile(true); 
        j.test("unLock", "Testing vestingProgramCompiled:", vestingProgramCompiled).string();
        
        const addrFromValidatorHash = await Address.fromHashes(vestingProgramCompiled.validatorHash); 
        j.test("unLock", "Testing addrFromValidatorHash:", addrFromValidatorHash).string();
        
        const vestingRedeemer = (new vestingProgram.types.Redeemer.Claim(secretMessage))._toUplcData();
        
        const allAddresses = await walletData.walletHelper.allAddresses; 
        j.test("unLock", "Testing allAddresses:", allAddresses).array();
        
        const receiveAddress = allAddresses[0];
        j.test("unLock", "Testing receiveAddress:", receiveAddress).string();
        
        const tx = new Tx();
        
        tx.attachScript(vestingProgramCompiled);
        
        tx.addInputs(utxos[0]); 
        j.test("unLock", "Testing tx after adding inputs:", tx).object();
        
        const txInput = await txInputFromBlockfrost(addrFromValidatorHash); 
        j.test("unLock", "Testing txInput from Blockfrost:", txInput).object();
        
        tx.addInput(txInput, vestingRedeemer); 
        j.test("unLock", "Testing tx after adding input with vestingRedeemer:", tx).object();
        
        tx.addSigner(receiveAddress.pubKeyHash);
        
        j.trics(null)
        
        j.e("unLock")
        
        const txh = await txEnd(tx, changeAddr); 
        j.test("unLock", "Testing txh:", txh).string();
               
  }
 ```
//below is the image of the live testing using j.log({}) on unlock smart contract 

![image](https://github.com/user-attachments/assets/8989d79d-3f27-4dd0-b930-a1aa85847d60)

//below is the image of the live testing of unlock smart contract using j.test() unit testing functions

![image](https://github.com/user-attachments/assets/6ca50044-7073-41f9-9dc5-57d3d6dbb79b)

//Test is now filtered to show only failing tests

![image](https://github.com/user-attachments/assets/013c7de0-6dcc-4368-9b72-bfa327549405)

//image below shows tests only being displayed, objects exploded to show stack frames and also shows speed profiling 

![image](https://github.com/user-attachments/assets/881b039d-7bdc-4b07-b40e-93b174afec36)


