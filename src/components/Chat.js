/* eslint-disable no-loop-func */
import React, { useState, useEffect, useCallback } from 'react';
import { AmplifyS3Image } from '@aws-amplify/ui-react';
import { Hub, Storage } from 'aws-amplify';
import { Button } from '@material-ui/core';

function randomNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const Chat = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [url, setUrl] = useState('');
  const [text, setText] = useState({});
  const [messages, setMessages] = useState([]);

  const [locUser, setLocUser] = useState(null);

  const upload = useCallback(
    () => {
      Storage.list('', { level: 'public' }) // for listing ALL files without prefix, pass '' instead
        .then(result => {
          console.log(result);
          setMessages(result.map(r => r.key).filter(k => k.includes('.txt')));
        })
        .catch(err => console.log(err));
    },

    [],
  );

  useEffect(() => {
    const obj = {};

    for (let i = 0; i < messages.length; i++) {
      const result = Storage.get(messages[i], {
        level: 'public',
        // identityId: '1',
        // level: '',
        download: true,

        contentType: 'text/plain',
      }).then(data => {
        console.log('Get:', messages[i], data);
        data.Body.text().then(str => {
          // handle the String data return String
          console.log('str:', str);

          // setText(str);
          setText(o => ({
            ...o,
            [messages[i]]: str,
          }));
        });
      });
    }
  }, [messages]);

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
      <div style={{ fontSize: 18 }}>
        <pre s>
          {JSON.stringify(text, null, 2)}
        </pre>
        <Button
          variant='contained'
          style={{
            textTransform: 'none', width: '100%', height: 55, fontSize: 26,
          }}
          color='primary'
          onClick={upload}
        >
          Show
        </Button>
      </div>
    </div>
  );
};

export default Chat;
