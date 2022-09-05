import { Connection, PublicKey, SystemProgram, Transaction, TransactionInstruction } from '@solana/web3.js';
import create from 'zustand';
import { BetHand, BetResult, PlaceBetData, FightData } from 'types';
import { programId, getBetPDA, getProgramInstance } from 'utils/bet';
import { struct, u8, nu64 } from '@solana/buffer-layout';
import { BN } from '@project-serum/anchor';
import { AnchorWallet, WalletContextState } from '@solana/wallet-adapter-react';

export type BetStore = {
    amount?: number;
    hand?: BetHand;
    result?: BetResult;

    solBalance: number;

    betPubkey?: PublicKey;

    createBetTransaction: (publicKey: PublicKey) => Promise<Transaction | undefined>;
    sendBetTransaction: (connection: Connection, wallet: WalletContextState) => Promise<void>;
};

const useBet = create<BetStore>((set, get) => ({
    solBalance: 0,

    async createBetTransaction(publicKey) {
        const betPDA = await getBetPDA(publicKey);
        const { amount, hand } = get();

        if (!amount || !hand) return;

        const keys = [
            { pubkey: publicKey, isSigner: true, isWritable: false },
            { pubkey: betPDA, isSigner: false, isWritable: true },
            { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
        ];

        const placeBetDataLayout = struct<PlaceBetData>([u8('instruction'), nu64('amount')]);
        let placeBetData = Buffer.alloc(placeBetDataLayout.span);
        placeBetDataLayout.encode({ instruction: 0, amount }, placeBetData);

        const fightDataLayout = struct<FightData>([u8('instruction'), u8('hand')]);
        let fightData = Buffer.alloc(fightDataLayout.span);
        const handMap: Record<BetHand, number> = { rock: 0, paper: 1, scissor: 2 };
        fightDataLayout.encode({ instruction: 1, hand: handMap[hand] }, fightData);

        const transaction = new Transaction();
        transaction.add(new TransactionInstruction({ keys, programId, data: placeBetData }));
        transaction.add(new TransactionInstruction({ keys, programId, data: fightData }));

        set({ betPubkey: betPDA });
        return transaction;
    },

    async sendBetTransaction(connection, wallet) {
        const { amount, hand } = get();
        if (!amount || !hand || !wallet.publicKey) return;

        const publicKey = wallet.publicKey;
        const program = getProgramInstance(connection, wallet);
        const betPDA = await getBetPDA(publicKey);

        if (program) await program.methods.createBet().accounts({ bet: betPDA, player: publicKey }).rpc();
        if (program && amount) await program.methods.placeBet(new BN(amount)).accounts({ bet: betPDA, player: publicKey }).rpc();
        if (program && hand) await program.methods.fight(hand).accounts({ bet: betPDA, player: publicKey }).rpc();
    },
}));

export default useBet;
