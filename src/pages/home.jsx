import React from 'react';
import Builds from '../components/builds/builds';
import TriggerButton from '../components/trigger-button/trigger-button';

import * as styles from './home.module.css';

const Home = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>Build History</div>
        <TriggerButton />
      </div>
      <Builds />
    </div>
  );
};

export default Home;
