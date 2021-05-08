/* eslint-disable no-loop-func */
import React, {
  useState, useEffect, useCallback, useRef,
} from 'react';
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
}

export function DOMRectToObject(element) {
  const rect = element.getBoundingClientRect();
  return {
    top: rect.top,
    right: rect.right,
    bottom: rect.bottom,
    left: rect.left,
    width: rect.width,
    height: rect.height,
    x: rect.x,
    y: rect.y,
  };
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

  const messagesEndRef = useRef(null);
  const chatRef = useRef(null);

  useEffect(() => {
    // console.log(messages);

    const nm = Object.values(messagesObj);
    nm.sort((aa, bb) => aa.uts - bb.uts);
    // nm.sort((aa, bb) => aa.message - bb.message);
    const tmpRect = DOMRectToObject(chatRef.current);

    console.log('tmp', tmpRect);

    messagesEndRef.current.scrollIntoView(false, { block: 'end', inline: 'end' });

    setMessages(nm);
    // return () => {
    //   cleanup
    // }
  }, [messagesObj]);

  return (
    <div
      style={{
        minHeight: 'min-content',
        height: '100%',
        width: '100%',
      }}
      id={'ui-chat'}
    >
      <div
        style={{
          maxHeight: '100%',
          overflowY: 'scroll',
          overflowX: 'hidden',
        }}
        ref={chatRef}
      >
        {
        messages
          // .slice(0, 5)
          .filter(m => !!m)
          .map(m => (
            <div
              key={m.uts}
              style={{
                display: 'flex',
                flexDirection: 'row',
                background: '#ef6c00',
                width: 'auto',
                lineHeight: '24px',
                borderRadius: 25,
                marginBottom: 10,
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
              }}
              >
                {m.message}
              </div>
            </div>
          ))
      }
        <div style={{ height: 25 }} />
        <div ref={messagesEndRef} />
      </div>

    </div>
  );
};

export default ChatUI;
