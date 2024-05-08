import { useState } from 'react'
import styles from "../styles/Components.module.css"

const ClaimFunds = ({ onClaimFunds } : any) => {

    const vkkPolicyId = localStorage.getItem('vkPolicyId')

    let [key, setKey] = useState('');

    const onSubmit = (e : any) => {
        
        e.preventDefault() // prevent full page refresh
 
        onClaimFunds([vkkPolicyId])
    }

    return (
       
        <form onSubmit={onSubmit} className={styles.card}>
            <div>
                <b>Congratulations Beneficiary, you have some ADA to unlock!</b> 
                <br></br>
                <p>Switch wallect Account to that of person claiming locked ADA</p> 
                <input className={styles.inputBoxes} name='key' type='text' id='key' placeholder='Enter the smart contract policy id' 
                value={vkkPolicyId?vkkPolicyId:"Do not click, no funds locked"}
                onChange={(e) => setKey(e.target.value)}
                />
                <p></p>  
            </div>
            <br></br>                   
            <input className={styles.inputButton} type='submit' value='Claim Funds'/>
        </form>       
        
    )
}

export default ClaimFunds