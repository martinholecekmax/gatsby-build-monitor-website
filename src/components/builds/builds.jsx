import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

import client from '../../services/axios';
import BuildCard from '../build-card/build-card';

import * as styles from './builds.module.css';

const Builds = () => {
  const socket = io.connect(import.meta.env.VITE_API_URL);

  const [builds, setBuilds] = useState([]);
  const [error, setError] = useState(null);

  // Get builds
  const fetchBuilds = async () => {
    try {
      const response = await client('/builds');
      const builds = response.data || [];
      setBuilds(builds);
    } catch (error) {
      console.log(error);
      setError(error);
    }
  };

  // Cancel build
  const onCancelBuild = async (buildId) => {
    const response = await client.get(`/cancel-build/${buildId}`);
    console.log('response', response);
  };

  useEffect(() => {
    fetchBuilds();
  }, []);

  // Listen for build status updates
  useEffect(() => {
    socket.on('build-status', (data) => {
      const build = data?.payload;
      if (build) {
        // Update builds
        setBuilds((prevBuilds) => {
          // Copy previous builds so we don't mutate state
          const currentBuilds = [...prevBuilds];

          // Find index of build
          const buildIndex = currentBuilds.findIndex(
            (current) => current._id === build._id
          );

          // If build exists, update it, otherwise add it
          if (buildIndex !== -1) {
            currentBuilds[buildIndex] = build;
          } else {
            currentBuilds.push(build);
          }

          // Remove duplicates
          const uniqueBuilds = currentBuilds.filter(
            (build, index, self) =>
              index === self.findIndex((t) => t._id === build._id)
          );

          // Sort by date
          const sortedBuilds = uniqueBuilds.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
          });
          return sortedBuilds;
        });
      }
    });
  }, [socket]);

  const renderBuilds = builds.map((build) => (
    <BuildCard key={build._id} build={build} onCancelBuild={onCancelBuild} />
  ));

  return (
    <div className={styles.container}>
      {error ? <div className={styles.error}>Error fetching builds</div> : null}
      {renderBuilds}
    </div>
  );
};

export default Builds;
