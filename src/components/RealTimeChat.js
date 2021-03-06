import React, {
  useState, useEffect, useCallback, useRef,
} from 'react';
import { TextField, Typography } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import SendIcon from '@material-ui/icons/Send';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import ChatUI from './ChatUI';
import { useAuthState } from '../context/context';

function randomNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const RealTimeChat = ({ stage }) => {
  const didUnmount = useRef(false);
  const [text, setText] = useState({});
  const [newMsg, setNewMsg] = useState('');
  const [socketUrl, setSocketUrl] = useState('wss://dl5pmy7g33.execute-api.eu-west-1.amazonaws.com/' + stage);

  const auth = useAuthState();

  const {
    sendMessage,
    readyState,
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

  // useEffect(() => {
  //   if (lastMessage) {
  //     const lst = JSON.parse(JSON.parse(lastMessage.data).message);
  //     // eslint-disable-next-line arrow-body-style
  //     const hash123 = Array.from(lst.message).reduce((hash, char) => {
  //       // eslint-disable-next-line no-bitwise
  //       return 0 | (31 * hash + char.charCodeAt(0));
  //     }, 0);

  //     console.log('last msg', hash123, lst);
  //   }
  //   // lastJsonMessage && setMessageHistory(prev => prev.concat(lastMessage.data));
  // }, [lastMessage]);

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
        Real Time Chat123{stage === 'dev' ? ': ' + stage : ''}
      </Typography>
      <div style={{
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        flex: 1,
        verticalAlign: 'top',
      }}
      >
        <div style={{
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
        marginBottom: 10,
      }}
      >
        <TextField
          style={{
            width: '92%',
          }}
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
  );
};

export default RealTimeChat;
