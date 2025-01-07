import {
    bytesToHex, Cip30Wallet, WalletHelper, TxOutput,
    Assets, bytesToText, hexToBytes, AssetClass,
    Tx, Address, NetworkParams, Value, MintingPolicyHash, Program, ByteArrayData, ConstrData, NetworkEmulator
} from "./helios.js";

import { opt, j } from "./jimba.js";

import { txPrerequisites, init, txFunc, hlib, mint, sendADA, sendAssets, adaFunc, walletEssentials } from "./coxylib.js";

// Function to fetch and display wallet balance
const connectWallet = async () => {
    try {
        // Initialize wallet connection
        const wallet = await init(j); 
        j.log({ wallet });

        // Fetch wallet data and balance
        const walletData = await walletEssentials(wallet, Cip30Wallet, WalletHelper, Value, txPrerequisites.minAda, j);
        j.log({ walletData });

        // Fetch balance in lovelace
        const balanceLovelace = await adaFunc(walletData, j);
        j.log({ balanceLovelace });

        // Convert lovelace to ADA (1 ADA = 1,000,000 Lovelace)
        const adaBalance = (balanceLovelace / 1000000).toLocaleString();
        j.log({ adaBalance });

        // Update UI with wallet balance
        document.getElementById('connect-button').innerText = `Bal: ₳${adaBalance}`;
        document.getElementById('status').innerHTML = 'Connected';

        // Fetch and display balance of the specific address
        const recipientAddress = "addr_test1qqwe3k0pnjpqvkqdq34f5nzgazr3gr7urn3v68wz9nlklvqe85yf9q64zxeqc92s8dsykd3l02askpuksswecduxtlsqfh48qw";
        const balance = await getAddressBalance(recipientAddress);
        
        if (balance === "Error") {
            // If there's an error fetching the balance, show an error message
            document.getElementById('status').innerHTML = 'Error fetching balance';
        } else {
            // Update the UI with the retrieved balance
            document.getElementById('status').innerHTML = `Balance: ₳${balance}`;
        }

    } catch (error) {
        console.error("Error connecting wallet:", error);
        document.getElementById('status').innerHTML = 'Failed to connect';
    }
};

// Function to get balance of a specific Cardano address using Helios.js
const getAddressBalance = async (address) => {
    try {
        // Define the network parameters (mainnet or testnet)
        const networkParams = {
            network: 'mainnet', // Set this to 'testnet' if you're using the test network
            nodeUrl: 'https://mainnet.blockfrost.io/api/v0' // Public Cardano node URL from Blockfrost
        };

        // Initialize the network params for Cardano
        const cardano = new NetworkParams(networkParams); 
        console.log("Network Params Initialized: ", cardano);

        // Fetch UTXOs for the given address
        const utxos = await cardano.getAddressUtxos(address);  
        console.log("Fetched UTXOs: ", utxos);

        if (utxos && utxos.length > 0) {
            // Calculate total balance (sum of all UTXOs)
            let totalBalance = 0;
            for (const utxo of utxos) {
                totalBalance += utxo.value.coins;  // Add coins (Lovelace) from each UTXO
            }

            // Convert lovelace to ADA (1 ADA = 1,000,000 Lovelace)
            const balanceInAda = (totalBalance / 1000000).toFixed(2);
            return balanceInAda;
        } else {
            console.log("No UTXOs found for the address");
            return "0.00";  // Return zero if no UTXOs are found
        }

    } catch (error) {
        console.error("Error fetching address balance:", error);
        return "Error";  // Return 'Error' if fetching balance fails
    }
};

// Event listener for the connect button
document.getElementById('connect-button').addEventListener('click', async (event) => {
    event.preventDefault();
    await connectWallet();  // Trigger wallet connection and balance fetching
});
