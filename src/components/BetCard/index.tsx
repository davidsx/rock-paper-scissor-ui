import { useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react';
import styles from './styles.module.scss';
import WalletConnector from './WalletConnector';
import useNoti from 'store/useNoti';
import useBet from 'store/useBet';
import { BetHand } from 'types';
import { isNullOrUndefined } from 'utils/common';
import { useState } from 'react';
import classNames from 'classnames';
import { BET_SIZE, createBetAccountInstruction, createFightInstruction, createPlaceBetInstruction, getBetPDA } from 'utils/bet';
import { LAMPORTS_PER_SOL, SystemProgram, Transaction } from '@solana/web3.js';

const BetCard: React.FC = () => {
    const { connection } = useConnection();
    const anchorWallet = useAnchorWallet();
    const { publicKey, sendTransaction } = useWallet();
    const [amountValue, setAmountValue] = useState('');

    const sendSuccessNoti = useNoti((s) => s.sendSuccessNoti);
    const sendErrorNoti = useNoti((s) => s.sendErrorNoti);

    const solAmount = useBet((s) => s.solBalance);
    const amount = useBet((s) => s.amount);
    const hand = useBet((s) => s.hand);
    const result = useBet((s) => s.result);
    const solBalance = useBet((s) => s.solBalance);
    const sendBetTransaction = useBet((s) => s.sendBetTransaction);
    const createBetTransaction = useBet((s) => s.createBetTransaction);

    const onChangeAmount: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
        if (/^[0-9.]*$/.test(e.currentTarget.value)) {
            setAmountValue(e.currentTarget.value);
            if (parseFloat(e.currentTarget.value) !== NaN) useBet.setState({ amount: parseFloat(e.currentTarget.value) });
        }
    };

    const onClickHand: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
        useBet.setState({ hand: e.currentTarget.value as BetHand });
    };

    const onBet = async () => {
        if (!publicKey || !amount || !hand) return;

        const betPubkey = await getBetPDA(publicKey);
        const instructions = [];

        const betAccount = await connection.getAccountInfo(betPubkey);
        if (betAccount === null) {
            instructions.push(await createBetAccountInstruction(connection, publicKey, betPubkey))
            await connection.confirmTransaction(await connection.requestAirdrop(betPubkey, amount * LAMPORTS_PER_SOL));
        }

        const transaction = new Transaction();
        instructions.push(createPlaceBetInstruction(publicKey, betPubkey, amount));
        instructions.push(createFightInstruction(publicKey, betPubkey, hand));
        transaction.add(...instructions);

        useBet.setState({ betPubkey });
        if (transaction) sendTransaction(transaction, connection);
    };

    return (
        <div className={styles.body}>
            <div className={styles.container}>
                <WalletConnector />
                <div className={styles.instruction}>Bet amount (SOL):</div>
                <div className={styles.amountContainer}>
                    <div className={styles.inputContainer}>
                        <div className={styles.balance}>Remaining: {solBalance}</div>
                        <input className={styles.input} value={amountValue} placeholder="amount" onChange={onChangeAmount} disabled={!solBalance} />
                    </div>
                </div>
                <div className={styles.instruction}>Choose your hand:</div>
                <div className={styles.handContainer}>
                    {['rock', 'paper', 'scissor'].map((value) => (
                        <button
                            key={value}
                            onClick={onClickHand}
                            className={classNames(styles.handButton, { [styles.active]: hand === value })}
                            value={value}
                            disabled={isNullOrUndefined(amount)}
                        >
                            {value}
                        </button>
                    ))}
                </div>
                <button className={styles.betButton} onClick={onBet} disabled={isNullOrUndefined(amount) || (amount || 0) > solAmount}>
                    {isNullOrUndefined(amount) ? 'Invalid amount' : solAmount > (amount || 0) ? 'Fight now' : 'Insufficient amount'}
                </button>
            </div>
        </div>
    );
};

export default BetCard;
