import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import client from '../../services/axios';

import * as styles from './trigger-button.module.css';

const TriggerButton = () => {
  const authorId = 1;
  const authorName = 'Martin';
  const triggerBuild = async (clearCache = false) => {
    const response = await client.post(`/trigger-build`, {
      clearCache,
      authorName,
      authorId,
    });
    console.log('response', response);
  };

  const onBuildTriggered = () => {
    triggerBuild(false);
  };

  const onBuildTriggeredClear = () => {
    triggerBuild(true);
  };

  return (
    <div className={styles.container}>
      <button
        className={`btn ${styles.triggerButton}`}
        onClick={onBuildTriggered}
      >
        Trigger build
      </button>
      <div className={styles.dropDown}>
        <button className={`btn ${styles.dropDownButton}`}>
          <FontAwesomeIcon icon={faCaretDown} />
        </button>
        <div className={styles.dropDownContent}>
          <div className={styles.clearButton} onClick={onBuildTriggeredClear}>
            Clear cache
          </div>
        </div>
      </div>
    </div>
  );
};

export default TriggerButton;
