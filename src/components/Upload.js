import React, { useState, useEffect, useCallback } from 'react';
import { Storage } from 'aws-amplify';
import { Button, TextField } from '@material-ui/core';

function randomNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const Chat = () => {
  const [email, setEmail] = useState('');
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');

  const [locUser, setLocUser] = useState(null);

  const upload = useCallback(
    () => {
      const file = 'test' + randomNum(0, 1000) + '.txt';
      const result = Storage.put(file, text, {
        level: 'public',
        contentType: 'text/plain',
      }).then(d => {
        console.log('Uploaded:', file, d);
      });
    },
    [text],
  );

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    }}
    >
      <div style={{
        fontSize: 50,
      }}
      >
        <TextField
          label='Text'
          onChange={event => setText(event.target.value)}
          InputLabelProps={{ style: { fontSize: 24 } }} // font size of input label
          InputProps={{ style: { fontSize: 22 } }}
        />
        <Button
          variant='contained'
          style={{
            textTransform: 'none', width: '100%', height: 55, fontSize: 26,
          }}
          color='primary'
          onClick={upload}
        >
          Upload
        </Button>
      </div>
    </div>
  );
};

export default Chat;
