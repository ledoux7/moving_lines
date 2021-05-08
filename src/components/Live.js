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
import { useLocation } from 'react-router';
import ChatUI from './ChatUI';
import { useAuthState } from '../context/context';
import VideoPlayer from './VideoPlayer';

function randomNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
const AlwaysScrollToBottom = () => {
  const elementRef = useRef();
  useEffect(() => elementRef.current.scrollIntoView());
  return <div ref={elementRef} />;
};

const RealTimeChat = ({ stage }) => {
  const messageHistory = useRef([]);
  const didUnmount = useRef(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [url, setUrl] = useState('');
  const [text, setText] = useState({});
  const [newMsg, setNewMsg] = useState('');
  const [messages, setMessages] = useState([]);
  const [cachedMsgs, setCachedMsgs] = useState(new Set());
  // const [stage, setStage] = useState('prod');
  const [socketUrl, setSocketUrl] = useState('wss://dl5pmy7g33.execute-api.eu-west-1.amazonaws.com/' + stage);

  const scroll = useRef(false);

  const scrollBottom = useCallback(
    () => {
      scroll.current.scrollTop = scroll.current.scrollHeight;
    },
    [],
  );
  const auth = useAuthState();

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
        const realMsg = JSON.parse(deser.message);

        setText(o => ({
          ...o,
          [realMsg.fileName]: realMsg,
        }));
      }
      catch (error) {
        console.error('error in onmessage');
      }
    },
    queryParams: {
      auth: auth && auth.session ? auth.session.idToken.jwtToken : '123',
    },
  });

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
      // const tStr = d.toISOString().split('T')[1];

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
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      flex: 1,
      position: 'relative',
      overflow: 'hidden',

    }}
    >
      <div style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
      >
        <VideoPlayer url={'https://videos.nba.com/nba/pbp/media/2021/05/07/0022001004/13/2b83976b-6fca-5f37-a4b6-cb6f5701e1ca_1280x720.mp4'} />
      </div>
      <div style={{
        height: '100%',
        width: 286,

        display: 'flex',
        flexDirection: 'column',
        margin: 20,
        position: 'relative',
      }}
      >
        <div style={{
          height: '100%',
          width: '100%',
          position: 'relative',
          display: 'flex',
          flex: 1,
          verticalAlign: 'top',
          overflow: 'hidden',
        }}
        >
          <div
            style={{
              flex: 1,
              overflowY: 'scroll',
            }}
          >
            <ChatUI messagesObj={text} />
          </div>
        </div>

        <div style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          marginBottom: 20,
          marginTop: 10,
        }}
        >
          <TextField
            style={{
              width: '92%',
            }}
          // type='text'
            autoComplete='off'
            type=''
            label='Message'
            value={newMsg}
            onChange={event => setNewMsg(event.target.value)}
            InputLabelProps={{ style: { fontSize: 24 } }} // font size of input label
            InputProps={{ style: { fontSize: 22 } }}
            onKeyPress={ev => {
              if (newMsg && ev.key === 'Enter') {
                sendMsgJson(newMsg);
                setNewMsg('');
              }
            }}
          />
          <IconButton
            aria-label='delete'
            color='primary'
            onClick={() => {
              sendMsgJson(newMsg);
              setNewMsg('');
            }}
            style={{
              textTransform: 'none', height: 55, fontSize: 26, marginTop: 10,
            }}
          >
            <SendIcon />
          </IconButton>

        </div>
      </div>

    </div>
  );
};

export default RealTimeChat;
