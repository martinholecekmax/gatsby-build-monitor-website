import moment from 'moment/moment';
import React from 'react';
import { Link } from 'react-router-dom';
import { BUILD_STATUS } from '../../utils/constants';

import BuildStatus from '../build-status/build-status';
import * as styles from './build-card.module.css';

const BuildCard = ({ build, onCancelBuild }) => {
  const createdAt = moment(build.createdAt).format('MMMM Do YYYY, HH:mm A');

  const showCancelButton =
    build.status === BUILD_STATUS.QUEUED ||
    build.status === BUILD_STATUS.BUILDING;

  return (
    <div key={build.id} className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>Build Triggered</div>
        <div className={styles.buttons}>
          <Link to={`/builds/${build._id}`}>View Build</Link>
          {showCancelButton ? (
            <div
              className={`${styles.cancelButton}`}
              onClick={() => onCancelBuild(build._id)}
            >
              Cancel Build
            </div>
          ) : null}
        </div>
      </div>
      <BuildStatus
        status={build.status}
        createdAt={build.createdAt}
        duration={build.duration}
      />
      <div className={styles.content}>
        <div>{build.authorName}</div>
        <div>{createdAt}</div>
      </div>
    </div>
  );
};

export default BuildCard;
