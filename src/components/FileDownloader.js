/* eslint-disable no-loop-func */
import React, {
  useState, useEffect, useCallback, useMemo, useRef,
} from 'react';
import { Button, TextField, Typography } from '@material-ui/core';
import CachedIcon from '@material-ui/icons/Cached';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import SendIcon from '@material-ui/icons/Send';
import ClearAllIcon from '@material-ui/icons/ClearAll';
import ClearIcon from '@material-ui/icons/Clear';
import useWebSocket, { ReadyState } from 'react-use-websocket';
// import { useLocation } from 'react-router';
import { useQuery } from 'react-query';
import Papa from 'papaparse';
import ChatUI from './ChatUI';
import { useAuthState } from '../context/context';

function randomNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const FileDownloader = ({ stage, url }) => {
  const auth = useAuthState();
  const [parsedCsvData, setParsedCsvData] = useState([]);

  const parseFile = string => {
    Papa.parse(string, {
      header: true,
      complete: results => {
        setParsedCsvData(results.data);
      },
    });
  };
  const {
    isLoading, error, data, refetch,
  } = useQuery(
    'content',
    () => fetch(url).then(res => {
      const t = res.text().then(c => {
        console.log('te', c);
        parseFile(c);
      });
    }),
    {
      refetchOnWindowFocus: false,
      enabled: false, // needed to handle refetchs manually
    },
  );

  useEffect(() => {
    if (url) {
      refetch();
    }
    return () => {
    };
  }, [refetch, url]);

  const runQuery = useCallback(
    () => {
      refetch();
    },
    [refetch],
  );

  return (
    <div style={{ overflow: 'scroll', height: 800 }}>
      <pre>
        {JSON.stringify(url, null, 2)}
        {/* {JSON.stringify(parsedCsvData, null, 2)} */}
        {JSON.stringify(parsedCsvData.map(obj => obj.game_id), null, 2)}
      </pre>

    </div>
  );
};

export default FileDownloader;
