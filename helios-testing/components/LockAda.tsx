import { useState } from 'react'
import styles from "../styles/Components.module.css"

const LockAda = ({ onLockAda } : any) => {

    const [address, setAddress] = useState('');
    const [qty, setQty] = useState('');
    const [dueDate, setDueDate] = useState('');

    const onSubmit = (e : any) => {        
        e.preventDefault() // prevent full page refresh
        onLockAda([address, qty, dueDate])
    }

    return (

        <form onSubmit={onSubmit} className={styles.card}>
            <div >
                <b>Enter the wallet address of the beneficiary</b> 
                <br></br>
                <input name='address' type='text' id='address' className={styles.inputBoxes} placeholder='Enter Beneficiary Wallet Address' 
                value={address}
                onChange={(e) => {
                    const add = e.target.value;
                    localStorage.setItem('benAddr',add)
                    setAddress(add);
                }}
                />
                <p></p>                 
            </div>
            <div>
                <b>Enter amount of ADA to lock for beneficiary</b> 
                <br></br>
                <input name='qty' type='number' className={styles.inputBoxes} id='qty' placeholder='Enter Amount Of Ada To Lock' 
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                />
                <p></p>  
            </div>
            <div>
                <b>Enter the date locked ADA to be claimed by beneficiary</b> 
                <br></br>
                <input name='dueDate' className={styles.inputBoxes} type='date' id='dueDate' placeholder='Select Vesting Expiry Date' 
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                />
                <p></p>  
            </div>
            <br></br>                   
            <input type='submit' className={styles.inputButton} value='Lock ADA on smart contract'/>
        </form>
    )
}

export default LockAda