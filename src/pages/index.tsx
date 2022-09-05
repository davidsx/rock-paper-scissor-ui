import Notification from 'components/Notification';
import BetCard from 'components/BetCard';
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from './styles.module.scss';

const Home: NextPage = () => {
    return (
        <div className={styles.body}>
            <Head>
                <title>Rock - Paper - Scissor</title>
            </Head>
            <BetCard />
            <Notification />
        </div>
    );
};

export default Home;
