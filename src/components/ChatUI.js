import React, {
  useState, useEffect, useRef,
} from 'react';

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
  const re = Object.values(messagesObj);
  const [messages, setMessages] = useState(re);

  const messagesEndRef = useRef(null);
  const chatRef = useRef(null);

  useEffect(() => {
    const nm = Object.values(messagesObj);
    nm.sort((aa, bb) => aa.uts - bb.uts);
    // const tmpRect = DOMRectToObject(chatRef.current);
    messagesEndRef.current.scrollIntoView(false, { block: 'end', inline: 'end' });

    setMessages(nm);
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
