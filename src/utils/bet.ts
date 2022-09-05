import { Program, Provider } from '@project-serum/anchor';
import { nu64, struct, u8 } from '@solana/buffer-layout';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { ConfirmOptions, Connection, PublicKey, Signer, SystemProgram, Transaction, TransactionInstruction } from '@solana/web3.js';
import { idl } from 'idl/rock_paper_scissor';
import { BetHand, FightData, PlaceBetData } from 'types';
import { RockPaperScissor } from 'types/rock_paper_scissor';

export const programId = new PublicKey('5ceMnTtAsQmKVBdQjUnMFzJdz2iK7Q8MytBNXEu5CRYd');
export const BET_SEED = 'bet';
export const BET_SIZE = 44;

export function getProvider(connection: Connection, wallet: WalletContextState): Provider | null {
    if (!wallet.publicKey) return null;
    const sendAndConfirm = async (tx: Transaction, signers?: Signer[] | undefined, opts?: ConfirmOptions | undefined) => {
        return await wallet.sendTransaction(tx, connection);
    };
    const provider = { connection, publicKey: wallet.publicKey, sendAndConfirm };
    return provider;
}

// // export function get

export function getProgramInstance(connection: Connection, wallet: WalletContextState) {
    const provider = getProvider(connection, wallet);
    if (!provider) return;
    const program = new Program<RockPaperScissor>(idl, programId, provider);
    return program;
}

export async function getBetPDA(publicKey: PublicKey) {
    const betPubkey = await PublicKey.createWithSeed(publicKey, BET_SEED, programId);
    return betPubkey;
}

export async function createBetAccountInstruction(connection: Connection, publicKey: PublicKey, betPubkey: PublicKey) {
    const lamports = await connection.getMinimumBalanceForRentExemption(BET_SIZE);
    return SystemProgram.createAccountWithSeed({
        fromPubkey: publicKey,
        basePubkey: publicKey,
        seed: BET_SEED,
        newAccountPubkey: betPubkey,
        lamports,
        space: BET_SIZE,
        programId,
    });
}

export function createPlaceBetInstruction(publicKey: PublicKey, betPubkey: PublicKey, amount: number) {
    const keys = [
        { pubkey: publicKey, isSigner: true, isWritable: false },
        { pubkey: betPubkey, isSigner: false, isWritable: true },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    ];
    const placeBetDataLayout = struct<PlaceBetData>([u8('instruction'), nu64('amount')]);
    let placeBetData = Buffer.alloc(placeBetDataLayout.span);
    placeBetDataLayout.encode({ instruction: 0, amount }, placeBetData);
    return new TransactionInstruction({ keys, programId, data: placeBetData })
}

export function createFightInstruction(publicKey: PublicKey, betPubkey: PublicKey, hand: BetHand) {
    const keys = [
        { pubkey: publicKey, isSigner: true, isWritable: false },
        { pubkey: betPubkey, isSigner: false, isWritable: true },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    ];
    const fightDataLayout = struct<FightData>([u8('instruction'), u8('hand')]);
    let fightData = Buffer.alloc(fightDataLayout.span);
    const handMap: Record<BetHand, number> = { rock: 0, paper: 1, scissor: 2 };
    fightDataLayout.encode({ instruction: 1, hand: handMap[hand] }, fightData);
    return new TransactionInstruction({ keys, programId, data: fightData });
}
