import React from 'react';
import '../App.css';

function App() {
  return (
    <div style={{
      fontSize: 60,
      height: '100%',
      display: 'flex',
      width: '100%',
      overflow: 'scroll',
      flexDirection: 'column',
      overflowY: 'scoll',
      marginRight: 100,
      position: 'relative',
    }}
    >
      <div>
        Home
      </div>
      <div style={{
        height: 600,
        paddingTop: 200,
        margin: 'auto',
      }}
      >
        scroll down
      </div>
      <div style={{
        marginTop: 1600,
        height: 50,
      }}
      >
        bottom and no toolbar
      </div>

    </div>
  );
}

export default App;
