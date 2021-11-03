/* eslint-disable no-loop-func */
import React, {
  useState, useEffect, useCallback, useMemo, useRef,
} from 'react';
import { AmplifyS3Image } from '@aws-amplify/ui-react';
import { a, Hub, Storage } from 'aws-amplify';
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
import FileDownloader from './FileDownloader';

function randomNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const Dashboard = ({ stage }) => {
  const messageHistory = useRef([]);
  const didUnmount = useRef(false);
  const [email, setEmail] = useState('');

  const [exeId, setExeId] = useState(null);
  const [password, setPassword] = useState('');
  const [url, setUrl] = useState('');
  const [text, setText] = useState({});
  const [newMsg, setNewMsg] = useState('');
  const [messages, setMessages] = useState([]);
  const [cachedMsgs, setCachedMsgs] = useState(new Set());
  // const [stage, setStage] = useState('prod');
  // const [socketUrl, setSocketUrl] = useState('wss://dl5pmy7g33.execute-api.eu-west-1.amazonaws.com/' + stage);
  const [socketUrl, setSocketUrl] = useState(null);
  const [stepUrl, setStepUrl] = useState('https://04nl4c8kt3.execute-api.eu-west-1.amazonaws.com/prod');
  const [parsedCsvData, setParsedCsvData] = useState([]);

  const auth = useAuthState();

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
    'repoData',
    () => fetch(stepUrl).then(res => res.json()), {
      refetchOnWindowFocus: false,
      enabled: false, // needed to handle refetchs manually
    },
  );

  const connect = useCallback(
    () => {
      if (exeId) {
        setSocketUrl('wss://og7ddzk1ob.execute-api.eu-west-1.amazonaws.com/dev');
      }
    },
    [exeId],
  );

  const runQuery = useCallback(
    () => {
      // connect()
      refetch();
    },
    [refetch],
  );

  useEffect(() => {
    console.log('date', Math.floor((Date.now() / 1000 + 90)));
    return () => {
    };
  }, []);

  useEffect(() => {
    if (data) {
      const abc = data.executionArn.split(':').pop();
      setExeId(abc);
    }
    return () => {

    };
  }, [connect, data]);

  useEffect(() => {
    if (exeId) {
      connect();
    }
    return () => { };
  }, [connect, exeId]);

  const {
    sendMessage,
    sendJsonMessage,
    lastMessage,
    lastJsonMessage,
    readyState,
    getWebSocket,
  } = useWebSocket(socketUrl, {
    onOpen: () => console.log('opened'),
    onMessage: msg => {
      try {
        const deser = JSON.parse(msg.data);
        // console.log('onMsg: ', deser);

        // const realMsg = JSON.parse(deser.message);
        // console.log('onMsg Parse: ', sec);

        // setText(o => ({
        //   ...o,
        //   [realMsg.fileName]: realMsg,
        // }));

        setText(deser);

        setUrl(deser.url);
      }
      catch (error1) {
        console.error('error in onmessage');
      }
    },
    queryParams: {
      auth: auth && auth.session ? auth.session.idToken.jwtToken : '123',
      QueryExecutionId: exeId,
    },
    // Will attempt to reconnect on all close events, such as server shutting down
    // eslint-disable-next-line arrow-body-style
    // sshouldReconnect: closeEvent => {
    //   /*
    //     useWebSocket will handle unmounting for you, but this is an example of a
    //     case in which you would not want it to automatically reconnect
    //   */
    //   return didUnmount.current === false;
    // },
    // reconnectAttempts: 3,
    // reconnectInterval: 5000,
  });

  // messageHistory.current = useMemo(
  //   () => messageHistory.current.concat(lastMessage), [lastMessage]
  // );

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  useEffect(() => () => {
    didUnmount.current = true;
  }, []);

  const sendMsgJson = useCallback(
    msg => {
      const uts = Date.now();
      const d = new Date(uts);
      const curDate = d.getDate();
      const curMonth = d.getMonth() + 1; // Months are zero based
      const curYear = d.getFullYear();

      const startStr = d.toISOString().split('T')[0];

      const strr = startStr + '_' + d.getHours() + '-' + d.getMinutes() + '-' + d.getSeconds() + '_' + randomNum(0, 9) + '.json';
      const pretty = startStr + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();

      const obj = {
        uts,
        pretty,
        fileName: strr,
        time: d.toLocaleTimeString('nb-NO'),
        message: msg,
      };

      sendMessage(JSON.stringify({ action: 'onmessage', message: JSON.stringify(obj) }));
    },
    [sendMessage],
  );

  return (
    <div style={{
      maxHeight: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      margin: '0px 20px',
      overflow: 'hidden',
      position: 'relative',
    }}
    >
      <Typography
        component='h1'
        variant='h3'
        noWrap
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: ' center',
          paddingTop: 20,
          paddingBottom: 20,
        }}
      >
        <div style={{ position: 'absolute', left: 0, top: 0 }}>
          {ReadyState[readyState]}
        </div>
        Dashboard{stage === 'dev' ? ': ' + stage : ''}
      </Typography>

      <div style={{
        display: 'flex',
        flexDirection: 'column',

      }}
      >
        <Button
          variant='contained'
          style={{
            textTransform: 'none', width: 200, height: 55, fontSize: 26, marginBottom: 20,
          }}
          color='primary'
          onClick={runQuery}
        >
          Run Query
        </Button>
        <div>
          {JSON.stringify(exeId)}
        </div>

        <FileDownloader url={url} />

      </div>
    </div>
  );
};

export default Dashboard;
