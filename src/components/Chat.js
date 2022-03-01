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
import ClearIcon from '@material-ui/icons/Clear';
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
}

const Chat = () => {
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
      setText({});
    },
    [messages],
  );

  const removeOneMsgs = useCallback(
    () => {
      for (let i = 0; i < messages.length && i < 1; i++) {
        Storage.remove(messages[i], { level: 'public' });

        setText(o => ({
          ...o,
          [messages[i]]: undefined,
        }));
      }
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

  const sendMsgJson = useCallback(
    msg => {
      const uts = Date.now();
      const d = new Date(uts);
      const startStr = d.toISOString().split('T')[0];

      const strr = startStr + '_' + d.getHours() + '-' + d.getMinutes() + '-' + d.getSeconds() + '_' + randomNum(0, 9) + '.json';
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
          const deser = JSON.parse(str);

          setText(o => ({
            ...o,
            [newFiles[i]]: deser,
          }));
        });
      });
    }
  }, [cachedMsgs, messages]);

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
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
      }}
      >
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
        <IconButton
          aria-label='delete'
          color='primary'
          onClick={removeOneMsgs}
          style={{
            textTransform: 'none', fontSize: 26,
          }}
        >

          <ClearIcon />
        </IconButton>

      </div>
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
          // type='text'
          autoComplete='off'
          type=''
          label='Message'
          value={newMsg}
          onChange={event => setNewMsg(event.target.value)}
          InputLabelProps={{ style: { fontSize: 24 } }} // font size of input label
          InputProps={{ style: { fontSize: 22 } }}
          onKeyPress={ev => {
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

export default Chat;
