import {
  faCheckCircle,
  faCircleExclamation,
  faCircleInfo,
  faCirclePause,
  faCircleXmark,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import formatDuration from 'format-duration';
import moment from 'moment';
import React from 'react';
import { BUILD_STATUS } from '../../utils/constants';

import * as styles from './build-status.module.css';

const BuildStatus = ({ status, createdAt, duration }) => {
  const since = moment(createdAt).format('HH:mm A');
  let statusMessage = status;
  let statusIcon = null;
  const durationFormatted = formatDuration(duration || 0);

  switch (status) {
    case BUILD_STATUS.SUCCESS:
      statusIcon = (
        <FontAwesomeIcon icon={faCheckCircle} className={styles.success} />
      );
      statusMessage = `Build Successful in ${durationFormatted}`;
      break;
    case BUILD_STATUS.FAILED:
      statusIcon = (
        <FontAwesomeIcon icon={faCircleExclamation} className={styles.failed} />
      );
      statusMessage = 'Build has failed';
      break;
    case BUILD_STATUS.BUILDING:
      statusIcon = (
        <FontAwesomeIcon icon={faSpinner} spin className={styles.building} />
      );
      statusMessage = `Building since ${since}`;
      break;
    case BUILD_STATUS.QUEUED:
      statusIcon = (
        <FontAwesomeIcon icon={faCirclePause} className={styles.queued} />
      );
      statusMessage = `Queued since ${since}`;
      break;
    case BUILD_STATUS.CANCELLED:
      statusIcon = (
        <FontAwesomeIcon icon={faCircleXmark} className={styles.cancelled} />
      );
      statusMessage = `Cancelled after ${durationFormatted}`;
      break;
    default:
      statusIcon = (
        <FontAwesomeIcon icon={faCircleInfo} className={styles.info} />
      );
      break;
  }

  return (
    <div className={styles.container}>
      {statusIcon}
      <div className={styles.statusMessage}>{statusMessage}</div>
    </div>
  );
};

export default BuildStatus;
