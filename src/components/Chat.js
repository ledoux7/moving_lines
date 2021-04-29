/* eslint-disable no-loop-func */
import React, { useState, useEffect, useCallback } from 'react';
import { AmplifyS3Image } from '@aws-amplify/ui-react';
import { a, Hub, Storage } from 'aws-amplify';
import { Button, TextField } from '@material-ui/core';
import CachedIcon from '@material-ui/icons/Cached';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import SendIcon from '@material-ui/icons/Send';
import ClearAllIcon from '@material-ui/icons/ClearAll';
import ChatUI from './ChatUI';

function randomNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

class GeneralSet {
  constructor() {
    this.map = new Map();
    this[Symbol.iterator] = this.values;
  }

  add(item) {
    this.map.set(item.toIdString(), item);
  }

  values() {
    return this.map.values();
  }

  delete(item) {
    return this.map.delete(item.toIdString());
  }

  // ...
}

const Chat = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [url, setUrl] = useState('');
  const [text, setText] = useState({});
  const [newMsg, setNewMsg] = useState('');

  const [messages, setMessages] = useState([]);

  const [cachedMsgs, setCachedMsgs] = useState(new Set());

  const [locUser, setLocUser] = useState(null);

  const removeAllMsgs = useCallback(
    () => {
      for (let i = 0; i < messages.length; i++) {
        Storage.remove(messages[i], { level: 'public' });
      }

      setMessages([]);
    },
    [messages],
  );

  const getMessages = useCallback(
    () => {
      Storage.list('', { level: 'public' }) // for listing ALL files without prefix, pass '' instead
        .then(result => {
          console.log(result);
          const mappedRes = result.map(r => r.key).filter(k => k.includes('.json'));
          setMessages(mappedRes);
        })
        .catch(err => console.log(err));
    },

    [],
  );

  // const sendMsg = useCallback(
  //   msg => {
  //     const dd = new Date(Date.now());

  //     const fileD = dd.toLocaleString('nb-no')
  //       .replace('.', '-')
  //       .replace(',', '_')
  //       .replace(' ', '');

  //     const file = fileD + '.txt';

  //     const formatMsg = dd.toLocaleString('nb-no').replace(',', '') + ': ' + msg;
  //     const result = Storage.put(file, formatMsg, {
  //       level: 'public',
  //       contentType: 'text/plain',
  //     }).then(d => {
  //       console.log('Uploaded:', file, d);
  //     });

  //     setTimeout(() => {
  //       getMessages();
  //     }, 1000);
  //     // setNewMsg('');
  //   },
  //   [getMessages],
  // );

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
      // + console.log(curDate + '-' + curr_month + '-' + curr_year);
      const pretty = startStr + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();

      // const fileD = dd.toLocaleString('nb-no')
      //   .replace('.', '-')
      //   .replace(',', '_')
      //   .replace(' ', '');

      const obj = {
        uts,
        pretty,
        fileName: strr,
        time: d.toLocaleTimeString('nb-NO'),
        message: msg,
      };

      // const file = fileD + '.txt';

      // const formatMsg = dd.toLocaleString('nb-no').replace(',', '') + ': ' + msg;

      console.log('msg', obj);
      const result = Storage.put(strr, JSON.stringify(obj, null, 2), {
        level: 'public',
        contentType: 'application/json',
      }).then(putData => {
        console.log('Uploaded:', putData);
      });

      setTimeout(() => {
        getMessages();
      }, 1000);
      // setNewMsg('');
    },
    [getMessages],
  );

  useEffect(() => {
    const obj = {};
    const newFiles = messages.filter(item => !cachedMsgs.has(item));

    for (let i = 0; i < newFiles.length; i++) {
      const result = Storage.get(newFiles[i], {
        level: 'public',
        // identityId: '1',
        // level: '',
        download: true,

        contentType: 'application/json',
      }).then(data => {
        console.log('Get:', newFiles[i], data);
        setCachedMsgs(set => set.add(newFiles[i]));
        data.Body.text().then(str => {
          // handle the String data return String
          console.log('str:', str);

          const deser = JSON.parse(str);

          // setText(str);
          setText(o => ({
            ...o,
            [newFiles[i]]: deser,
          }));
        });
      });
    }
  }, [cachedMsgs, messages]);

  // console.log(text);

  useEffect(() => {
    console.log(text);
    // return () => {
    //   cleanup
    // }
  }, [text]);

  return (
    <div style={{
      // height: '100vh',
      // maxHeight: 'calc(100% -199px)',
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      margin: '0px 20px',
      overflow: 'hidden',
      position: 'relative',
      // justifyContent: 'center',
      // alignItems: 'center',
    }}
    >
      {/* <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        // 'height': '70px',

      }}
      > */}
      {/* <div>
          Clear

        </div> */}
      <IconButton
        aria-label='delete'
        color='primary'
        onClick={removeAllMsgs}
        style={{
          textTransform: 'none', fontSize: 26,
        }}
      >

        <ClearAllIcon />
      </IconButton>

      {/* </div> */}
      <IconButton
        aria-label='delete'
        color='primary'
        onClick={getMessages}
        style={{
          textTransform: 'none', height: 30, fontSize: 26, display: 'flex', justifyContent: 'flex-end',
        }}
      >
        <CachedIcon />
      </IconButton>

      {/* <div style={{ fontSize: 18 }}> */}
      {/* <pre style={{
        whiteSpace: 'pre-wrap',
        width: '100%',
      }}
      >
        {JSON.stringify(Object.values(text), null, 2)}

      </pre> */}
      <div style={{
        overflow: 'hidden',
        height: '75%',
        position: 'relative',
        display: 'flex',
        // height: 'calc(60vh - 70px)',
        // minHeight: '100%',
      }}
      >
        {/* <div style={{
          marginTop: 80,
        }}
        >
          abc
        </div> */}
        <ChatUI messagesObj={text} />
      </div>

      <div style={{
        position: 'absolute',
        bottom: 0,
        width: '85%',
        // marginLeft: 20,
      }}
      >
        <TextField
          style={{
            width: '80%',
          }}
          label='Message'
          value={newMsg}
          onChange={event => setNewMsg(event.target.value)}
          InputLabelProps={{ style: { fontSize: 24 } }} // font size of input label
          InputProps={{ style: { fontSize: 22 } }}
          onKeyPress={ev => {
            // console.log(`Pressed keyCode ${ev.key}`);
            if (ev.key === 'Enter') {
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
            // getMessages();
          }}
          style={{
            textTransform: 'none', height: 55, fontSize: 26, marginBottom: 20,
          }}
        >
          <SendIcon />
        </IconButton>

      </div>
    </div>
  );
};

export default Chat;
