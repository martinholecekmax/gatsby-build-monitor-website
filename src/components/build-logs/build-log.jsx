import React, { useEffect, useRef } from 'react';

import moment from 'moment';

import styles from './build-log.module.css';

// Get log status color
const getLogStatusColor = (word) => {
  let style = null;
  switch (word) {
    case 'info':
      style = styles.info;
      break;
    case 'success':
      style = styles.success;
      break;
    case 'ERROR':
    case 'error':
    case 'failed':
      style = styles.error;
      break;
    case 'warning':
    case 'WARN':
    case 'warn':
      style = styles.warning;
      break;
    default:
      style = null;
      break;
  }
  return style;
};

// Build log component
const Log = ({ log }) => {
  const { timestamp, message } = log;
  const timestampFormatted = moment(timestamp).format('HH:mm:ss A');

  // Get log status word
  const statusWord = message?.split(' ')[0];
  const statusStyle = getLogStatusColor(statusWord);

  let logStyle = '';
  if (message === 'Build completed successfully') {
    logStyle = styles.success;
  } else if (message === 'Build failed') {
    logStyle = styles.error;
  } else if (message === 'Build cancelled') {
    logStyle = styles.warning;
  }

  const scroll = useRef();

  useEffect(() => {
    if (scroll.current) {
      scroll.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, []);

  return (
    <div className={styles.container} ref={scroll}>
      <div className={styles.timestamp}>{timestampFormatted}:</div>
      <FormattedMessage
        message={message}
        statusWord={statusWord}
        className={logStyle}
        statusStyle={statusStyle}
      />
    </div>
  );
};

const FormattedMessage = ({ message, statusWord, className, statusStyle }) => {
  const formattedMessage = message?.replace(statusWord, '');
  return (
    <div className={`${styles.message} ${className}`}>
      <span className={statusStyle}>{statusWord}</span>
      {formattedMessage}
    </div>
  );
};

export default Log;
