import React from 'react';
import '../App.css';

function App() {
  return (
    <div style={{
      fontSize: 60,
      height: 1600,
      position: 'relative',
      display: 'flex',
      justifyContent: 'center',
      width: '100%',

    }}
    >
      Home
      <div style={{
        position: 'absolute',
        top: '30%',
      }}
      >
        scroll down
      </div>
      <div style={{
        position: 'absolute',
        bottom: 0,
      }}
      >
        bottom and no toolbar
      </div>

    </div>
  );
}

export default App;
