import { useState } from 'react'
import styles from "../styles/Components.module.css"

const CancelVesting = ({ onCancelVesting } : any) => {

    const vkkPolicyId = localStorage.getItem('vkPolicyId')

    let [key, setKey] = useState('');

    const onSubmit = (e : any) => {
        
        e.preventDefault() // prevent full page refresh
        
        onCancelVesting([vkkPolicyId])
    }

    return (

        <form onSubmit={onSubmit} className={styles.card}>
            <div>
                <b>Cancel vesting and return locked ADA back to owner</b> 
                <p>NOTE! You can ONLY cancel if owner and if it is before the deadline</p> 
                <p><i>OTHERWISE! Switch to beneficiary account and claim locked ADA</i>
                </p>
                <input className={styles.inputBoxes} name='key' type='text' id='key' 
                placeholder='Enter the smart contract policy id' 
                value={vkkPolicyId?vkkPolicyId:"Do not click, essential info policyid not found"}
                onChange={(e) => setKey(e.target.value)}
                />
                <p></p>  
            </div>
            <br></br>                   
            <input type='submit' className={styles.inputButton} value='Cancel Vesting'/>
        </form>
    )
}

export default CancelVesting