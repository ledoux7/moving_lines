/* eslint-disable no-loop-func */
import React, { useState, useEffect, useCallback } from 'react';
import { AmplifyS3Image } from '@aws-amplify/ui-react';
import { Hub, Storage } from 'aws-amplify';
import { Button, TextField } from '@material-ui/core';
import CachedIcon from '@material-ui/icons/Cached';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import SendIcon from '@material-ui/icons/Send';
import ClearAllIcon from '@material-ui/icons/ClearAll';

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
    },
    [messages],
  );

  const getMessages = useCallback(
    () => {
      Storage.list('', { level: 'public' }) // for listing ALL files without prefix, pass '' instead
        .then(result => {
          console.log(result);
          const mappedRes = result.map(r => r.key).filter(k => k.includes('.txt'));
          setMessages(mappedRes);
        })
        .catch(err => console.log(err));
    },

    [],
  );

  const sendMsg = useCallback(
    msg => {
      const dd = new Date(Date.now());

      const fileD = dd.toLocaleString('nb-no')
        .replace('.', '-')
        .replace(',', '_')
        .replace(' ', '');

      const file = fileD + '.txt';

      const formatMsg = dd.toLocaleString('nb-no').replace(',', '') + ': ' + msg;
      const result = Storage.put(file, formatMsg, {
        level: 'public',
        contentType: 'text/plain',
      }).then(d => {
        console.log('Uploaded:', file, d);
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

        contentType: 'text/plain',
      }).then(data => {
        console.log('Get:', newFiles[i], data);
        setCachedMsgs(set => set.add(newFiles[i]));
        data.Body.text().then(str => {
          // handle the String data return String
          console.log('str:', str);

          // setText(str);
          setText(o => ({
            ...o,
            [newFiles[i]]: str,
          }));
        });
      });
    }
  }, [cachedMsgs, messages]);

  return (
    <div style={{
      // height: '100vh',
      // width: '100vw',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    }}
    >
      <div>
        Delete All Messages
        <IconButton
          aria-label='delete'
          color='primary'
          onClick={removeAllMsgs}
          style={{
            textTransform: 'none', height: 55, fontSize: 26, marginBottom: 20,
          }}
        >

          <ClearAllIcon />
        </IconButton>

      </div>
      <IconButton
        aria-label='delete'
        color='primary'
        onClick={getMessages}
        style={{
          textTransform: 'none', height: 55, fontSize: 26, marginBottom: 20,
        }}
      >
        <CachedIcon />
      </IconButton>

      {/* <div style={{ fontSize: 18 }}> */}
      <pre s>
        {/* {JSON.stringify(text, null, 2)} */}
        {JSON.stringify(Object.values(text), null, 2)}

      </pre>

      <div>
        <TextField
          label='Message'
          value={newMsg}
          onChange={event => setNewMsg(event.target.value)}
          InputLabelProps={{ style: { fontSize: 24 } }} // font size of input label
          InputProps={{ style: { fontSize: 22 } }}
          onKeyPress={ev => {
            console.log(`Pressed keyCode ${ev.key}`);
            if (ev.key === 'Enter') {
              sendMsg(newMsg);
              setNewMsg('');
            }
          }}
        />
        <IconButton
          aria-label='delete'
          color='primary'
          onClick={() => {
            sendMsg(newMsg);
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
