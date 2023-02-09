import React, { useCallback, useEffect, useState } from 'react';
import client from '../../services/axios';

import moment from 'moment';

import BuildStatus from '../build-status/build-status';
import { BUILD_STATUS } from '../../utils/constants';

import styles from './build-details.module.css';

const BuildDetails = ({ id, socket }) => {
  const [build, setBuild] = useState({});
  const [error, setError] = useState(null);

  // Get build details
  const fetchBuild = useCallback(async () => {
    try {
      const response = await client.get(`/builds/${id}`);
      console.log('response', response);
      const currentBuild = response.data.build || {};
      setBuild(currentBuild);
    } catch (error) {
      console.log(error);
      setError(error);
    }
  }, [id]);

  // Cancel build
  const onCancelBuild = async () => {
    const response = await client.get(`/cancel-build/${id}`);
    console.log('response', response);
  };

  useEffect(() => {
    fetchBuild();
  }, [fetchBuild]);

  // Listen for build status updates
  useEffect(() => {
    socket.on('build-status', (data) => {
      const build = data?.payload;
      const belongsToBuild = id === data?.id;
      if (build && belongsToBuild) {
        setBuild(build);
      }
    });
  }, [id, socket]);

  if (error) {
    return <div className={styles.error}>Error fetching build details</div>;
  }

  const createdAt = moment(build.createdAt).format('MMMM Do YYYY, HH:mm A');
  const buildAuthor = build.authorName;

  const showCancelButton =
    build.status === BUILD_STATUS.QUEUED ||
    build.status === BUILD_STATUS.BUILDING;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>Build Details</div>
        {showCancelButton ? (
          <button
            className={`btn ${styles.cancelButton}`}
            onClick={onCancelBuild}
          >
            Cancel Build
          </button>
        ) : null}
      </div>
      <BuildStatus
        status={build.status}
        createdAt={build.createdAt}
        duration={build.duration}
      />
      <div className={styles.content}>
        <div>{buildAuthor}</div>
        <div>{createdAt}</div>
      </div>
    </div>
  );
};

export default BuildDetails;
