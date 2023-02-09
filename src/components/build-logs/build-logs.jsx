import React, { useCallback, useEffect, useState } from 'react';
import Log from './build-log';
import client from '../../services/axios';

import styles from './build-logs.module.css';

const BuildLogs = ({ id, socket }) => {
  const [logs, setLogs] = useState([]);

  // Fetch build logs
  const fetchBuildLogs = useCallback(async () => {
    const response = await client.get(`/logs/${id}`);
    console.log('response', response);
    const currentLogs = response.data || [];
    setLogs(currentLogs);
  }, [id]);

  useEffect(() => {
    fetchBuildLogs();
  }, [fetchBuildLogs]);

  // Listen for new logs
  useEffect(() => {
    socket.on('build-logs', (data) => {
      console.log('data', data);
      const logs = data?.payload;

      // Check if logs belong to current build
      const belongsToBuild = id === data?.id;

      // Check if logs exist and belong to current build
      if (logs && logs.length > 0 && belongsToBuild) {
        setLogs((prevLogs) => {
          const currentLogs = [...prevLogs];

          // Check if log already exists, if not add it
          logs.forEach((log) => {
            const logIndex = currentLogs.findIndex(
              (current) => current._id === log._id
            );

            if (logIndex === -1) {
              currentLogs.push(log);
            }
          });
          return currentLogs;
        });
      }
    });
  }, [id, socket]);

  const logList = logs.map((log) => {
    return <Log key={log._id} log={log} />;
  });

  if (!logs || logs.length === 0) {
    return null;
  }

  return <div className={styles.container}>{logList}</div>;
};

export default BuildLogs;
