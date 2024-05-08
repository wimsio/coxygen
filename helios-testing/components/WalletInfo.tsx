import styles from "../styles/Components.module.css"
const WalletInfo = ({ walletInfo } : any) => {
    return (
        <div className={styles.card}><b>Wallet Balance In Lovelace</b>
            <i>&nbsp;&nbsp;&nbsp;&nbsp;{walletInfo.balance}</i>
        </div>
    )
}

export default WalletInfo
