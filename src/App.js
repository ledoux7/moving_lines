import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <p>
          Games?
        </p>
        <a
          className='App-link'
          href='https://www.youtube.com/watch?v=RNZt5P_32_U'
          target='_blank'
          rel='noopener noreferrer'
        >
          Learn CSGO
        </a>
      </header>
    </div>
  );
}

export default App;
