import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import Image from 'next/image';
import React, { useEffect } from 'react';
import useBet from 'store/useBet';
import styles from './styles.module.scss';

const PHANTOM = new PhantomWalletAdapter();

const WalletConnector: React.FC = () => {
    const { connection } = useConnection();
    const { connected, publicKey, wallet, select, connect, disconnect } = useWallet();

    useEffect(() => {
        if (publicKey !== null && connected && connection) {
            connection.getBalance(publicKey).then((balance) => {
                const solBalance = balance / LAMPORTS_PER_SOL;
                useBet.setState({ solBalance });
            });
        }
    }, [connected, connection, publicKey]);

    const onConnect = () => {
        if (wallet) connect();
        else select(PHANTOM.name);
    };

    const onDisconnect = () => {
        disconnect();
    };

    return (
        <div className={styles.walletContainer}>
            <div className={styles.wallet}>{connected ? publicKey?.toBase58() : 'Connect wallet'}</div>
            <button className={styles.walletConnectButton} onClick={connected ? onDisconnect : onConnect} style={{ cursor: 'pointer' }}>
                <Image src={PHANTOM.icon || ''} objectFit="contain" objectPosition="center" layout="fill" alt={PHANTOM.name || ''} />
            </button>
        </div>
    );
};

export default WalletConnector;
