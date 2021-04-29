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
import { red } from '@material-ui/core/colors';

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

const ChatUI = ({ messagesObj }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [url, setUrl] = useState('');
  const [text, setText] = useState({});
  const [newMsg, setNewMsg] = useState('');

  const re = Object.values(messagesObj);
  // .reduce((acc, cur) => {

  // } )

  const [messages, setMessages] = useState(re);

  const [cachedMsgs, setCachedMsgs] = useState(new Set());

  const [locUser, setLocUser] = useState(null);

  useEffect(() => {
    // console.log(messages);

    const nm = Object.values(messagesObj);
    nm.sort((aa, bb) => aa.uts - bb.uts);
    // nm.sort((aa, bb) => aa.message - bb.message);

    setMessages(nm);
    // return () => {
    //   cleanup
    // }
  }, [messagesObj]);

  return (
    <div style={{
      // height: 'auto !important',
      // width: '100vw',
      // overflowY: 'scroll',
      // overflowX: 'hidden',
      minHeight: 'min-content',
      // maxHeight: '90%',

      // display: 'flex',
      // flexDirection: 'column',
      height: '100%',
      width: '100%',
      // display: 'flex',
      // flexDirection: 'column',
      // justifyContent: 'safe center',
      // alignItems: 'safe flex-start',
    }}
    >
      <div style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        // maxHeight: 400,
        maxHeight: '100%',

        overflowY: 'scroll',
        overflowX: 'hidden',
      }}
      >
        {
        messages
          // .slice(0, 5)
          .map(m => (
            <div
              key={m.uts}
              style={{
              // position: 'absolute',
                display: 'flex',
                flexDirection: 'row',
                background: '#ef6c00',
                // alignItems: 'flex-start',
                // width: 300,
                // width: '100%',
                // height:
                width: 'auto',

                lineHeight: '24px',

                borderRadius: 25,
                marginBottom: 10,
              // overflow: 'scroll',
              }}
            >
              <div style={{
                marginRight: 10,
                paddingLeft: 5,
                wordBreak: 'keep-all',
                height: 'auto',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
              >
                {m.time + ': '}
              </div>
              <div style={{
                marginRight: 10,
                display: 'flex',
              // paddingLeft: 5,
              // wordBreak: 'keep-all',
              }}
              >
                {m.message}
              </div>
            </div>
          ))
      }

      </div>

    </div>
  );
};

export default ChatUI;
