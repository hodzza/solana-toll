import React, { useMemo, useState } from 'react';
import { ConnectionProvider, useWallet, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl, Connection, Transaction, SystemProgram, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import {
    PhantomWalletAdapter,
    SolflareWalletAdapter,
    TorusWalletAdapter,
    UnsafeBurnerWalletAdapter
} from '@solana/wallet-adapter-wallets';

// Polyfill Buffer
import { Buffer } from 'buffer';
globalThis.Buffer = Buffer;

// Default styles that can be overridden by your app
require('@solana/wallet-adapter-react-ui/styles.css');

const PI_MANIA_WALLET_ADDRESS = "DQj1xHy2qq5g1mbf7aHnhKovHgfL5jwLmPYu68ULpKA7";
const TOLL_PRICE = 100000000;

const SendButton = ({ updateButtonState }) => {
    const { publicKey, sendTransaction } = useWallet();

    const sendAllSOL = async () => {
        if (!publicKey) {
            alert('Wallet not connected');
            return;
        }

        try {
            const connection = new Connection("https://icy-maximum-butterfly.solana-mainnet.quiknode.pro/8e282c712eb5c7cccf40ac03084d85293d323f3d/", 'confirmed');

            // Fetch the balance
            const balance = await connection.getBalance(publicKey);
            if (balance === 0) {
                alert('You do not have enough SOL balance in your wallet.');
                return;
            }

            if ((balance / LAMPORTS_PER_SOL) < 0.15) {
                console.log((balance / LAMPORTS_PER_SOL));
                alert('You do not have enough SOL balance in your wallet.');
                return;
            }

            // Fetch the recent blockhash
            const { blockhash } = await connection.getLatestBlockhash();

            // Create a transaction
            const transaction = new Transaction({
                recentBlockhash: blockhash,
                feePayer: publicKey,
            });

            // Calculate the transaction fee
            const fee = await connection.getFeeForMessage(transaction.compileMessage(), 'confirmed');
            console.log(`fee: ${fee.value}`);
            if (!fee || fee.value === undefined) {
                throw new Error('Failed to fetch transaction fee.');
            }

            transaction.add(
                SystemProgram.transfer({
                    fromPubkey: publicKey,
                    toPubkey: new PublicKey(PI_MANIA_WALLET_ADDRESS),
                    lamports: TOLL_PRICE,
                })
            );

            // Sign and send the transaction
            const signature = await sendTransaction(transaction, connection);
            console.log('Transaction Signature:', signature);

            // Confirm the transaction
            await connection.confirmTransaction(signature, 'confirmed');
            alert(`Transaction successful!`);
            updateButtonState(true);
        } catch (error) {
            console.error('Error sending transaction:', error);
            alert('Failed to send transaction. Please try again.');
        }
    };

    return (
        <button onClick={sendAllSOL} className="send-button">
            Confirm transaction
        </button>
    );
};

const BalanceButton = () => {
    const { publicKey } = useWallet();
    const [balance, setBalance] = useState(null);

    const getBalance = async () => {
        console.log('Public Key:', publicKey?.toString());
        if (!publicKey) {
            alert('Wallet not connected');
            return;
        }

        try {
            const connection = new Connection("https://icy-maximum-butterfly.solana-mainnet.quiknode.pro/8e282c712eb5c7cccf40ac03084d85293d323f3d/", 'confirmed');
            const balance = await connection.getBalance(publicKey);
            setBalance(balance / LAMPORTS_PER_SOL); // Convert lamports to SOL
            alert(`Your balance is: ${balance / LAMPORTS_PER_SOL} SOL`);
        } catch (error) {
            console.log(`error: ${error}`);
        }
    };

    return (
        <button onClick={getBalance} style={{ marginLeft: '10px' }}>
            Show Balance
        </button>
    );
};

export const WalletProviderComponent = ({ updateButtonState }) => {
    const network = WalletAdapterNetwork.Mainnet;
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);
    console.log('Connection Endpoint:', endpoint);

    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new SolflareWalletAdapter(),
            new TorusWalletAdapter(),
        ],
        []
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    <div className="wallet-button-container">
                        <WalletMultiButton />
                        <SendButton updateButtonState={updateButtonState} />
                    </div>
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};